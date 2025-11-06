import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, UserCheck } from "lucide-react";

export default function DoshaPageAdmin() {
  const navigate = useNavigate();
  const [doshaData, setDoshaData] = useState(JSON.parse(localStorage.getItem("doshaData")) || {
    Vata: "Vata is characterized by qualities of dry, light, cold, rough, subtle, mobile, and clear.",
    Pitta: "Pitta embodies qualities of hot, sharp, light, liquid, oily, and spreading.",
    Kapha: "Kapha is marked by qualities of heavy, slow, cool, oily, smooth, dense, soft, static, and cloudy."
  });

  useEffect(() => {
    // Check if admin is logged in
    if (!localStorage.getItem("adminToken")) {
      navigate("/admin-login");
      return;
    }
  }, [navigate]);

  const handleSave = () => {
    localStorage.setItem("doshaData", JSON.stringify(doshaData));
    alert("Dosha information updated successfully!");
  };

  const handleDoshaChange = (dosha, value) => {
    setDoshaData(prev => ({
      ...prev,
      [dosha]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-xl border-b border-green-100 backdrop-blur-sm bg-white/90">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin-dashboard")}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200 shadow-md hover:shadow-lg"
              >
                <ArrowLeft size={18} />
                Back to Dashboard
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dosha Information Management</h1>
                <p className="text-sm text-gray-600">Update dosha descriptions and information</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-green-100">
            <div className="flex items-center gap-3 mb-6">
              <UserCheck className="text-green-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Edit Dosha Information</h2>
            </div>

            <div className="space-y-6">
              {/* Vata */}
              <div className="border border-gray-200 rounded-xl p-6 bg-blue-50">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Vata Dosha</h3>
                <textarea
                  value={doshaData.Vata}
                  onChange={(e) => handleDoshaChange("Vata", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter Vata dosha description"
                />
              </div>

              {/* Pitta */}
              <div className="border border-gray-200 rounded-xl p-6 bg-red-50">
                <h3 className="text-lg font-semibold text-red-800 mb-3">Pitta Dosha</h3>
                <textarea
                  value={doshaData.Pitta}
                  onChange={(e) => handleDoshaChange("Pitta", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter Pitta dosha description"
                />
              </div>

              {/* Kapha */}
              <div className="border border-gray-200 rounded-xl p-6 bg-green-50">
                <h3 className="text-lg font-semibold text-green-800 mb-3">Kapha Dosha</h3>
                <textarea
                  value={doshaData.Kapha}
                  onChange={(e) => handleDoshaChange("Kapha", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter Kapha dosha description"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => navigate("/admin-dashboard")}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
