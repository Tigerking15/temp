import asyncHandler from "express-async-handler";
import Feedback from "../models/feedbackModel.js";

export const createFeedback = asyncHandler(async (req, res) => {
  const { name, message, rating } = req.body;

  if (!name || !message || !rating) {
    res.status(400);
    throw new Error("Name, message, and rating are required");
  }

  if (rating < 1 || rating > 5) {
    res.status(400);
    throw new Error("Rating must be between 1 and 5");
  }

  const doc = await Feedback.create({ name, message, rating });
  res.status(201).json({
    message: "Thanks for your feedback!",
    data: { id: doc._id },
  });
});

// @desc   Get all feedback (for admin dashboard)
// @route  GET /api/feedback
// @access Admin (protect in future)
export const getAllFeedback = asyncHandler(async (_req, res) => {
  const list = await Feedback.find().sort({ createdAt: -1 });
  res.json(list);
});

// @desc   Delete feedback by ID
// @route  DELETE /api/feedback/:id
// @access Admin (protect in future)
export const deleteFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);

  if (!feedback) {
    res.status(404);
    throw new Error("Feedback not found");
  }

  await Feedback.findByIdAndDelete(req.params.id);
  res.json({ message: "Feedback deleted successfully" });
});

// @desc   Get average rating from all feedback
// @route  GET /api/feedback/average
// @access Public
export const getAverageRating = asyncHandler(async (_req, res) => {
  const result = await Feedback.aggregate([
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalFeedbacks: { $sum: 1 }
      }
    }
  ]);

  if (result.length === 0) {
    return res.json({ averageRating: 0, totalFeedbacks: 0 });
  }

  res.json({
    averageRating: Math.round(result[0].averageRating * 10) / 10, // Round to 1 decimal
    totalFeedbacks: result[0].totalFeedbacks
  });
});
