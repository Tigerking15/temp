import express from "express";
import { registerUser, loginUser, me, updateProfile, upload } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/register", upload.single('profileImage'), registerUser);
router.post("/login", loginUser);
router.get("/me", protect, me);
router.put("/update", protect, upload.single('profileImage'), updateProfile);

export default router;
