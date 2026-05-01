import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini API Proxy
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
      const prompt = `You are a world-class food critic and menu writer for "Zuma Hearth", a futuristic fine-dining restaurant. 
      Enhance the description of this dish to sound more evocative, mysterious, and mouth-watering.
      Dish: ${dishName}
      Base: ${baseDescription}
      Keep it to 2 sentences.`;

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

  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { userMessage } = req.body;
      const ai = getAI() as any;
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are the concierge AI for Zuma Hearth, a futuristic fine-dining restaurant.
      User says: "${userMessage}"
      Respond in character as Zuma's concierge.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      res.json({ text: response.text() });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
