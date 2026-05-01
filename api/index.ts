import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

let aiInstance: GoogleGenAI | null = null;
function getAI() {
  try {
    if (!aiInstance) {
      const apiKey = process.env.GENAI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) return null;
      aiInstance = new GoogleGenAI({ apiKey });
    }
    return aiInstance;
  } catch (e) {
    return null;
  }
}

app.post("/api/gemini/enhance", async (req, res) => {
  try {
    const { dishName, baseDescription } = req.body;
    const ai = getAI() as any;
    
    if (!ai) {
      return res.json({ text: baseDescription || "A masterfully crafted signature selection." });
    }

    const prompt = `You are a world-class food critic. Enhance this dish description.
    Dish: ${dishName}
    Base: ${baseDescription}
    Keep it to 2 sentences.`;

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error: any) {
    res.json({ text: req.body.baseDescription || "A masterfully crafted signature selection." });
  }
});

app.post("/api/gemini/recommend", async (req, res) => {
  try {
    const { mood, dishes } = req.body;
    const ai = getAI() as any;

    if (!ai) {
      return res.json({ text: "I recommend our signature Obsidian Wagyu for your current state." });
    }

    const dishList = dishes.map((d: any) => `${d.name}: ${d.description}`).join('\n');
    const prompt = `The customer is feeling "${mood}". Recommend 3 dishes.
    Menu:
    ${dishList}`;

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error: any) {
    res.json({ text: "I recommend our signature Obsidian Wagyu for your current state." });
  }
});

app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { userMessage } = req.body;
    const ai = getAI() as any;

    if (!ai) {
      return res.json({ text: "Greetings. Our AI systems are currently in maintenance, but our concierge team is available at the restaurant in Abuja." });
    }

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are the concierge AI for Zuma Hearth. Stay in character.
    User says: "${userMessage}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error: any) {
    res.json({ text: "The signal is weak here in Abuja. How may I assist you with your reservation?" });
  }
});

export default app;
