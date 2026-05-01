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
    const prompt = `You are a world-class food critic and menu writer for "Zuma Hearth", a futuristic fine-dining restaurant. 
    Enhance the description of this dish to sound more evocative and mysterious.
    Dish: ${dishName}
    Base: ${baseDescription}
    Keep it to 2 sentences.`;

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(200).json({ text: req.body.baseDescription || "A masterfully crafted signature selection." });
  }
});

app.post("/api/gemini/recommend", async (req, res) => {
  try {
    const { mood, dishes } = req.body;
    const ai = getAI() as any;
    const dishList = dishes.map((d: any) => `${d.name}: ${d.description}`).join('\n');
    const prompt = `The customer is feeling "${mood}". Recommend 3 dishes from this menu.
    Menu:
    ${dishList}`;

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(200).json({ text: "I recommend our signature Obsidian Wagyu for your current state." });
  }
});

app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { userMessage } = req.body;
    const ai = getAI() as any;
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are the concierge AI for Zuma Hearth. Stay in character.
    User says: "${userMessage}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(200).json({ text: "The signal is weak here in Abuja. How may I assist you with your reservation?" });
  }
});

export default app;
