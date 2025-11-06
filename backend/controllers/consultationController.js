import Consultation from "../models/consultationModel.js";

export const bookConsultation = async (req, res) => {
  const { doctorId, doctorName, specialization, date, time } = req.body;
  console.log("Booking attempt:", { doctorId, date, time, userId: req.user._id });
  if (!doctorId) {
    return res.status(400).json({ success: false, message: "Doctor ID is required" });
  }

  // Check for existing consultation with the same doctor, date, and time that is not cancelled or completed
  console.log("Checking for existing consultation with:", { doctorId, date, time });
  const existingConsultation = await Consultation.findOne({
    doctorId,
    date,
    time,
    status: { $nin: ['Cancelled', 'Completed'] }
  });
  console.log("Existing consultation found:", existingConsultation);

  if (existingConsultation) {
    console.log("Blocking booking due to conflict");
    return res.status(409).json({ success: false, message: "The doctor is already booked for this date and time. Please choose a different slot." });
  }

  const c = await Consultation.create({
    userId: req.user._id,
    doctorId,
    doctorName, specialization, date, time
  });
  console.log("Consultation created successfully:", c._id);
  res.status(201).json({ success: true, consultation: c });
};

export const myConsultations = async (req, res) => {
  const items = await Consultation.find({ userId: req.user._id }).populate('doctorId', 'name email').sort({ createdAt: -1 });
  res.json({ success: true, consultations: items });
};

export const getDoctorConsultations = async (req, res) => {
  const items = await Consultation.find({ doctorId: req.doctor._id }).populate('userId', 'name email').sort({ createdAt: -1 });
  res.json({ success: true, consultations: items });
};

export const updateConsultationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log("Update consultation status request:", { id, status, doctorId: req.doctor?._id });

  if (!['Confirmed', 'Cancelled'].includes(status)) {
    console.log("Invalid status:", status);
    return res.status(400).json({ success: false, message: "Invalid status. Must be 'Confirmed' or 'Cancelled'" });
  }

  try {
    const consultation = await Consultation.findById(id);
    if (!consultation) {
      console.log("Consultation not found:", id);
      return res.status(404).json({ success: false, message: "Consultation not found" });
    }

    console.log("Consultation found:", { consultationId: consultation._id, doctorId: consultation.doctorId, status: consultation.status });

    if (consultation.doctorId.toString() !== req.doctor._id.toString()) {
      console.log("Unauthorized: consultation doctorId", consultation.doctorId, "req doctorId", req.doctor._id);
      return res.status(403).json({ success: false, message: "Unauthorized to update this consultation" });
    }

    if (status === 'Cancelled') {
      // Delete the consultation from database
      await Consultation.findByIdAndDelete(id);
      console.log("Consultation cancelled and deleted successfully:", { id });
      res.json({ success: true, message: "Consultation cancelled and deleted" });
    } else {
      // For Accepted, update status
      consultation.status = status;
      await consultation.save();
      console.log("Consultation updated successfully:", { id, status });
      res.json({ success: true, consultation });
    }
  } catch (error) {
    console.error("Error updating consultation:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
