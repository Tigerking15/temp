// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import symptomRoutes from "./routes/symptomRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import clinicRoutes from "./routes/clinicRoutes.js";
import plantRoutes from "./routes/plantRoutes.js";
import consultationRoutes from "./routes/consultationRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import adminUserRoutes from "./routes/adminRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import backedRecipieRoutes from "./routes/backedRecipieRoutes.js";



dotenv.config();
connectDB();

console.log("GROQ_API_KEY present:", !!process.env.GROQ_API_KEY);
console.log("GROQ_MODEL:", process.env.GROQ_MODEL);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ---- Basic middleware ----
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "1mb" }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Simple health / root
app.get("/", (req, res) => {
  res.send("Swasthya Backend is running ✅");
});

app.get("/news", async (req, res) => {
  try {
    const response = await fetch(
      "https://gnews.io/api/v4/search?q=ayurveda&lang=en&country=in&max=15&apikey=37ece5f987e3f1837665bd48c1d7fa80"
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching GNews:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Backend + MongoDB working fine" });
});

// ---- Existing API routes ----
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/symptoms", symptomRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/clinics", clinicRoutes);
app.use("/api/plants", plantRoutes);
app.use("/api/consultation", consultationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/admin", adminUserRoutes);
app.use("/api/backedrecipes",backedRecipieRoutes);


// ---- GROQ proxy endpoint ----
// POST /api/groq
// body: { symptom: string, dosha?: string }
// returns: { recipes: [ { title, description, ingredients, preparation, contraindications, frequency }, ... ] }
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = process.env.GROQ_API_URL || "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b"; // change if your account uses a different name

if (!GROQ_API_KEY) {
  console.warn("⚠️  GROQ_API_KEY is not set. Set it in your .env before using /api/groq");
}

// Tiny in-memory cache to reduce repeated upstream calls (key -> { data, ts })
const groqCache = new Map();
const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

function getCachedGroq(key) {
  const entry = groqCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    groqCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCachedGroq(key, data) {
  groqCache.set(key, { data, ts: Date.now() });
}

// Ensure global fetch exists (Node 18+). If not, provide a helpful error.
// (If your environment is older Node and you want node-fetch, install and import it.)
if (typeof fetch === "undefined") {
  console.warn(
    "⚠️ global fetch is undefined. Make sure you run on Node 18+ or install a fetch polyfill (node-fetch)."
  );
}

app.post("/api/groq", async (req, res) => {
  try {
    const { symptom, dosha } = req.body || {};
    if (!symptom || typeof symptom !== "string" || symptom.trim().length === 0) {
      return res.status(400).json({ error: "Missing or invalid 'symptom' in request body" });
    }

    const key = `${symptom.trim().toLowerCase()}::${(dosha || "unknown").toLowerCase()}`;
    const cached = getCachedGroq(key);
    if (cached) {
      return res.json(cached);
    }

    // System prompt instructing Groq to only output JSON with strict schema
    const systemPrompt = `
You are an experienced Ayurvedic practitioner. The user will provide a symptom description and a dosha.
Produce 1-3 safe home-remedy Ayurvedic prescriptions tailored to the symptom and dosha.
**OUTPUT MUST BE VALID JSON ONLY** with the exact shape:

{
  "recipes": [
    {
      "title": string,
      "description": string,
      "ingredients": [string],
      "preparation": string,
      "contraindications": [string],
      "frequency": string
    }
  ]
}

Do NOT output any explanatory text, markup, or commentary outside the JSON. If you cannot recommend safe home remedies, return {"recipes": []}. Keep remedies conservative, avoid prescription drugs and exact dosing; focus on general food/herb-based measures and precautions (e.g., avoid for pregnancy, children).
`.trim();

    const userPrompt = `Symptom: "${symptom.trim()}"\nDosha: "${dosha || "unspecified"}"`;

    // Build payload — adjust to your Groq provider docs if needed
    const payload = {
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.2
    };

    // Call Groq
    const resp = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("GROQ upstream error:", resp.status, text);
      return res.status(502).json({ error: "Upstream Groq error", status: resp.status, details: text });
    }

    const text = await resp.text();

    // Parse response: try JSON parse first; otherwise extract the first JSON-looking substring
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      // try to extract JSON-looking substring
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch (err2) {
          parsed = { recipes: [] };
        }
      } else {
        parsed = { recipes: [] };
      }
    }

    // If the provider wraps content differently (e.g. { choices: [ { message: { content: '...'} } ] })
    // attempt to unwrap common shapes:
    if (!parsed || typeof parsed !== "object") parsed = { recipes: [] };

    // Helper to try common unwrap patterns
    if (!Array.isArray(parsed.recipes)) {
      // openai-like: { choices: [ { message: { content: 'JSON...' } } ] }
      if (Array.isArray(parsed.choices) && parsed.choices.length > 0) {
        const content = parsed.choices[0]?.message?.content || parsed.choices[0]?.text || "";
        try {
          const maybe = JSON.parse(content);
          if (maybe && Array.isArray(maybe.recipes)) parsed = maybe;
        } catch (e) {
          const m = (content || "").match(/\{[\s\S]*\}/);
          if (m) {
            try {
              const maybe2 = JSON.parse(m[0]);
              if (maybe2 && Array.isArray(maybe2.recipes)) parsed = maybe2;
            } catch (e2) {
              // fallthrough
            }
          }
        }
      }
    }

    const rawRecipes = Array.isArray(parsed.recipes) ? parsed.recipes : [];

    const safeRecipes = rawRecipes.slice(0, 3).map((r) => {
      // Normalize fields defensively
      const title = r.title || r.recipe_name || "";
      const description = r.description || r.desc || "";
      const ingredients = Array.isArray(r.ingredients)
        ? r.ingredients.map(String)
        : r.ingredients
        ? [String(r.ingredients)]
        : [];
      const preparation = r.preparation || r.preparation_steps || r.steps || r.instructions || "";
      const contraindications = Array.isArray(r.contraindications)
        ? r.contraindications.map(String)
        : r.contraindications
        ? [String(r.contraindications)]
        : [];
      const frequency = r.frequency || r.frequency_duration || "";

      return { title, description, ingredients, preparation, contraindications, frequency };
    });

    const result = { recipes: safeRecipes };
    setCachedGroq(key, result);

    return res.json(result);
  } catch (err) {
    console.error("Error in /api/groq:", err);
    return res.status(500).json({ error: "server_error", details: String(err) });
  }
});

// ---- Errors (keep these last) ----
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT} (port ${PORT})`);
});

