import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// GET /api/user - Get user profile and settings
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    let user = await User.findOne({ auth0Id: session.user.sub });
    if (!user) {
      // Create user if doesn't exist
      user = await User.create({
        auth0Id: session.user.sub,
        email: session.user.email,
        name: session.user.name || session.user.email,
      });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/user - Update user settings
export async function PUT(request: NextRequest) {
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

    const { settings } = await request.json();

    if (settings) {
      user.settings = { ...user.settings, ...settings };
      await user.save();
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
