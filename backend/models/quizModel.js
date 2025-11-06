// backend/models/quizModel.js
import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answers: { type: Object, required: true }, // store full formData object
    dominantDosha: { type: String, required: true } // "vata"/"pitta"/"kapha" or capitalized if you prefer
  },
  { timestamps: true }
);

export default mongoose.model("QuizResult", quizResultSchema);
