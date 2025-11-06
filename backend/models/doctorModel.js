import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    specialization: { type: String, default: "" },
    experience: { type: Number, default: 0 },
    location: { type: String, default: "" },
    rating: { type: Number, default: 4.5 },
    avatar: { type: String, default: "https://randomuser.me/api/portraits/men/1.jpg" },
    isBanned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// hash password before save
doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// instance method to compare password
doctorSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

export default mongoose.model("Doctor", doctorSchema);