import mongoose from "mongoose";

const symptomSchema = new mongoose.Schema(
  {
    symptom: { type: String, required: true },
    dosha: { type: String, required: true },
    remedy: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Symptom", symptomSchema);
