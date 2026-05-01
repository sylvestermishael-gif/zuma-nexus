export async function getEnhancedDescription(dishName: string, baseDescription: string) {
  try {
    const response = await fetch("/api/gemini/enhance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dishName, baseDescription }),
    });
    const data = await response.json();
    return data.text || baseDescription;
  } catch (error) {
    console.error("Gemini Error:", error);
    return baseDescription;
  }
}

export async function getMoodRecommendations(mood: string, dishes: any[]) {
  try {
    const response = await fetch("/api/gemini/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood, dishes }),
    });
    const data = await response.json();
    return data.text || "I recommend our signature Obsidian Wagyu for any mood.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I recommend our signature Obsidian Wagyu for any mood.";
  }
}

export async function getChatResponse(userMessage: string) {
  try {
    const response = await fetch("/api/gemini/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage }),
    });
    const data = await response.json();
    return data.text || "Signal interrupted.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Signal interrupted.";
  }
}

export async function translateText(text: string, targetLanguage: string) {
  // Legacy or unused, but kept for compatibility
  return text;
}
