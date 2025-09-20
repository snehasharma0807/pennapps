import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { generateProductivitySuggestions } from '@/lib/gemini';

// POST /api/suggestions-productivity - Generate productivity suggestions from emotion data
export async function POST(request: NextRequest) {
  try {
    // Temporarily disable auth check for demo purposes
    // const session = await getSession();
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { emotionData, viewMode } = await request.json();

    if (!emotionData) {
      return NextResponse.json({ error: 'Emotion data required for suggestions generation' }, { status: 400 });
    }

    if (!viewMode || !['daily', 'weekly'].includes(viewMode)) {
      return NextResponse.json({ error: 'Valid viewMode (daily or weekly) required' }, { status: 400 });
    }

    const suggestions = await generateProductivitySuggestions(emotionData, viewMode);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return NextResponse.json({ 
      error: 'Failed to generate suggestions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
