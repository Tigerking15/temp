import express from "express";
import { submitQuiz, myQuizResults } from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/submit", protect, submitQuiz);
router.get("/my", protect, myQuizResults);

export default router;
