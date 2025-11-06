import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    doctorName: String,
    specialization: String,
    date: String,
    time: String,
    status: { type: String, default: "Pending" }
  },
  { timestamps: true }
);

export default mongoose.model("Consultation", consultationSchema);
