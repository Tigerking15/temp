// backend/routes/plantRoutes.js
import express from "express";
import {
  getPlants,
  getPlantBySlug,
  addPlant,
  createManyPlants,
  updatePlant,
  deletePlant,
} from "../controllers/plantController.js";

const router = express.Router();

// GET /api/plants
router.get("/", getPlants);

// GET /api/plants/:slug
router.get("/:slug", getPlantBySlug);

// POST /api/plants      -> create single plant
router.post("/", addPlant);

// POST /api/plants/bulk?overwrite=true  -> bulk insert/upsert
router.post("/bulk", createManyPlants);

// PUT /api/plants/:slug -> update plant
router.put("/:slug", updatePlant);

// DELETE /api/plants/:slug -> delete plant
router.delete("/:slug", deletePlant);

export default router;
