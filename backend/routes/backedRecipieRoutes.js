// routes/backedRecipeRoutes.js
import express from "express";
import {
  getAllBackedRecipies,
  getByKeyword,
  addBackedRecipie,
  deleteBackedRecipie,
  addBackedRecipiesBulk,
} from "../controllers/backedRecipieController.js";

const router = express.Router();

// GET /api/backedrecipes/           -> all
router.get("/", getAllBackedRecipies);

// GET /api/backedrecipes/keyword/:keyword
router.get("/keyword/:keyword", getByKeyword);

// POST /api/backedrecipes/          -> add single
router.post("/", addBackedRecipie);

// POST /api/backedrecipes/bulk     -> new bulk endpoint for AI saves
router.post("/bulk", addBackedRecipiesBulk);

// DELETE /api/backedrecipes/:id
router.delete("/:id", deleteBackedRecipie);

export default router;
