// models/backedRecipie.js
import mongoose from "mongoose";

const doshaSchema = new mongoose.Schema({
  recipe_name: { type: String, required: true },
  ingredients: [{ type: String }],
  preparation: { type: String },
  description: { type: String },
  contraindications: [{ type: String }],
  frequency_duration: { type: String },
}, { _id: false }); // don't need separate _id for subdocs

const backedRecipieSchema = new mongoose.Schema(
  {
    // keep this unique if you want to enforce dedupe; ensure frontend generates unique ids for AI docs
    id: { type: String, required: true, unique: true },

    // keywords that this entry covers (e.g. ["runny nose","nasal congestion"])
    symptom_keywords: [{ type: String }],

    title: { type: String },

    // nested per-dosha documents
    recipes: {
      Vata: { type: doshaSchema },
      Pitta: { type: doshaSchema },
      Kapha: { type: doshaSchema },
    },

    tags: [{ type: String }],

    // track when the entry was last updated (frontend/backend can set)
    last_updated: { type: Date, default: Date.now },

    // source of the entry - 'manual'|'import'|'ai' etc.
    source: { type: String, default: "manual", index: true },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    collection: "backedrecipies", // explicit collection name — keep to match existing
  }
);

// optional index to speed up keyword lookup (text index or array lookup)
// you can add a simple index for symptom_keywords
backedRecipieSchema.index({ symptom_keywords: 1 });

// Export model
export default mongoose.model("BackedRecipie", backedRecipieSchema, "backedrecipies");
