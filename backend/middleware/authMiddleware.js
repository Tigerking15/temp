// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Doctor from "../models/doctorModel.js";

/**
 * Protect middleware:
 * - Verifies JWT token from Authorization header
 * - Accepts both normal user tokens and special admin token
 * - Blocks banned users
 */
export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // --- Special admin token handling (from adminLogin) ---
    if (decoded?.id === "admin" && decoded?.role === "admin") {
      req.user = {
        _id: "admin",
        email: decoded.email || process.env.ADMIN_EMAIL,
        isAdmin: true,
        role: "admin"
      };
      return next();
    }

    // --- Normal user handling ---
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    // Block banned users
    if (user.isBanned) {
      return res.status(403).json({ message: "Account is banned. Contact support." });
    }

    req.user = user;
    next();
  } catch (e) {
    console.error("Auth Error:", e.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

/**
 * Protect Doctor middleware:
 * - Works the same way but for doctors collection
 * - Blocks banned doctors
 */
export const protectDoctor = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const doctor = await Doctor.findById(decoded.id).select("-password");
    if (!doctor) return res.status(401).json({ message: "Doctor not found" });

    // Block banned doctors
    if (doctor.isBanned) {
      return res.status(403).json({ message: "Account is banned. Contact support." });
    }

    req.doctor = doctor;
    next();
  } catch (e) {
    console.error("Doctor Auth Error:", e.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

/**
 * Admin-only middleware:
 * - Allows special admin token or ADMIN_EMAIL from env
 */
export const adminOnly = (req, res, next) => {
  const adminEmail = process.env.ADMIN_EMAIL || "";

  if (req.user?.isAdmin) return next();
  if (req.user?.email && req.user.email === adminEmail) return next();

  return res.status(403).json({ message: "Admin only" });
};
