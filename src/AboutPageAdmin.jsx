    import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, FileText } from "lucide-react";

export default function AboutPageAdmin() {
  const navigate = useNavigate();
  const [aboutContent, setAboutContent] = useState(localStorage.getItem("aboutContent") || "Swasthya is your comprehensive Ayurvedic wellness companion, designed to help you discover your unique dosha and achieve holistic healing through personalized remedies and ancient wisdom.");

  useEffect(() => {
    // Check if admin is logged in
    if (!localStorage.getItem("adminToken")) {
      navigate("/admin-login");
      return;
    }
  }, [navigate]);

  const handleSave = () => {
    localStorage.setItem("aboutContent", aboutContent);
    alert("About content updated successfully!");
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
                <h1 className="text-3xl font-bold text-gray-900">About Content Management</h1>
                <p className="text-sm text-gray-600">Edit the about section content</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-green-100">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="text-green-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Edit About Section</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About Content</label>
                <textarea
                  value={aboutContent}
                  onChange={(e) => setAboutContent(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter about section content"
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
