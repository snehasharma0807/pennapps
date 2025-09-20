import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { generateProductivityInsights } from '@/lib/gemini';

// POST /api/insights - Generate productivity insights from emotion data
export async function POST(request: NextRequest) {
  try {
    // Temporarily disable auth check for demo purposes
    // const session = await getSession();
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { emotionData, viewMode } = await request.json();

    if (!emotionData) {
      return NextResponse.json({ error: 'Emotion data required for insights generation' }, { status: 400 });
    }

    if (!viewMode || !['daily', 'weekly'].includes(viewMode)) {
      return NextResponse.json({ error: 'Valid viewMode (daily or weekly) required' }, { status: 400 });
    }

    const insights = await generateProductivityInsights(emotionData, viewMode);

    return NextResponse.json({ insights });
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json({ 
      error: 'Failed to generate insights',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
