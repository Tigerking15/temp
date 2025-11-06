import express from "express";
import { getRemedies, addSymptom } from "../controllers/symptomController.js";
// You can restrict POST later with protect/adminOnly
const router = express.Router();

router.get("/", getRemedies);
router.post("/", addSymptom);

export default router;
