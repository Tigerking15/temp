import express from "express";
import Consultation from '../models/consultationModel.js';
import { bookConsultation, myConsultations, getDoctorConsultations, updateConsultationStatus } from "../controllers/consultationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { protectDoctor } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/book", protect, bookConsultation);
router.get("/my", protect, myConsultations);
router.get("/doctor", protectDoctor, getDoctorConsultations);
router.put("/:id/status", protectDoctor, updateConsultationStatus);

export default router;
