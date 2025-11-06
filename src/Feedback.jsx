import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Feedback() {
  const [formData, setFormData] = useState({ name: "", message: "", rating: 5 });
  const [response, setResponse] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse("Sending...");

    const res = await fetch("https://swasthya2-0.onrender.com/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setResponse(data.message);
    // Reset only name and message, keep the rating
    setFormData({ name: "", message: "", rating: formData.rating });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100 px-4 relative">

      {/* Floating Back Button - Privacy Policy Style */}
      <button
        onClick={() => navigate("/Home")}
        className="fixed top-4 left-4 px-4 py-2 flex items-center gap-2 
          bg-white/80 backdrop-blur-sm rounded-lg shadow-lg 
          border border-gray-200 text-gray-700 hover:bg-gray-50 
          transition-all duration-300 z-50"
      >
        <ArrowLeft size={20} /> Back to Home
      </button>

      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-lg w-full border border-green-100">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Swasthya Feedback
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Share your experience or suggestions to help us grow 
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full border rounded-lg p-4 focus:ring-2 focus:ring-green-400 focus:outline-none"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Feedback"
            rows="5"
            className="w-full border rounded-lg p-4 focus:ring-2 focus:ring-green-400 focus:outline-none resize-none"
            required
          ></textarea>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="1"
              max="5"
              className="w-full border rounded-lg p-4 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition duration-300 shadow-md hover:shadow-lg"
          >
            Submit Feedback
          </button>
        </form>

        {response && (
          <p className="text-center text-green-700 mt-6 font-medium">{response}</p>
        )}
      </div>
    </div>
  );
}
