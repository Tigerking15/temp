import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Settings, Palette } from "lucide-react";

export default function ThemePage() {
  const navigate = useNavigate();
  const [themeSettings, setThemeSettings] = useState(JSON.parse(localStorage.getItem("themeSettings")) || {
    primaryColor: "#10B981",
    secondaryColor: "#3B82F6",
    accentColor: "#8B5CF6",
    backgroundGradient: "from-green-50 via-blue-50 to-purple-50",
    fontFamily: "Inter, sans-serif",
    borderRadius: "rounded-xl",
    shadowStyle: "shadow-lg"
  });

  useEffect(() => {
    // Check if admin is logged in
    if (!localStorage.getItem("adminToken")) {
      navigate("/admin-login");
      return;
    }
  }, [navigate]);

  const handleSave = () => {
    localStorage.setItem("themeSettings", JSON.stringify(themeSettings));
    alert("Theme settings updated successfully!");
  };

  const handleThemeChange = (key, value) => {
    setThemeSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const colorOptions = [
    { name: "Green", value: "#10B981" },
    { name: "Blue", value: "#3B82F6" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Red", value: "#EF4444" },
    { name: "Orange", value: "#F97316" },
    { name: "Teal", value: "#14B8A6" }
  ];

  const gradientOptions = [
    { name: "Green to Blue", value: "from-green-50 via-blue-50 to-purple-50" },
    { name: "Blue to Purple", value: "from-blue-50 via-purple-50 to-pink-50" },
    { name: "Green to Teal", value: "from-green-50 via-teal-50 to-cyan-50" },
    { name: "Purple to Pink", value: "from-purple-50 via-pink-50 to-rose-50" }
  ];

  const fontOptions = [
    { name: "Inter", value: "Inter, sans-serif" },
    { name: "Roboto", value: "Roboto, sans-serif" },
    { name: "Open Sans", value: "Open Sans, sans-serif" },
    { name: "Lato", value: "Lato, sans-serif" }
  ];

  const borderRadiusOptions = [
    { name: "Small", value: "rounded-lg" },
    { name: "Medium", value: "rounded-xl" },
    { name: "Large", value: "rounded-2xl" },
    { name: "Extra Large", value: "rounded-3xl" }
  ];

  const shadowOptions = [
    { name: "Light", value: "shadow-md" },
    { name: "Medium", value: "shadow-lg" },
    { name: "Heavy", value: "shadow-xl" },
    { name: "Extra Heavy", value: "shadow-2xl" }
  ];

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
                <h1 className="text-3xl font-bold text-gray-900">Theme Settings</h1>
                <p className="text-sm text-gray-600">Customize the application theme and appearance</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-green-100">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="text-green-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Customize Theme</h2>
            </div>

            <div className="space-y-8">
              {/* Colors */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Palette className="text-green-600" size={20} />
                  Color Scheme
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                    <select
                      value={themeSettings.primaryColor}
                      onChange={(e) => handleThemeChange("primaryColor", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {colorOptions.map(color => (
                        <option key={color.value} value={color.value}>{color.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                    <select
                      value={themeSettings.secondaryColor}
                      onChange={(e) => handleThemeChange("secondaryColor", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {colorOptions.map(color => (
                        <option key={color.value} value={color.value}>{color.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                    <select
                      value={themeSettings.accentColor}
                      onChange={(e) => handleThemeChange("accentColor", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {colorOptions.map(color => (
                        <option key={color.value} value={color.value}>{color.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Background Gradient */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Gradient</label>
                <select
                  value={themeSettings.backgroundGradient}
                  onChange={(e) => handleThemeChange("backgroundGradient", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {gradientOptions.map(gradient => (
                    <option key={gradient.value} value={gradient.value}>{gradient.name}</option>
                  ))}
                </select>
              </div>

              {/* Typography */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                <select
                  value={themeSettings.fontFamily}
                  onChange={(e) => handleThemeChange("fontFamily", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {fontOptions.map(font => (
                    <option key={font.value} value={font.value}>{font.name}</option>
                  ))}
                </select>
              </div>

              {/* Border Radius */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
                <select
                  value={themeSettings.borderRadius}
                  onChange={(e) => handleThemeChange("borderRadius", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {borderRadiusOptions.map(radius => (
                    <option key={radius.value} value={radius.value}>{radius.name}</option>
                  ))}
                </select>
              </div>

              {/* Shadow Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shadow Style</label>
                <select
                  value={themeSettings.shadowStyle}
                  onChange={(e) => handleThemeChange("shadowStyle", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {shadowOptions.map(shadow => (
                    <option key={shadow.value} value={shadow.value}>{shadow.name}</option>
                  ))}
                </select>
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
