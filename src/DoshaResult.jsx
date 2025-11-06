// src/DoshaResult.jsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import doshaConfig from "./config/doshaConfig.json";
import { submitDoshaQuiz } from "./api";

export default function DoshaResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.formData;

  // Compute scores even if data is undefined so hooks are declared unconditionally
  const scores = { vata: 0, pitta: 0, kapha: 0 };

  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      if (doshaConfig[key] && doshaConfig[key][value]) {
        const { vata, pitta, kapha } = doshaConfig[key][value];
        scores.vata += Number(vata) || 0;
        scores.pitta += Number(pitta) || 0;
        scores.kapha += Number(kapha) || 0;
      }
    });
  }

  const dominantDosha =
    Object.keys(scores).reduce((a, b) => (scores[a] > scores[b] ? a : b)) || "Unknown";
  const displayDosha = dominantDosha.charAt(0).toUpperCase() + dominantDosha.slice(1);

  // Submit to backend — effect declared unconditionally but will early-return if no data
  useEffect(() => {
    if (!data) return; // nothing to submit

    let mounted = true;

    const sendResult = async () => {
      try {
        // Backend quiz endpoint usually expects an answers payload.
        // We will include both answers and dominantDosha so backend can save both/kick off updates.
        const payload = {
          answers: data,
          dominantDosha: displayDosha,
        };

        const res = await submitDoshaQuiz(payload);
        // res shape may vary:
        // - earlier quizController created returned { result: dominantDosha, resultId }
        // - or your backend might return { dominantDosha, ... }
        // handle both.

        const serverDosha =
          res?.dominantDosha || res?.result || res?.result?.dominantDosha || null;

        const finalDosha = serverDosha || displayDosha;

        // Persist locally so other client pages can read user's dosha
        localStorage.setItem("doshaType", finalDosha);

        // Notify other parts of app (Navbar / Dashboard) that user changed
        window.dispatchEvent(new Event("userChanged"));

        // optional: if you want to redirect after save, you can; here we keep user on result page
        console.log("Quiz submit response:", res);
      } catch (err) {
        // still store locally so user has the dosha even if backend failed
        localStorage.setItem("doshaType", displayDosha);
        window.dispatchEvent(new Event("userChanged"));
        console.error("Error saving quiz:", err);
      }
    };

    if (mounted) sendResult();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // Early return if user opened the page without quiz data (hooks defined above so no rule-of-hooks problems)
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <p className="text-gray-200">⚠ No quiz data found.</p>
        <button
          onClick={() => navigate("/DoshaQuiz")}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Take Quiz
        </button>
      </div>
    );
  }

  const recommendations = {
    vata: [
      "Eat warm, cooked foods and avoid cold or raw meals.",
      "Maintain a consistent daily routine.",
      "Engage in grounding yoga, oil massage, and meditation.",
    ],
    pitta: [
      "Avoid excessive heat, stress, and spicy foods.",
      "Incorporate cooling foods like cucumber, mint, and milk.",
      "Practice calming activities like swimming or walking in nature.",
    ],
    kapha: [
      "Stay active and avoid oversleeping.",
      "Eat light, dry, and warm foods; minimize dairy and fried items.",
      "Engage in energizing exercises like jogging or dance.",
    ],
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center p-6">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/sunlight.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/40"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-2xl bg-white/20 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-white/30"
      >
        <h1 className="text-3xl font-bold text-green-100 text-center mb-4">
          Your Dosha Result
        </h1>

        <div className="text-center mb-6">
          <p className="text-xl font-semibold text-green-200">
            Predominant Dosha:{" "}
            <span className="text-green-50 font-bold">{displayDosha}</span>
          </p>
        </div>

        <div className="bg-green-900/30 border border-green-400/30 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-green-100 mb-2">Recommendations</h2>
          <ul className="list-disc pl-6 text-green-50 space-y-1">
            {recommendations[dominantDosha]?.map((rec, i) => (
              <li key={i}>{rec}</li>
            )) || <li>No recommendations available.</li>}
          </ul>
        </div>

        <div className="bg-black/30 text-green-200 text-sm rounded-lg p-4 mb-6">
          <p className="font-semibold mb-1">Score Breakdown:</p>
          <p>Vata: {scores.vata.toFixed(3)}</p>
          <p>Pitta: {scores.pitta.toFixed(3)}</p>
          <p>Kapha: {scores.kapha.toFixed(3)}</p>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/DoshaQuiz")}
            className="bg-green-600/80 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Retake Quiz
          </button>

          <button
            onClick={() => navigate("/SymptomRecommender")}
            className="bg-green-600/80 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Recipe-Recommender
          </button>
        </div>
      </motion.div>
    </div>
  );
}
