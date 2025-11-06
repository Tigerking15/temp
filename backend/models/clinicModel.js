import mongoose from "mongoose";

const clinicSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    city: String,
    contact: String,
    specialization: String,
    website: String
  },
  { timestamps: true }
);

export default mongoose.model("Clinic", clinicSchema);
