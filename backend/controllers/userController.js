// backend/controllers/userController.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', '..', 'uploads');
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

const buildUserResponse = (userDoc) => {
  // pick safe fields to return
  return {
    _id: userDoc._id,
    name: userDoc.name,
    email: userDoc.email,
    age: userDoc.age ?? null,
    gender: userDoc.gender ?? "",
    doshaType: userDoc.doshaType ?? "Unknown",
    profileImage: userDoc.profileImage ?? "", // now returns filename only
    createdAt: userDoc.createdAt,
    updatedAt: userDoc.updatedAt,
  };
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, age = null, gender = "" } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: "User already exists" });

    // Handle profile image upload - store full URL
    let profileImage = ""; // default empty, frontend will use default image
    if (req.file) {
      profileImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const user = await User.create({ name, email, password, age, gender, profileImage });
    const token = signToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: buildUserResponse(user),
    });
  } catch (err) {
    console.error("registerUser error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (user.isBanned) {
      return res.status(403).json({ success: false, message: "You are banned, please contact admin" });
    }

    const token = signToken(user._id);
    return res.json({
      success: true,
      token,
      user: buildUserResponse(user),
    });
  } catch (err) {
    console.error("loginUser error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const me = async (req, res) => {
  try {
    // protect middleware (should set req.user) — return safe user
    if (!req.user) return res.status(401).json({ success: false, message: "Not authenticated" });
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, user: buildUserResponse(user) });
  } catch (err) {
    console.error("me error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Not authenticated" });
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Handle profile image upload if provided - store full URL
    if (req.file) {
      user.profileImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // Update other fields if provided
    const { name, age, gender, doshaType } = req.body;
    if (name !== undefined) user.name = name;
    if (age !== undefined) user.age = age;
    if (gender !== undefined) user.gender = gender;
    if (doshaType !== undefined) user.doshaType = doshaType;

    await user.save();

    return res.json({
      success: true,
      user: buildUserResponse(user),
    });
  } catch (err) {
    console.error("updateProfile error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
