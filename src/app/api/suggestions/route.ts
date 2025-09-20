import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { getRealtimeSuggestion, getRecurringSuggestion, getAnalyticsSummary, getWeeklySuggestions } from '@/lib/gemini';

// POST /api/suggestions - Get AI suggestions
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, emotion, timeOfDay, emotionData } = await request.json();

    let suggestion: string;

    switch (type) {
      case 'realtime':
        if (!emotion) {
          return NextResponse.json({ error: 'Emotion required for realtime suggestion' }, { status: 400 });
        }
        suggestion = await getRealtimeSuggestion(emotion);
        break;
      
      case 'recurring':
        if (!emotion || !timeOfDay) {
          return NextResponse.json({ error: 'Emotion and timeOfDay required for recurring suggestion' }, { status: 400 });
        }
        suggestion = await getRecurringSuggestion(emotion, timeOfDay);
        break;
      
      case 'analytics':
        if (!emotionData) {
          return NextResponse.json({ error: 'Emotion data required for analytics summary' }, { status: 400 });
        }
        suggestion = await getAnalyticsSummary(emotionData);
        break;
      
      case 'weekly':
        if (!emotionData) {
          return NextResponse.json({ error: 'Emotion data required for weekly suggestions' }, { status: 400 });
        }
        suggestion = await getWeeklySuggestions(emotionData);
        break;
      
      default:
        return NextResponse.json({ error: 'Invalid suggestion type' }, { status: 400 });
    }

    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error('Error getting suggestion:', error);
    return NextResponse.json({ 
      error: 'Failed to generate suggestion',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
