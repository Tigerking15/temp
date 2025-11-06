import Symptom from "../models/symptomModel.js";

export const getRemedies = async (req, res) => {
  const q = req.query.symptom || "";
  if (!q) return res.json([]);
  const items = await Symptom.find({ symptom: { $regex: q, $options: "i" } }).limit(20);
  res.json(items);
};

export const addSymptom = async (req, res) => {
  const { symptom, dosha, remedy } = req.body;
  const doc = await Symptom.create({ symptom, dosha, remedy });
  res.status(201).json(doc);
};
