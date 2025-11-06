// controllers/backedRecipieController.js
import BackedRecipie from "../models/backedRecipie.js";

/**
 * GET all backed recipes
 */
export const getAllBackedRecipies = async (req, res) => {
  try {
    const recipies = await BackedRecipie.find();
    return res.status(200).json(recipies);
  } catch (error) {
    console.error("ERROR getAllBackedRecipies:", error);
    return res.status(500).json({ message: "Error fetching recipes", error: error.message || error });
  }
};

/**
 * GET by symptom keyword (case-insensitive)
 */
export const getByKeyword = async (req, res) => {
  try {
    const { keyword } = req.params;
    const recipies = await BackedRecipie.find({
      symptom_keywords: { $regex: new RegExp(keyword, "i") },
    });
    if (!recipies || recipies.length === 0) {
      return res.status(404).json({ message: "No matching recipes found." });
    }
    return res.status(200).json(recipies);
  } catch (error) {
    console.error("ERROR getByKeyword:", error);
    return res.status(500).json({ message: "Error fetching by keyword", error: error.message || error });
  }
};

/**
 * POST single recipe
 * Expect body to match your Mongoose schema (id, symptom_keywords, recipes: {Vata|Pitta|Kapha}, etc.)
 */
export const addBackedRecipie = async (req, res) => {
  try {
    console.log("DEBUG addBackedRecipie payload:", JSON.stringify(req.body).slice(0, 2000));
    const newRecipie = new BackedRecipie(req.body);
    const saved = await newRecipie.save();
    console.log("DEBUG saved recipe id:", saved.id);
    return res.status(201).json({ message: "Recipe added successfully", newRecipie: saved });
  } catch (error) {
    console.error("ERROR addBackedRecipie:", error);
    // Return helpful message for debugging (reduce verbosity later)
    const errMsg = error?.message || String(error);
    return res.status(400).json({ message: "Error adding recipe", error: errMsg });
  }
};

/**
 * DELETE by id (field `id`)
 */
export const deleteBackedRecipie = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BackedRecipie.findOneAndDelete({ id });
    if (!deleted) return res.status(404).json({ message: "Recipe not found" });
    return res.status(200).json({ message: "Recipe deleted successfully", id });
  } catch (error) {
    console.error("ERROR deleteBackedRecipie:", error);
    return res.status(500).json({ message: "Error deleting recipe", error: error.message || error });
  }
};

/**
 * BULK insert endpoint for AI-generated recipes
 * Accepts an array of documents in the same shape as your model expects.
 * Uses insertMany({ ordered: false }) so duplicates don't block remaining inserts.
 */
export const addBackedRecipiesBulk = async (req, res) => {
  try {
    console.log("DEBUG addBackedRecipiesBulk payload length:", Array.isArray(req.body) ? req.body.length : 0);
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ message: "Payload must be a non-empty array" });
    }

    // insertMany with ordered:false will continue past duplicate key errors for other docs
    const inserted = await BackedRecipie.insertMany(req.body, { ordered: false });
    console.log("DEBUG insertMany inserted count:", inserted.length);
    return res.status(201).json({ message: "Bulk insert successful", insertedCount: inserted.length });
  } catch (error) {
    console.error("ERROR addBackedRecipiesBulk:", error);

    // If Mongo returns a bulk write error (e.g., duplicates), include details
    if (error && error.code === 11000) {
      return res.status(409).json({ message: "Duplicate key error", error: error.message || error });
    }
    return res.status(500).json({ message: "Bulk insert error", error: error.message || error });
  }
};
