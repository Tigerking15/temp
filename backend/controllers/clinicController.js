import Clinic from "../models/clinicModel.js";

export const getClinics = async (req, res) => {
  const { city } = req.query;
  const q = city ? { city: { $regex: city, $options: "i" } } : {};
  const items = await Clinic.find(q).sort({ createdAt: -1 });
  res.json(items);
};

export const addClinic = async (req, res) => {
  const c = await Clinic.create(req.body);
  res.status(201).json(c);
};
