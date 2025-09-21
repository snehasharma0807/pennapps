// Using built-in fetch for Next.js API routes

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

function getGeminiApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ Gemini API key not set. Please set GEMINI_API_KEY in .env.local");
    return "";
  }
  return apiKey;
}

export async function getGeminiSuggestion(prompt: string): Promise<string> {
  try {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      throw new Error("❌ Gemini API key not set. Please set GEMINI_API_KEY in .env.local");
    }
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
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
