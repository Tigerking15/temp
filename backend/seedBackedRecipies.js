import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import BackedRecipie from "./models/backedRecipie.js"; // ensure this path is correct

// Load environment variables
dotenv.config();

// MongoDB Atlas connection (from your .env file)
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in your .env file!");
  process.exit(1);
}

// Connect to MongoDB Atlas
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("🌿 Connected to MongoDB Atlas successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Load JSON data
const dataPath = path.resolve("./data/recipeupdated.json");
let data;

try {
  const fileContents = fs.readFileSync(dataPath, "utf8");
  data = JSON.parse(fileContents);
  console.log(`📦 Loaded ${data.length} recipe entries from recipeupdated.json`);
} catch (err) {
  console.error("❌ Error reading recipeupdated.json:", err);
  process.exit(1);
}

// Function to import data
const importData = async () => {
  try {
    await BackedRecipie.deleteMany();
    await BackedRecipie.insertMany(data);
    console.log("✅ backedrecipies data imported successfully into MongoDB Atlas!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error importing data:", error);
    process.exit(1);
  }
};

// Run importer
importData();
