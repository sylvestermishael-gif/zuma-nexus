import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { Resend } from "resend";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
let adminApp: admin.app.App;
let db: any;
let authAdmin: any;
let databaseId: string | undefined = undefined;

try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  let projectId = process.env.FIREBASE_PROJECT_ID;
  
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    projectId = config.projectId;
    databaseId = config.firestoreDatabaseId;
  }

  adminApp = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: projectId
  });

  // Try custom database
  db = getFirestore(adminApp, databaseId);
  authAdmin = getAuth(adminApp);
} catch (error: any) {
  console.error("System initialization failed:", error);
  // Total fallback
  adminApp = admin.apps.length ? admin.app() : admin.initializeApp();
  db = getFirestore(adminApp);
  authAdmin = getAuth(adminApp);
}

const resend = new Resend(process.env.RESEND_API_KEY);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Verify Connectivity & Fallback if necessary
  try {
    await db.collection("system_check").doc("status").set({ 
      online: true, 
      timestamp: FieldValue.serverTimestamp() 
    }, { merge: true });
    console.log("System Link: Stable connection verified.");
  } catch (err: any) {
    const isNotFoundError = err.message.includes("NOT_FOUND") || err.code === 5;
    const isPermissionDenied = err.message.includes("PERMISSION_DENIED") || err.code === 7;

    if ((isNotFoundError || isPermissionDenied) && databaseId) {
      console.warn(`System Alert: Database [${databaseId}] is ${isNotFoundError ? 'missing' : 'restricted'}. Rerouting to (default) database.`);
      db = getFirestore(adminApp);
      try {
        await db.collection("system_check").doc("status").set({ 
          online: true, 
          timestamp: FieldValue.serverTimestamp(),
          rerouted: true,
          previousError: err.message
        }, { merge: true });
        console.log("System Link: Rerouted connection stable.");
      } catch (innerErr: any) {
        console.error("System Link: Total database failure. Check Firebase Project setup.", innerErr.message);
      }
    } else {
      console.error("System Link: Connectivity check error:", err.message);
    }
  }

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
