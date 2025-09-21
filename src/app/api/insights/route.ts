import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/password';
import { getGeminiSuggestion } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    // Get JWT token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const { timeRangeData } = await request.json();

    if (!timeRangeData || !Array.isArray(timeRangeData)) {
      return NextResponse.json({ error: 'Invalid time range data' }, { status: 400 });
    }

    // Calculate totals and percentages
    const totals = timeRangeData.reduce((acc, range) => {
      acc.focused += range.emotions.focused;
      acc.tired += range.emotions.tired;
      acc.stressed += range.emotions.stressed;
      return acc;
    }, { focused: 0, tired: 0, stressed: 0 });

    const totalDetections = totals.focused + totals.tired + totals.stressed;

    // Only generate insights if we have meaningful data
    if (totalDetections < 5) {
      return NextResponse.json({
        insights: ["Not enough data yet. Keep using the extension to generate personalized insights!"]
      });
    }

    // Prepare data for Gemini
    const formattedData = timeRangeData.map(range => ({
      timePeriod: range.name,
      focused: Math.round((range.emotions.focused / (range.emotions.focused + range.emotions.tired + range.emotions.stressed)) * 100),
      tired: Math.round((range.emotions.tired / (range.emotions.focused + range.emotions.tired + range.emotions.stressed)) * 100),
      stressed: Math.round((range.emotions.stressed / (range.emotions.focused + range.emotions.tired + range.emotions.stressed)) * 100)
    }));

    const overallFocused = Math.round((totals.focused / totalDetections) * 100);
    const overallStressed = Math.round((totals.stressed / totalDetections) * 100);
    const overallTired = Math.round((totals.tired / totalDetections) * 100);

    // Create a detailed prompt for Gemini
    const prompt = `Based on this productivity data from emotion tracking, generate exactly 4 concise insights (exactly 1 sentence each) as bullet points. Focus on patterns and observations.

Data:
- Overall: ${overallFocused}% focused, ${overallTired}% tired, ${overallStressed}% stressed
- Time periods: ${JSON.stringify(formattedData, null, 2)}

Generate exactly 4 insights about:
1. When the user is most/least focused
2. Stress patterns
3. Fatigue levels
4. Overall productivity patterns

Format as exactly 4 bullet points, keep each insight to exactly 1 sentence, and make them observational and concise.`;

    try {
      console.log('🤖 Sending prompt to Gemini:', prompt.substring(0, 200) + '...');
      const geminiResponse = await getGeminiSuggestion(prompt);
      console.log('🤖 Gemini response:', geminiResponse);
      
      // Parse the response into bullet points
      let insights = geminiResponse
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 10); // Filter out very short lines

      // Ensure we have exactly 4 insights
      if (insights.length > 4) {
        insights = insights.slice(0, 4);
      } else if (insights.length < 4) {
        // If we have fewer than 4, pad with generic insights
        const genericInsights = [
          "Your productivity patterns show room for optimization.",
          "Consider adjusting your work environment for better focus.",
          "Your stress levels indicate potential for better work-life balance.",
          "Time management improvements could enhance your productivity."
        ];
        while (insights.length < 4) {
          insights.push(genericInsights[insights.length] || "Continue monitoring your productivity patterns for better insights.");
        }
      }

      console.log('📝 Parsed insights:', insights);
      
      if (insights.length === 0) {
        return NextResponse.json({ 
          error: 'No insights could be generated from the response.' 
        }, { status: 500 });
      }

      return NextResponse.json({ insights });
    } catch (geminiError) {
      console.error('❌ Gemini API error:', geminiError);
      return NextResponse.json({ 
        error: `Failed to generate insights: ${geminiError instanceof Error ? geminiError.message : 'Unknown error'}` 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
