import asyncHandler from "express-async-handler";
import ContactMessage from "../models/ContactMessage.js";

// @desc    Save contact form submission
// @route   POST /api/contact
// @access  Public
const createContactMessage = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  if (!firstName || !lastName || !email || !subject || !message) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const contactMessage = await ContactMessage.create({
    firstName,
    lastName,
    email,
    subject,
    message,
  });

  res.status(201).json({
    message: "Thank you for contacting us. We will reach out soon.",
    data: contactMessage,
  });
});

// @desc    Get all contact messages (for admin)
// @route   GET /api/contact
// @access  Admin
const getAllMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json(messages);
});

// @desc    Resolve a contact message (for admin)
// @route   PATCH /api/admin/contact-messages/:id/resolve
// @access  Admin
const resolveContactMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const message = await ContactMessage.findById(id);
  if (!message) {
    res.status(404);
    throw new Error("Contact message not found");
  }

  message.status = "resolved";
  message.handledAt = new Date();
  await message.save();

  res.json({ message: "Contact message marked as resolved", data: message });
});

// @desc    Delete a contact message (for admin)
// @route   DELETE /api/admin/contact-messages/:id
// @access  Admin
const deleteContactMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const message = await ContactMessage.findById(id);
  if (!message) {
    res.status(404);
    throw new Error("Contact message not found");
  }

  await ContactMessage.findByIdAndDelete(id);
  res.json({ message: "Contact message deleted successfully" });
});

export { createContactMessage, getAllMessages, resolveContactMessage, deleteContactMessage };
