import express from "express";
import {
  addRecipe,
  getUserRecipes,
  updateRecipe,
  deleteRecipe,
  getPublicRecipes,
} from "../controllers/recipeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All recipe routes require authentication except public recipes
router.route("/").post(protect, addRecipe).get(protect, getUserRecipes);
router.route("/:id").put(protect, updateRecipe).delete(protect, deleteRecipe);

// Public recipes (no auth required)
router.get("/public", getPublicRecipes);

export default router;
