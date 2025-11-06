import jwt from "jsonwebtoken";
import Doctor from "../models/doctorModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

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

export const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization = "", experience = 0, location = "" } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const exists = await Doctor.findOne({ email: normalizedEmail });
    if (exists) return res.status(409).json({ success: false, message: "Doctor already exists" });

    // Handle avatar upload
    let avatarUrl = "https://randomuser.me/api/portraits/men/1.jpg"; // default
    if (req.file) {
      avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const doctor = await Doctor.create({ name, email, password, specialization, experience, location, avatar: avatarUrl });
    const token = signToken(doctor._id);

    return res.status(201).json({
      success: true,
      token,
      doctor: {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        experience: doctor.experience,
        location: doctor.location,
        avatar: doctor.avatar,
        createdAt: doctor.createdAt,
      },
    });
  } catch (err) {
    console.error("registerDoctor error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });

    const normalizedEmail = email.toLowerCase().trim();
    const doctor = await Doctor.findOne({ email: normalizedEmail });
    if (!doctor || !(await doctor.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (doctor.isBanned) {
      return res.status(403).json({ success: false, message: "You are banned, please contact admin" });
    }

    const token = signToken(doctor._id);
    return res.json({
      success: true,
      token,
      doctor: {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        experience: doctor.experience,
        location: doctor.location,
        avatar: doctor.avatar,
        createdAt: doctor.createdAt,
      },
    });
  } catch (err) {
    console.error("loginDoctor error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const meDoctor = async (req, res) => {
  try {
    // protect middleware (should set req.doctor) — return safe doctor
    if (!req.doctor) return res.status(401).json({ success: false, message: "Not authenticated" });
    const doctor = await Doctor.findById(req.doctor._id);
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    return res.json({
      success: true,
      doctor: {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        experience: doctor.experience,
        location: doctor.location,
        avatar: doctor.avatar,
        createdAt: doctor.createdAt,
      },
    });
  } catch (err) {
    console.error("meDoctor error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    if (!req.doctor) return res.status(401).json({ success: false, message: "Not authenticated" });
    const { name, email, specialization, experience, location, rating, avatar } = req.body;
    const doctor = await Doctor.findById(req.doctor._id);
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    doctor.name = name || doctor.name;
    doctor.email = email || doctor.email;
    doctor.specialization = specialization || doctor.specialization;
    doctor.experience = experience || doctor.experience;
    doctor.location = location || doctor.location;
    doctor.rating = rating !== undefined ? rating : doctor.rating;
    doctor.avatar = avatar || doctor.avatar;

    await doctor.save();

    return res.json({
      success: true,
      doctor: {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        experience: doctor.experience,
        location: doctor.location,
        rating: doctor.rating,
        avatar: doctor.avatar,
        createdAt: doctor.createdAt,
      },
    });
  } catch (err) {
    console.error("updateDoctor error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).select("-password");
    return res.json({
      success: true,
      doctors,
    });
  } catch (err) {
    console.error("getAllDoctors error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
