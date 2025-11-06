// backend/controllers/adminController.js
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Doctor from "../models/doctorModel.js";
import Consultation from "../models/consultationModel.js";

/**
 * GET /api/admin/users
 * Query params:
 *  - q: optional search string (name or email)
 *  - page: optional page number (1)
 *  - limit: optional page size (20)
 */
export const getUsers = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;

    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } }
          ]
        }
      : {};

    const [users, total] = await Promise.all([
      User.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter)
    ]);

    res.json({
      users,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error("admin.getUsers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /api/admin/users/:id
 * Deletes a user document permanently.
 * - Prevents a real logged-in user from deleting themselves.
 * - Admin token (id === "admin") can delete any user.
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If the requester is a real user (not the special admin token),
    // prevent deleting themselves.
    const requesterId = String(req.user?._id || "");
    if (requesterId !== "admin" && requesterId === String(user._id)) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully", id });
  } catch (err) {
    console.error("admin.deleteUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PATCH /api/admin/users/:id/ban
 * Toggle ban/unban.
 * - Prevent banning users with isAdmin === true (protect real admin accounts).
 * - Admin token (special) can still unban if needed, but will be prevented from banning real admins.
 */
export const toggleBanUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Don't allow banning other admin users (safety)
    if (user.isAdmin) {
      return res.status(400).json({ message: "Cannot ban/unban an admin user" });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({
      message: user.isBanned ? "User banned" : "User unbanned",
      id: user._id,
      isBanned: user.isBanned
    });
  } catch (err) {
    console.error("admin.toggleBanUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PATCH /api/admin/users/:id
 * Update basic user fields (name, email, age, gender, doshaType, isAdmin)
 * - Does NOT allow password updates here.
 * - If changing isAdmin, be careful (only admin routes call this).
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Disallow password modifications via this route
    if (updates.password) delete updates.password;

    // Validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent demoting last admin accidentally? (optional)
    // If you want extra safety when toggling isAdmin, implement checks here.

    // Apply allowed updates
    const allowed = ["name", "email", "age", "gender", "doshaType", "isAdmin"];
    allowed.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(updates, field)) {
        user[field] = updates[field];
      }
    });

    await user.save();
    const returned = user.toObject();
    delete returned.password;

    res.json({ message: "User updated", user: returned });
  } catch (err) {
    console.error("admin.updateUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/admin/doctors
 * Query params:
 *  - q: optional search string (name or email)
 *  - page: optional page number (1)
 *  - limit: optional page size (20)
 */
export const getDoctors = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;

    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } }
          ]
        }
      : {};

    const [doctors, total] = await Promise.all([
      Doctor.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Doctor.countDocuments(filter)
    ]);

    res.json({
      doctors,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error("admin.getDoctors error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /api/admin/doctors/:id
 * Deletes a doctor document permanently.
 * - Prevents deletion if the doctor has scheduled appointments (consultations with status other than "Completed").
 */
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid doctor id" });
    }

    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Check if the doctor has any scheduled consultations (not completed)
    const scheduledConsultations = await Consultation.find({
      doctorId: id,
      status: { $ne: "Completed" }
    });

    if (scheduledConsultations.length > 0) {
      return res.status(400).json({
        message: "Cannot delete doctor with scheduled appointments. Please complete or cancel all appointments first."
      });
    }

    await Doctor.findByIdAndDelete(id);
    res.json({ message: "Doctor deleted successfully", id });
  } catch (err) {
    console.error("admin.deleteDoctor error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PATCH /api/admin/doctors/:id/ban
 * Toggle ban/unban for doctor.
 */
export const toggleBanDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid doctor id" });
    }

    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    doctor.isBanned = !doctor.isBanned;
    await doctor.save();

    res.json({
      message: doctor.isBanned ? "Doctor banned" : "Doctor unbanned",
      id: doctor._id,
      isBanned: doctor.isBanned
    });
  } catch (err) {
    console.error("admin.toggleBanDoctor error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/admin/login
 * Admin login: hardcoded credentials for demo
 * Returns JWT token for admin
 */
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hardcoded admin credentials (in production, use env vars or DB)
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (username !== adminUsername || password !== adminPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT for admin
    const token = jwt.sign(
      { id: "admin", role: "admin", email: process.env.ADMIN_EMAIL || "admin@swasthya.com" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("admin.adminLogin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
