import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, minlength: 1, maxlength: 80 },
    lastName:  { type: String, required: true, trim: true, minlength: 1, maxlength: 80 },
    email:     { type: String, required: true, trim: true, lowercase: true, maxlength: 160,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"] },
    subject:   { type: String, required: true, trim: true, maxlength: 150 },
    message:   { type: String, required: true, trim: true, minlength: 5, maxlength: 5000 },

    // optional workflow fields
    status:    { type: String, enum: ["new", "read", "resolved"], default: "new" },
    handledAt: { type: Date, default: null },
    handledBy: { type: String, default: null },
  },
  { timestamps: true } // createdAt, updatedAt
);

// useful index for querying by date + status in admin tools
ContactMessageSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.ContactMessage ||
  mongoose.model("ContactMessage", ContactMessageSchema);
