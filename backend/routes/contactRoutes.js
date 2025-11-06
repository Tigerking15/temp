import { Router } from "express";
import ContactMessage from "../models/ContactMessage.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;

    // quick payload guard (additional to Mongoose validation)
    if (![firstName, lastName, email, subject, message].every(Boolean)) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const doc = await ContactMessage.create({
      firstName,
      lastName,
      email,
      subject,
      message,
    });

    return res.status(201).json({
      message: "Thanks for contacting us. We’ll get back to you shortly.",
      id: doc._id,
    });
  } catch (err) {
    // Mongoose validation error handling
    if (err?.name === "ValidationError") {
      const details = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: "Validation failed", errors: details });
    }
    console.error("Contact form error:", err);
    return res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
});

export default router;
