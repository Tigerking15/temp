import express from "express";
import { createFeedback, getAllFeedback, deleteFeedback, getAverageRating } from "../controllers/feedbackController.js";

const router = express.Router();

// Public submit
router.post("/", createFeedback);

// Admin list (add auth middleware later if needed)
// e.g., router.get("/", protect, admin, getAllFeedback);
router.get("/", getAllFeedback);

// Admin delete (add auth middleware later if needed)
router.delete("/:id", deleteFeedback);

// Public average rating
router.get("/average", getAverageRating);

export default router;
