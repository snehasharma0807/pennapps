import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import EmotionEvent from '@/models/EmotionEvent';

// POST /api/emotions - Record emotion event
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Find or create user
    let user = await User.findOne({ auth0Id: session.user.sub });
    if (!user) {
      user = await User.create({
        auth0Id: session.user.sub,
        email: session.user.email,
        name: session.user.name || session.user.email,
      });
    }

    const { emotion, confidence } = await request.json();

    if (!emotion || !['focused', 'tired', 'stressed'].includes(emotion)) {
      return NextResponse.json({ error: 'Invalid emotion' }, { status: 400 });
    }

    // Determine time of day
    const hour = new Date().getHours();
    let timeOfDay: string;
    if (hour >= 5 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 23) timeOfDay = 'evening';
    else timeOfDay = 'late_night';

    const emotionEvent = await EmotionEvent.create({
      userId: user._id,
      emotion,
      confidence: confidence || 0,
      timeOfDay,
    });

    return NextResponse.json({ success: true, emotionEvent });
  } catch (error) {
    console.error('Error recording emotion:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/emotions - Get emotion analytics
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ auth0Id: session.user.sub });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const week = searchParams.get('week') || 'current';
    
    // Calculate date range
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    
    if (week === 'previous') {
      startOfWeek.setDate(startOfWeek.getDate() - 7);
      endOfWeek.setDate(endOfWeek.getDate() - 7);
    }

    // Get emotion events for the week
    const events = await EmotionEvent.find({
      userId: user._id,
      timestamp: { $gte: startOfWeek, $lt: endOfWeek }
    }).sort({ timestamp: 1 });

    // Group by time of day and emotion
    const analytics = {
      morning: { focused: 0, tired: 0, stressed: 0 },
      afternoon: { focused: 0, tired: 0, stressed: 0 },
      evening: { focused: 0, tired: 0, stressed: 0 },
      late_night: { focused: 0, tired: 0, stressed: 0 }
    };

    events.forEach(event => {
      analytics[event.timeOfDay as keyof typeof analytics][event.emotion]++;
    });

    return NextResponse.json({ analytics, events });
  } catch (error) {
    console.error('Error fetching emotions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
