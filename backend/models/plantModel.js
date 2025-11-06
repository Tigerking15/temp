// backend/models/plantModel.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const PartSchema = new Schema(
  {
    partUsed: { type: String },
    commonName: { type: String },
    sanskritName: { type: String },
    scientificName: { type: String },
    family: { type: String },
    activeConstituents: { type: String },
    doshaEffect: { type: String },
    benefits: { type: String },
    traditionalUses: { type: String },
    pharmacologicalActions: { type: String },
    modernResearch: { type: String },
    formulations: { type: String },
    cautions: { type: String },
  },
  { _id: false }
);

const PlantSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    displayName: { type: String },
    aliases: [{ type: String }],
    description: { type: String },
    parts: { type: Map, of: PartSchema, default: {} },
    modelPath: { type: String },
    tags: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Plant", PlantSchema);
