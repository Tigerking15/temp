// backend/controllers/quizController.js
import QuizResult from "../models/quizModel.js";
import User from "../models/userModel.js";
import fs from "fs";
import path from "path";

// ✅ Safe JSON config loader
let doshaConfig = {};
try {
  const configPath = path.resolve("./config/doshaConfig.json");
  if (fs.existsSync(configPath)) {
    doshaConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  } else {
    console.warn("⚠ doshaConfig.json not found at:", configPath);
  }
} catch (err) {
  console.error("❌ Error loading doshaConfig.json:", err.message);
}

/**
 * Compute total dosha scores based on answers using doshaConfig weights
 * @param {Object} answersObj - e.g. { "Body Size": "Medium", "Height": "Average" }
 */
const computeScores = (answersObj = {}) => {
  const totals = { vata: 0, pitta: 0, kapha: 0 };

  Object.entries(answersObj).forEach(([questionKey, selectedValue]) => {
    try {
      if (!questionKey || !selectedValue) return;
      const mapping = doshaConfig[questionKey];
      if (!mapping) return;

      const weights = mapping[selectedValue];
      if (!weights) return;

      totals.vata += Number(weights.vata || 0);
      totals.pitta += Number(weights.pitta || 0);
      totals.kapha += Number(weights.kapha || 0);
    } catch (err) {
      console.error("Weight mapping error for:", questionKey, err.message);
    }
  });

  return totals;
};

/**
 * Derive the dominant dosha label
 * - returns one of "vata", "pitta", "kapha" or a combo like "vata+pitta"
 */
const deriveDoshaLabel = (totals, thresholdDelta = 0.02) => {
  const keys = ["vata", "pitta", "kapha"];
  const sorted = keys.sort((a, b) => totals[b] - totals[a]);
  const [top, second] = sorted;
  const diff = totals[top] - totals[second];


};

/**
 * POST /api/quiz/submit
 * Saves quiz results and updates user’s doshaType if logged in.
 */
export const submitQuiz = async (req, res) => {
  try {
    const { answers, dominantDosha: providedDosha } = req.body;

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({
        success: false,
        message: "Request body must include 'answers' (object).",
      });
    }

    // Compute dosha scores and label (use computed if not explicitly provided)
    const totals = computeScores(answers);
    const derived = deriveDoshaLabel(totals);
    const dominantDosha = providedDosha || derived;

    // Save quiz result (even for guests)
    const quizDoc = await QuizResult.create({
      userId: req.user?._id || null,
      answers,
      dominantDosha,
    });

    // If authenticated, update user's profile with doshaType
    if (req.user?._id) {
      await User.findByIdAndUpdate(req.user._id, { doshaType: dominantDosha }, { new: true });
    }

    return res.status(201).json({
      success: true,
      message: "Quiz result saved successfully.",
      dominantDosha,
      scores: totals,
      resultId: quizDoc._id,
    });
  } catch (error) {
    console.error("❌ Error in submitQuiz:", error);
    return res.status(500).json({
      success: false,
      message: "Server error submitting quiz.",
      error: error.message,
    });
  }
};

/**
 * GET /api/quiz/my
 * Returns logged-in user's quiz history
 */
export const myQuizResults = async (req, res) => {
  try {
    const list = await QuizResult.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, list });
  } catch (error) {
    console.error("❌ Error in myQuizResults:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching quiz history.",
      error: error.message,
    });
  }
};
