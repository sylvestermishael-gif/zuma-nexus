import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function getEnhancedDescription(dishName: string, baseDescription: string) {
  try {
    const ai = getAI();
    const prompt = `You are a world-class food critic and menu writer for "Zuma Hearth", a futuristic fine-dining restaurant where "fire meets the future". 
    Enhanced the description of this dish to sound more evocative, mysterious, and mouth-watering. Use technical, culinary, and atmospheric language.
    Dish: ${dishName}
    Base: ${baseDescription}
    Keep it to 2-3 sentences. Do not include the name of the dish in the enhancement if possible.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    return response.text || baseDescription;
  } catch (error) {
    console.error("Gemini Error:", error);
    return baseDescription;
  }
}

export async function getMoodRecommendations(mood: string, dishes: any[]) {
  try {
    const ai = getAI();
    const dishList = dishes.map(d => `${d.name}: ${d.description}`).join('\n');
    const prompt = `The customer is feeling "${mood}". Based on the following menu from Zuma Hearth, recommend 3 dishes that match this mood. 
    Explain briefly why for each. Be poetic and high-end.
    Menu:
    ${dishList}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "I recommend our signature Obsidian Wagyu for any mood.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I recommend our signature Obsidian Wagyu for any mood.";
  }
}

export async function translateText(text: string, targetLanguage: string) {
  try {
    const ai = getAI();
    const prompt = `Translate the following menu text into ${targetLanguage}. Keep the tone sophisticated and professional. Only return the translated text.
    Text: ${text}`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    return response.text || text;
  } catch (error) {
    return text;
  }
}
