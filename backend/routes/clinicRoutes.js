import express from "express";
import { getClinics, addClinic } from "../controllers/clinicController.js";
const router = express.Router();

router.get("/", getClinics);
router.post("/", addClinic);

export default router;
