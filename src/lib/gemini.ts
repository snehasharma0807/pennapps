import fetch from "node-fetch";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

if (!GEMINI_API_KEY) {
  console.warn("⚠️ Gemini API key not set. Please set GEMINI_API_KEY in .env.local");
}

export async function getGeminiSuggestion(prompt: string): Promise<string> {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: prompt }] 
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`❌ Gemini API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as any;
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No suggestion available.";
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(`❌ Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper functions for different types of suggestions
export async function getRealtimeSuggestion(emotion: string): Promise<string> {
  const prompt = `User emotion detected: ${emotion}. Provide one short actionable suggestion to improve productivity. Keep it under 50 words and make it specific and helpful.`;
  return getGeminiSuggestion(prompt);
}

export async function getRecurringSuggestion(emotion: string, timeOfDay: string): Promise<string> {
  const prompt = `User has repeatedly shown ${emotion} during ${timeOfDay}. Provide a stronger intervention suggestion. Keep it under 75 words and make it actionable and supportive.`;
  return getGeminiSuggestion(prompt);
}

export async function getAnalyticsSummary(emotionData: any): Promise<string> {
  const prompt = `Based on the following weekly emotion distribution data, provide a 2-3 sentence summary: ${JSON.stringify(emotionData)}. Focus on patterns and insights.`;
  return getGeminiSuggestion(prompt);
}

export async function getWeeklySuggestions(emotionData: any): Promise<string> {
  const prompt = `Based on this weekly emotion distribution, suggest 2-3 ways the user can improve their workflow: ${JSON.stringify(emotionData)}. Make suggestions specific and actionable.`;
  return getGeminiSuggestion(prompt);
}

// Fallback function to generate mock insights when API key is not available
function generateMockInsights(emotionData: any, viewMode: 'daily' | 'weekly'): string {
  const timeFrame = viewMode === 'daily' ? 'today' : 'this week';
  
  // Calculate totals
  const totals = emotionData.reduce((acc: any, range: any) => {
    acc.focused += range.emotions.focused;
    acc.tired += range.emotions.tired;
    acc.stressed += range.emotions.stressed;
    return acc;
  }, { focused: 0, tired: 0, stressed: 0 });
  
  const totalHours = totals.focused + totals.tired + totals.stressed;
  const focusedPercentage = Math.round((totals.focused / totalHours) * 100);
  const stressedPercentage = Math.round((totals.stressed / totalHours) * 100);
  
  // Find most focused period
  const mostFocusedPeriod = emotionData.reduce((max: any, current: any) => {
    const currentFocus = (current.emotions.focused / current.hours) * 100;
    const maxFocus = (max.emotions.focused / max.hours) * 100;
    return currentFocus > maxFocus ? current : max;
  });
  
  // Generate mock insights
  const insights = [
    `• You're most focused during ${mostFocusedPeriod.name.toLowerCase()} hours with ${Math.round((mostFocusedPeriod.emotions.focused / mostFocusedPeriod.hours) * 100)}% productivity`,
    `• Overall focus rate is ${focusedPercentage}% ${timeFrame} - ${focusedPercentage > 50 ? 'excellent productivity levels' : 'room for improvement'}`,
    `• Stress levels are at ${stressedPercentage}% ${timeFrame} - ${stressedPercentage < 20 ? 'well-managed stress levels' : 'consider stress management techniques'}`,
    `• ${viewMode === 'daily' ? 'Daily' : 'Weekly'} pattern shows ${emotionData.length} distinct time periods with varying productivity levels`
  ];
  
  return insights.join('\n');
}

export async function generateProductivityInsights(emotionData: any, viewMode: 'daily' | 'weekly'): Promise<string> {
  // If no API key is available, use mock insights
  if (!GEMINI_API_KEY) {
    console.log('⚠️ No Gemini API key found, using mock insights');
    return generateMockInsights(emotionData, viewMode);
  }
  
  console.log('✅ Gemini API key found, attempting to call Gemini API...');
  
  const timeFrame = viewMode === 'daily' ? 'today' : 'this week';
  
  const prompt = `Analyze the following productivity data from ${timeFrame} and provide 3-4 key insights.

Data: ${JSON.stringify(emotionData)}

Requirements:
- Each insight should be a single sentence
- Focus on when the user is most focused, tired, or stressed
- Address productivity patterns and trends

Format your response as bullet points starting with •  and keep each insight concise and clear.`;
  
  try {
    console.log('📤 Sending request to Gemini API...');
    const result = await getGeminiSuggestion(prompt);
    console.log('✅ Gemini API response received:', result.substring(0, 100) + '...');
    return result;
  } catch (error) {
    console.error('❌ Gemini API failed, falling back to mock insights:', error);
    return generateMockInsights(emotionData, viewMode);
  }
}

// Fallback function to generate mock suggestions when API key is not available
function generateMockSuggestions(emotionData: any, viewMode: 'daily' | 'weekly'): string {
  const timeFrame = viewMode === 'daily' ? 'today' : 'this week';
  
  // Calculate totals and find patterns
  const totals = emotionData.reduce((acc: any, range: any) => {
    acc.focused += range.emotions.focused;
    acc.tired += range.emotions.tired;
    acc.stressed += range.emotions.stressed;
    return acc;
  }, { focused: 0, tired: 0, stressed: 0 });
  
  const totalHours = totals.focused + totals.tired + totals.stressed;
  const focusedPercentage = Math.round((totals.focused / totalHours) * 100);
  const stressedPercentage = Math.round((totals.stressed / totalHours) * 100);
  
  // Find most focused period
  const mostFocusedPeriod = emotionData.reduce((max: any, current: any) => {
    const currentFocus = (current.emotions.focused / current.hours) * 100;
    const maxFocus = (max.emotions.focused / max.hours) * 100;
    return currentFocus > maxFocus ? current : max;
  });
  
  // Find most stressed period
  const mostStressedPeriod = emotionData.reduce((max: any, current: any) => {
    const currentStress = (current.emotions.stressed / current.hours) * 100;
    const maxStress = (max.emotions.stressed / max.hours) * 100;
    return currentStress > maxStress ? current : max;
  });
  
  // Generate actionable suggestions based on data
  const suggestions = [];
  
  if (focusedPercentage > 60) {
    suggestions.push(`• **Schedule important tasks during ${mostFocusedPeriod.name.toLowerCase()}** - You're most productive then (${Math.round((mostFocusedPeriod.emotions.focused / mostFocusedPeriod.hours) * 100)}% focus rate)`);
  } else {
    suggestions.push(`• **Optimize your ${mostFocusedPeriod.name.toLowerCase()} routine** - This is your most productive time but could be improved further`);
  }
  
  if (stressedPercentage > 25) {
    suggestions.push(`• **Take breaks during ${mostStressedPeriod.name.toLowerCase()}** - Stress levels peak then, consider scheduling lighter tasks or breaks`);
  } else {
    suggestions.push(`• **Maintain your current stress management** - Your stress levels are well-controlled (${stressedPercentage}%)`);
  }
  
  if (mostFocusedPeriod.name === 'Morning') {
    suggestions.push(`• **Consider waking up earlier** - Your morning productivity is strong, earlier starts could extend your peak performance window`);
  } else if (mostFocusedPeriod.name === 'Evening') {
    suggestions.push(`• **Adjust your sleep schedule** - You work best in the evening, consider shifting your day to start later`);
  }
  
  return suggestions.join('\n');
}

export async function generateProductivitySuggestions(emotionData: any, viewMode: 'daily' | 'weekly'): Promise<string> {
  // If no API key is available, use mock suggestions
  if (!GEMINI_API_KEY) {
    console.log('⚠️ No Gemini API key found, using mock suggestions');
    return generateMockSuggestions(emotionData, viewMode);
  }
  
  console.log('✅ Gemini API key found, attempting to call Gemini API for suggestions...');
  
  const timeFrame = viewMode === 'daily' ? 'today' : 'this week';
  
  const prompt = `Analyze the following productivity data from ${timeFrame} and provide 2-3 concise, actionable suggestions to improve productivity.

Data: ${JSON.stringify(emotionData)}

Requirements:
- Focus on specific, actionable recommendations
- Address when the user is most/least productive
- Each suggestion should be a single sentence

Format as a list starting with 1) and keep each suggestion brief and actionable.`;
  
  try {
    console.log('📤 Sending suggestions request to Gemini API...');
    const result = await getGeminiSuggestion(prompt);
    console.log('✅ Gemini suggestions response received:', result.substring(0, 100) + '...');
    return result;
  } catch (error) {
    console.error('❌ Gemini API failed, falling back to mock suggestions:', error);
    return generateMockSuggestions(emotionData, viewMode);
  }
}
