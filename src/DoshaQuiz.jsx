// src/DoshaQuiz.jsx
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Leaf, Brain, Heart, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import doshaConfig from "./config/doshaConfig.json";

export default function DoshaQuiz() {
  const navigate = useNavigate();

  const steps = [
    { id: 1, title: "Basic Info", icon: Leaf },
    { id: 2, title: "Physical Traits", icon: Activity },
    { id: 3, title: "Lifestyle", icon: Heart },
    { id: 4, title: "Mental Traits", icon: Brain },
    { id: 5, title: "Symptoms", icon: Leaf },
  ];

  // Build initial dynamic keys from JSON so keys exactly match JSON headings
  const initialDynamic = useMemo(() => {
    const base = {};
    Object.keys(doshaConfig).forEach((key) => {
      base[key] = "";
    });
    return base;
  }, []);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    ...initialDynamic,
    symptoms: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // Prepare trait grouping for steps (avoid duplicates for Body Weight and Height)
  const traitKeys = useMemo(() => Object.keys(doshaConfig), []);
  const reservedForStep1 = ["Body Weight", "Height"];
  const physicalAll = traitKeys.filter((k) => !reservedForStep1.includes(k));

  // Heuristic split: physical (first block), lifestyle (middle), mental (rest)
  const physicalKeys = physicalAll.slice(0, Math.min(16, physicalAll.length));
  const remainingAfterPhysical = physicalAll.slice(physicalKeys.length);
  const lifestyleKeys = remainingAfterPhysical.slice(0, Math.min(8, remainingAfterPhysical.length));
  const mentalKeys = remainingAfterPhysical.slice(lifestyleKeys.length);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Keep behavior same: navigate to DoshaResult with formData
    navigate("/DoshaResult", { state: { formData } });
  };

  const progress = (currentStep / steps.length) * 100;

  // helper to render selects for a given array of trait keys
  const renderTraitSelects = (keysArray) =>
    keysArray.map((traitKey) => {
      const optionsObj = doshaConfig[traitKey] || {};
      const optionValues = Object.keys(optionsObj);
      return (
        <div key={traitKey}>
          <label className="block text-sm font-medium text-green-100 mb-1">{traitKey}</label>
          <select
            name={traitKey}
            value={formData[traitKey] || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-400 bg-white/70"
            required
          >
            <option value="">{`Select ${traitKey}`}</option>
            {optionValues.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );
    });

  return (
    <div className="relative min-h-screen flex justify-center items-center p-6 overflow-hidden pt-28">
      <Navbar />
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/sunlight.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="relative w-full max-w-3xl bg-white/10 backdrop-blur-2xl shadow-2xl rounded-2xl p-8 border border-white/20 z-10">
        <h1 className="text-4xl font-extrabold text-white mb-2 text-center drop-shadow-md">
          Dosha Quiz
        </h1>
        <p className="text-center text-gray-200 mb-6">Discover your Ayurvedic constitution</p>

        <div className="flex justify-between mb-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex flex-col items-center w-full">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-colors ${
                    currentStep >= step.id
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-gray-200/40 text-gray-400 border-gray-300"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    currentStep === step.id ? "text-green-300" : "text-gray-300"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        <div className="w-full bg-gray-300/40 rounded-full h-3 mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
            className="bg-green-500 h-3 rounded-full shadow-md"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Step 1 - Basic Info */}
{currentStep === 1 && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Name */}
    <input
      type="text"
      name="name"
      placeholder="Name"
      value={formData.name}
      onChange={handleChange}
      className="w-full h-[52px] border rounded-lg px-3 font-semibold text-gray-800 
                 focus:ring-2 focus:ring-green-400 bg-white/80 placeholder:font-semibold"
      required
    />

    {/* Age */}
    <input
      type="number"
      name="age"
      placeholder="Age"
      value={formData.age}
      onChange={handleChange}
      className="w-full h-[52px] border rounded-lg px-3 font-semibold text-gray-800 
                 focus:ring-2 focus:ring-green-400 bg-white/80 placeholder:font-semibold"
      required
    />

    {/* Gender */}
    <select
      name="gender"
      value={formData.gender}
      onChange={handleChange}
      className="w-full h-[52px] border rounded-lg px-3 font-semibold text-gray-800 
                 focus:ring-2 focus:ring-green-400 bg-white/80 placeholder:font-semibold"
      required
    >
      <option value="">Select Gender</option>
      <option>Male</option>
      <option>Female</option>
      <option>Other</option>
    </select>

    {/* Body Weight */}
    {doshaConfig["Body Weight"] ? (
      <select
        name="Body Weight"
        value={formData["Body Weight"] || ""}
        onChange={handleChange}
        className="w-full h-[52px] border rounded-lg px-3 font-semibold text-gray-800 
                   focus:ring-2 focus:ring-green-400 bg-white/80"
        required
      >
        <option value="">Select Body Weight</option>
        {Object.keys(doshaConfig["Body Weight"]).map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    ) : (
      <input
        type="text"
        name="weight"
        placeholder="Weight (kg)"
        value={formData.weight}
        onChange={handleChange}
        className="w-full h-[52px] border rounded-lg px-3 font-semibold text-gray-800 
                   focus:ring-2 focus:ring-green-400 bg-white/80 placeholder:font-semibold"
      />
    )}

    {/* Height */}
    {doshaConfig["Height"] ? (
      <select
        name="Height"
        value={formData["Height"] || ""}
        onChange={handleChange}
        className="w-full h-[52px] border rounded-lg px-3 font-semibold text-gray-800 
                   focus:ring-2 focus:ring-green-400 bg-white/80"
        required
      >
        <option value="">Select Height</option>
        {Object.keys(doshaConfig["Height"]).map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    ) : (
      <input
        type="text"
        name="height"
        placeholder="Height (cm)"
        value={formData.height}
        onChange={handleChange}
        className="w-full h-[52px] border rounded-lg px-3 font-semibold text-gray-800 
                   focus:ring-2 focus:ring-green-400 bg-white/80 placeholder:font-semibold"
      />
    )}
  </div>
)}


            {/* Step 2 - Physical Traits */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderTraitSelects(physicalKeys)}
              </div>
            )}

            {/* Step 3 - Lifestyle */}
            {currentStep === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderTraitSelects(lifestyleKeys)}
              </div>
            )}

            {/* Step 4 - Mental Traits */}
            {currentStep === 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderTraitSelects(mentalKeys)}
              </div>
            )}

            {/* Step 5 - Symptoms */}
            {currentStep === 5 && (
              <textarea
                name="symptoms"
                placeholder="Describe current health issues..."
                value={formData.symptoms}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-400 bg-white/70"
                rows="4"
              ></textarea>
            )}
          </motion.div>

          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 bg-gray-200/70 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Back
              </button>
            )}
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="ml-auto px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
