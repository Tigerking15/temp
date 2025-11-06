import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    ingredients: [{
      type: String,
      trim: true,
    }],
    steps: {
      type: String,
      trim: true,
    },
    doshaType: {
      type: String,
      enum: ["Vata", "Pitta", "Kapha", "Tridoshic"],
      default: "Tridoshic",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
recipeSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Recipe", recipeSchema);
