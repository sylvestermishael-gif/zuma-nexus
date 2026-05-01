import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

let aiInstance: GoogleGenAI | null = null;
function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GENAI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GENAI_API_KEY is not defined");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

app.post("/api/gemini/enhance", async (req, res) => {
  try {
    const { dishName, baseDescription } = req.body;
    const ai = getAI() as any;
    const prompt = `You are a world-class food critic and menu writer for "Zuma Hearth", a futuristic fine-dining restaurant where "fire meets the future". 
    Enhance the description of this dish to sound more evocative, mysterious, and mouth-watering. Use technical, culinary, and atmospheric language.
    Dish: ${dishName}
    Base: ${baseDescription}
    Keep it to 2-3 sentences.`;

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/gemini/recommend", async (req, res) => {
  try {
    const { mood, dishes } = req.body;
    const ai = getAI() as any;
    const dishList = dishes.map((d: any) => `${d.name}: ${d.description}`).join('\n');
    const prompt = `The customer is feeling "${mood}". Based on the following menu from Zuma Hearth, recommend 3 dishes that match this mood. 
    Explain briefly why for each. Be poetic and high-end.
    Menu:
    ${dishList}`;

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default app;
