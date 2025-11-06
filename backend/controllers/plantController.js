// backend/controllers/plantController.js
// ESM named exports (import { getPlants, addPlant } from "../controllers/plantController.js";)

import Plant from "../models/plantModel.js";

/**
 * GET /api/plants
 * Optionally supports ?minimal=true (returns only slug & displayName)
 */
export const getPlants = async (req, res) => {
  try {
    const minimal = req.query.minimal === "true";
    if (minimal) {
      const list = await Plant.find({}, { slug: 1, displayName: 1 }).sort({ displayName: 1 });
      return res.status(200).json({ success: true, plants: list });
    }

    const plants = await Plant.find().sort({ displayName: 1 });
    return res.status(200).json({ success: true, plants });
  } catch (err) {
    console.error("getPlants error:", err);
    return res.status(500).json({ success: false, message: "Server error", details: err.message });
  }
};

/**
 * GET /api/plants/:slug
 */
export const getPlantBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) return res.status(400).json({ success: false, message: "Missing slug" });

    const plant = await Plant.findOne({ slug });
    if (!plant) return res.status(404).json({ success: false, message: "Plant not found" });

    return res.status(200).json({ success: true, plant });
  } catch (err) {
    console.error("getPlantBySlug error:", err);
    return res.status(500).json({ success: false, message: "Server error", details: err.message });
  }
};

/**
 * POST /api/plants
 * Create single plant (protected route if you apply auth)
 */
export const addPlant = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.slug) {
      return res.status(400).json({ success: false, message: "Missing required field: slug" });
    }

    const existing = await Plant.findOne({ slug: payload.slug });
    if (existing) {
      return res.status(409).json({ success: false, message: `Plant with slug '${payload.slug}' already exists` });
    }

    const plant = new Plant(payload);
    await plant.save();
    return res.status(201).json({ success: true, message: "Plant created", plant });
  } catch (err) {
    console.error("addPlant error:", err);
    return res.status(500).json({ success: false, message: "Server error", details: err.message });
  }
};

/**
 * POST /api/plants/bulk?overwrite=true
 * Bulk insert or bulk upsert. Expects array of plant objects in req.body.
 */
export const createManyPlants = async (req, res) => {
  try {
    const plants = req.body;
    const overwrite = req.query.overwrite === "true";

    if (!Array.isArray(plants) || plants.length === 0) {
      return res.status(400).json({ success: false, message: "Expected array of plant objects" });
    }

    if (overwrite) {
      const ops = plants.map((p) => ({
        updateOne: { filter: { slug: p.slug }, update: { $set: p }, upsert: true },
      }));
      const result = await Plant.bulkWrite(ops);
      return res.status(200).json({ success: true, message: "Bulk upsert complete", result });
    } else {
      const slugs = plants.map((p) => p.slug).filter(Boolean);
      const existing = await Plant.find({ slug: { $in: slugs } }).select("slug");
      const existingSlugs = new Set(existing.map((e) => e.slug));
      const toInsert = plants.filter((p) => !existingSlugs.has(p.slug));

      if (toInsert.length === 0) {
        return res.status(409).json({ success: false, message: "No new plants to insert" });
      }
      const inserted = await Plant.insertMany(toInsert);
      return res.status(201).json({ success: true, message: "Inserted plants", inserted, skipped: plants.length - toInsert.length });
    }
  } catch (err) {
    console.error("createManyPlants error:", err);
    return res.status(500).json({ success: false, message: "Server error", details: err.message });
  }
};

/**
 * PUT /api/plants/:slug
 * Update plant by slug
 */
export const updatePlant = async (req, res) => {
  try {
    const { slug } = req.params;
    const update = req.body;
    if (!slug) return res.status(400).json({ success: false, message: "Missing slug" });

    const plant = await Plant.findOneAndUpdate({ slug }, { $set: update }, { new: true, runValidators: true });
    if (!plant) return res.status(404).json({ success: false, message: "Plant not found" });

    return res.status(200).json({ success: true, message: "Plant updated", plant });
  } catch (err) {
    console.error("updatePlant error:", err);
    return res.status(500).json({ success: false, message: "Server error", details: err.message });
  }
};

/**
 * DELETE /api/plants/:slug
 */
export const deletePlant = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) return res.status(400).json({ success: false, message: "Missing slug" });

    const result = await Plant.findOneAndDelete({ slug });
    if (!result) return res.status(404).json({ success: false, message: "Plant not found" });

    return res.status(200).json({ success: true, message: "Plant deleted", slug });
  } catch (err) {
    console.error("deletePlant error:", err);
    return res.status(500).json({ success: false, message: "Server error", details: err.message });
  }
};
