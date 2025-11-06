// src/SymptomRecommender.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import {
  HeartPulse,
  Star,
  Share2,
  Mic,
  MicOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import recipesData from "./data/recipeupdated.json"; // ensure this path is correct

export default function SymptomRecommender() {
  // state
  const [symptoms, setSymptoms] = useState("");
  const [dosha, setDosha] = useState("Vata");
  const [favorites, setFavorites] = useState([]);
  const [listening, setListening] = useState(false);

  // response sets (each set has one recipe per matched keyword)
  const [responseSets, setResponseSets] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const PAGE_SIZE = 2;


  // AI / network states
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState(null);

  // proxy endpoint (adjust if your server uses a different path)
  const GROQ_PROXY_URL = "/api/groq";
  // backend recipe API (must exist on backend)
  const RECIPE_API = "/api/backedrecipies";

  // load saved dosha + favorites
  useEffect(() => {
    const savedDosha =
      localStorage.getItem("doshaType") ||
      localStorage.getItem("userDosha") ||
      "Vata";
    setDosha(savedDosha);

    const savedFavs = JSON.parse(localStorage.getItem("favRecipes") || "[]");
    setFavorites(savedFavs);
  }, []);

  useEffect(() => {
    localStorage.setItem("favRecipes", JSON.stringify(favorites));
  }, [favorites]);

  // Voice input
  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported. Use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;

    if (!listening) {
      recognition.start();
      setListening(true);
      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setSymptoms((prev) => (prev ? prev + " " + transcript : transcript));
      };
      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);
    } else {
      recognition.stop();
      setListening(false);
    }
  };

  // ------------------------
  // Helper: call Groq via your server proxy
  // ------------------------
  async function callGroqProxy(symptomText, doshaLabel) {
    const cacheKey = `groq_cache__${symptomText}__${doshaLabel}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);

      const res = await fetch(GROQ_PROXY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptom: symptomText, dosha: doshaLabel }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Proxy error ${res.status}: ${txt}`);
      }

      const data = await res.json();
      // expected shape: { recipes: [...] }
      localStorage.setItem(cacheKey, JSON.stringify(data));
      return data;
    } catch (err) {
      console.error("callGroqProxy error:", err);
      throw err;
    }
  }

  // ------------------------
  // Helper: save AI recipes to backend
  // ------------------------
// Frontend: updated saveRecipesToBackend (only changed payload creation)
async function saveRecipesToBackend(recipes, symptomText) {
  if (!recipes || recipes.length === 0) return;

  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  const headers = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };

  // Map each AI recipe to the DB schema
  const payloads = recipes.map((r, idx) => {
    const generatedId = `ai_${Date.now()}_${idx}`;
    // symptomText is the original user input or one specific symptom; pass what you have
    const symptomKeywords = [ (r.symptom || symptomText || "ai-generated").toLowerCase() ];

    // Put AI result into the recipes.{dosha} object shape your model expects
    const doshaObj = {
      recipe_name: r.title || r.recipe_name || `AI Recipe ${idx + 1}`,
      ingredients: r.ingredients || [],
      preparation: r.steps || r.preparation || "",
      description: r.desc || r.description || "",
      contraindications: r.contraindications || [],
      frequency_duration: r.frequency || ""
    };

    return {
      id: generatedId,
      symptom_keywords: symptomKeywords,
      title: doshaObj.recipe_name,
      recipes: {
        // use the user's selected dosha variable from your component scope
        [dosha]: doshaObj
      },
      tags: [dosha, "auto-generated"],
      source: "ai",
      last_updated: new Date()
    };
  });

  // Try bulk endpoint first (if backend supports it)
  try {
    const bulkRes = await fetch("/api/backedrecipes/bulk", {
      method: "POST",
      headers,
      body: JSON.stringify(payloads),
    });
    if (bulkRes.ok) {
      console.info("Saved AI recipes via bulk endpoint");
      return;
    } else {
      console.warn("Bulk save returned", bulkRes.status);
    }
  } catch (err) {
    console.warn("Bulk save failed:", err);
  }

  // Fallback: create each recipe individually
  for (const payload of payloads) {
    try {
      const res = await fetch("/api/backedrecipes", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.warn("Failed to save recipe:", payload.id, res.status, txt);
      } else {
        console.info("Saved recipe:", payload.id);
      }
    } catch (err) {
      console.error("Error saving recipe:", payload.id, err);
    }
  }
}


  // ---------- FIXED LOGIC: Build response sets when button clicked ----------
  // This section guarantees exactly ONE recipe per symptom in each response set.
// FIXED: handleRecommend
// FINAL FIXED handleRecommend
const handleRecommend = async () => {
  const userTextRaw = (symptoms || "").trim();
  const userText = userTextRaw.toLowerCase();
  if (!userText) {
    alert("Please type your symptoms (e.g., 'I have cough and back pain').");
    return;
  }

  // --- Step A: find all entries where ANY symptom keyword matches ---
  const matchedEntries = recipesData.filter((entry) =>
    (entry.symptom_keywords || []).some((kw) =>
      userText.includes(kw.toLowerCase())
    )
  );

  // If no local match, call AI (unchanged)
  if (matchedEntries.length === 0) {
    setAiError(null);
    setLoadingAI(true);
    try {
      const aiResp = await callGroqProxy(userTextRaw, dosha);
      const normalized = (aiResp?.recipes || []).map((v, idx) => ({
        id: `groq_${idx}`,
        title: v.title || `Groq Recipe ${idx + 1}`,
        desc: v.description || "",
        ingredients: v.ingredients || [],
        steps: v.preparation || v.steps || "",
        contraindications: v.contraindications || [],
        frequency: v.frequency || "",
      }));

      if (normalized.length === 0) {
        alert("No AI matches. Try different wording.");
        setResponseSets([]);
      } else {
        try { await saveRecipesToBackend(normalized); } catch (e) { console.warn(e); }
        const items = normalized.map((r) => ({ symptom: userTextRaw, recipe: r }));
        setResponseSets([{ id: 1, items }]);
        setPageIndex(0);
      }
    } catch (err) {
      console.error(err);
      setAiError("AI service unavailable.");
      alert("AI service unavailable. Try again later.");
      setResponseSets([]);
    } finally {
      setLoadingAI(false);
    }
    return;
  }

  // --- Step B: build a map of symptom -> array of recipe variants ---
  const symptomMap = new Map();

  matchedEntries.forEach((entry) => {
    const matchingKws = (entry.symptom_keywords || []).filter((kw) =>
      userText.includes(kw.toLowerCase())
    );

    // choose recipe object for dosha
    const recObj =
      entry.recipes?.[dosha] ||
      entry.recipes?.Vata ||
      entry.recipes?.Pitta ||
      entry.recipes?.Kapha;

    if (!recObj) return;

    const recipe = {
      id: entry.id,
      title: recObj.recipe_name || entry.title || entry.id,
      desc: recObj.description || "",
      ingredients: recObj.ingredients || [],
      steps: recObj.preparation || "",
      contraindications: recObj.contraindications || [],
      frequency: recObj.frequency_duration || "",
    };

    // If entry has multiple matching symptoms, link this recipe to each
    matchingKws.forEach((kw) => {
      const lower = kw.toLowerCase();
      if (!symptomMap.has(lower)) symptomMap.set(lower, []);
      symptomMap.get(lower).push(recipe);
    });
  });

  // --- Step C: build response sets (each set = 1 recipe per symptom) ---
  const symptomsList = Array.from(symptomMap.keys());
  const maxVariants = Math.max(
    ...Array.from(symptomMap.values()).map((arr) => arr.length || 1)
  );

  const built = [];
  let idCounter = 1;
  for (let i = 0; i < maxVariants; i++) {
    const items = [];
    for (const s of symptomsList) {
      const arr = symptomMap.get(s);
      if (!arr || arr.length === 0) continue;
      const recipe = arr[i % arr.length]; // rotate variants if available
      items.push({ symptom: s, recipe });
    }
    if (items.length > 0) built.push({ id: idCounter++, items });
  }

  // --- Step D: save and show ---
  setResponseSets(built);
  setPageIndex(0);
};



  // Pagination into pages of PAGE_SIZE sets
  const pages = [];
  for (let i = 0; i < responseSets.length; i += PAGE_SIZE) {
    pages.push(responseSets.slice(i, i + PAGE_SIZE));
  }

  // Prev / Next behaviour (non-wrapping by default)
  const handleNextPage = () => {
    if (pages.length === 0) return;
    setPageIndex((p) => Math.min(p + 1, pages.length - 1));
  };

  const handlePrevPage = () => {
    if (pages.length === 0) return;
    setPageIndex((p) => Math.max(p - 1, 0));
  };

  // Favorites + share
  const toggleFavorite = (symptom, recipe) => {
    const key = `${recipe.title}__${symptom}`;
    if (favorites.some((f) => f.key === key)) {
      setFavorites((prev) => prev.filter((f) => f.key !== key));
    } else {
      setFavorites((prev) => [...prev, { key, symptom, ...recipe }]);
    }
  };

  const isFavorited = (symptom, recipe) => {
    const key = `${recipe.title}__${symptom}`;
    return favorites.some((f) => f.key === key);
  };

  const shareRecipe = (symptom, recipe) => {
    const text = `Ayurvedic (${dosha}) recipe for ${symptom}:\n\n${recipe.title}\n\n${recipe.desc}\n\nIngredients: ${recipe.ingredients.join(
      ", "
    )}\n\nPreparation: ${recipe.steps}\n\nFrequency: ${recipe.frequency}\n\nBenefit: ${recipe.desc}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  // render helper
  const renderSymptomRecipe = (symptom, recipe, idx) => (
    <div key={`${symptom}-${idx}`} className="mb-4 text-green-50">
      <h4 className="font-semibold text-lg">
        For your <span className="capitalize">{symptom}</span>:
      </h4>

      <div className="mt-2 mb-2">
        <div className="font-semibold text-green-100">{recipe.title}</div>
        {recipe.desc && <div className="text-sm text-green-200 mb-1">{recipe.desc}</div>}

        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {recipe.ingredients.slice(0, 8).map((ing, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-green-800/50 text-green-100 rounded-full text-sm shadow-sm"
              >
                {ing}
              </span>
            ))}
          </div>
        )}

        <p className="text-sm">
          <strong>How:</strong> {recipe.steps}
        </p>

        {recipe.contraindications?.length > 0 && (
          <div className="mt-2 text-sm text-red-200">
            <strong>⚠ Contraindications:</strong> {recipe.contraindications.join("; ")}
          </div>
        )}

        {recipe.frequency && <p className="mt-2 text-green-200 text-sm">🕒 {recipe.frequency}</p>}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => toggleFavorite(symptom, recipe)}>
          <Star
            className={`w-5 h-5 ${
              isFavorited(symptom, recipe) ? "text-yellow-400 fill-yellow-400" : "text-green-200"
            }`}
          />
        </button>

        <button onClick={() => shareRecipe(symptom, recipe)}>
          <Share2 className="w-5 h-5 text-green-200" />
        </button>
      </div>
    </div>
  );

  // UI (unchanged layout, only logic touched above)
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 pt-28 overflow-auto">
      <Navbar />

      {/* background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/recipe.mp4" type="video/mp4" />
      </video>

      {/* overlay */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* header */}
      <motion.div
        className="relative z-10 text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-extrabold text-white flex items-center justify-center gap-2 drop-shadow-lg">
          <HeartPulse className="w-8 h-8 text-green-300" />
          Symptom → Recipe Recommender
        </h1>
        <p className="text-green-100 mt-2 max-w-xl mx-auto">
          Based on your{" "}
          <span className="px-2 py-1 bg-green-600/70 rounded-lg font-semibold text-white">
            {dosha}
          </span>{" "}
          dosha, we’ll suggest Ayurvedic recipes to heal you.
        </p>
      </motion.div>

      {/* input */}
      <motion.div
        className="relative z-10 w-full max-w-2xl bg-white/20 backdrop-blur-xl shadow-2xl rounded-2xl p-6 border border-white/30 mb-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <p className="text-green-100 font-semibold mb-3 flex items-center gap-2">
          Tell Us your Symptoms:
          <button
            onClick={handleVoiceInput}
            className="ml-2 p-2 rounded-full border border-white/40 bg-white/10 hover:bg-white/20 transition"
          >
            {listening ? (
              <MicOff className="w-5 h-5 text-red-400" />
            ) : (
              <Mic className="w-5 h-5 text-green-200" />
            )}
          </button>
        </p>

        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="e.g., I have cough and back pain"
          rows="3"
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-400 bg-white/70"
        />

        <div className="flex gap-3 mt-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={handleRecommend}
            disabled={loadingAI}
            className={`flex-1 bg-gradient-to-r from-primary to-primary/90 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition ${loadingAI ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loadingAI ? "Fetching AI suggestions..." : "Get My Healing Recipes"}
          </motion.button>

          <button
            onClick={() => {
              setSymptoms("");
              setResponseSets([]);
            }}
            className="px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white"
          >
            Clear
          </button>
        </div>

        {aiError && <div className="mt-2 text-sm text-red-300">{aiError}</div>}
      </motion.div>

      {/* results */}
      <div className="relative z-10 w-full max-w-6xl px-4 space-y-6">
        <AnimatePresence>
          {responseSets.length > 0 && pages.length > 0 && pages[pageIndex] && (
            <motion.div
              key={"page-" + pageIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {pages[pageIndex].map((set, colIdx) => (
                <motion.div
                  layout
                  key={`set-${set.id}-${colIdx}`}
                  className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl p-6 shadow-xl hover:shadow-2xl transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-green-100">{colIdx === 0 ? "Response 1" : "Response 2"}</h2>
                    <div />
                  </div>

                  <div className="space-y-5 max-h-[28rem] overflow-y-auto pr-2">
                    {set.items.map((it, idx) => (
                      <div key={idx}>
                        {renderSymptomRecipe(it.symptom, it.recipe, idx)}
                        {idx !== set.items.length - 1 && <hr className="border-t border-white/10 my-2" />}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {responseSets.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-green-100 text-center"
            >
              Type symptoms and press <strong>Get My Healing Recipes</strong> to see suggestions.
            </motion.div>
          )}
        </AnimatePresence>

        {/* controls */}
        {responseSets.length > 0 && pages.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-2">
            <button
              onClick={handlePrevPage}
              className={`p-2 rounded-md border border-white/20 bg-white/5 transition ${pageIndex === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-white/10"}`}
              aria-label="Previous responses"
              disabled={pageIndex === 0}
            >
              <ChevronLeft className="w-5 h-5 text-green-100" />
            </button>

            <button
              onClick={handleNextPage}
              className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-green-100 hover:bg-white/20 transition"
            >
              Didn't like these? View more!!!!!!!
            </button>

            <button
              onClick={handleNextPage}
              className="p-2 rounded-md border border-white/20 bg-white/5 hover:bg-white/10 transition"
              aria-label="Next responses"
            >
              <ChevronRight className="w-5 h-5 text-green-100" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
