import { Router } from "express";
import { registerDoctor, loginDoctor, meDoctor, updateDoctor, getAllDoctors, upload } from "../controllers/doctorController.js";
import { protectDoctor } from "../middleware/authMiddleware.js"; // optional for /me

const router = Router();

router.post("/register", upload.single('avatar'), registerDoctor);
router.post("/login", loginDoctor);
router.get("/me", protectDoctor, meDoctor);
router.put("/update", protectDoctor, updateDoctor);
router.get("/all", getAllDoctors);

// small debug endpoint
router.get("/count", async (req, res) => {
  try {
    const Doctor = (await import("../models/doctorModel.js")).default;
    const count = await Doctor.countDocuments();
    return res.json({ success: true, count });
  } catch (err) {
    console.error("doctor count error:", err);
    return res.status(500).json({ success: false, message: "Error" });
  }
});

export default router;