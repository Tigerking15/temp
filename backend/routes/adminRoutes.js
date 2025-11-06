// backend/routes/adminRoutes.js
import express from "express";
import {
  getUsers,
  deleteUser,
  toggleBanUser,
  updateUser,
  getDoctors,
  deleteDoctor,
  toggleBanDoctor,
  adminLogin
} from "../controllers/adminController.js";
import { getAllMessages, resolveContactMessage, deleteContactMessage } from "../controllers/contactController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Login route (no auth required)
router.post("/login", adminLogin);

// All other routes require an authenticated admin
router.use(protect, adminOnly);

// GET list (supports ?q=, ?page=, ?limit=)
router.get("/users", getUsers);

// DELETE user
router.delete("/users/:id", deleteUser);

// PATCH toggle ban
router.patch("/users/:id/ban", toggleBanUser);

// PATCH update user (name, email, age, gender, doshaType, isAdmin)
router.patch("/users/:id", updateUser);

// GET doctors list (supports ?q=, ?page=, ?limit=)
router.get("/doctors", getDoctors);

// DELETE doctor
router.delete("/doctors/:id", deleteDoctor);

// PATCH toggle ban for doctor
router.patch("/doctors/:id/ban", toggleBanDoctor);

// GET contact messages
router.get("/contact-messages", getAllMessages);

// PATCH resolve contact message
router.patch("/contact-messages/:id/resolve", resolveContactMessage);

// DELETE contact message
router.delete("/contact-messages/:id", deleteContactMessage);

export default router;
