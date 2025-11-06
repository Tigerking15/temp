import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Shield, Plus, Edit, Trash2 } from "lucide-react";

export default function ServicesPageAdmin() {
  const navigate = useNavigate();
  const [servicesContent, setServicesContent] = useState(JSON.parse(localStorage.getItem("servicesContent")) || [
    { title: "Dosha Analysis", description: "Discover your unique dosha type through our comprehensive quiz" },
    { title: "Personalized Remedies", description: "Get tailored Ayurvedic remedies based on your dosha" },
    { title: "Plant Database", description: "Explore medicinal plants and their healing properties" }
  ]);
  const [editingService, setEditingService] = useState(null);
  const [newServiceTitle, setNewServiceTitle] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");

  useEffect(() => {
    // Check if admin is logged in
    if (!localStorage.getItem("adminToken")) {
      navigate("/admin-login");
      return;
    }
  }, [navigate]);

  const handleSave = () => {
    localStorage.setItem("servicesContent", JSON.stringify(servicesContent));
    alert("Services content updated successfully!");
  };

  const handleAddService = () => {
    if (newServiceTitle && newServiceDescription) {
      setServicesContent([...servicesContent, { title: newServiceTitle, description: newServiceDescription }]);
      setNewServiceTitle("");
      setNewServiceDescription("");
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setNewServiceTitle(service.title);
    setNewServiceDescription(service.description);
  };

  const handleUpdateService = () => {
    if (editingService && newServiceTitle && newServiceDescription) {
      setServicesContent(servicesContent.map(s => s.title === editingService.title ? { title: newServiceTitle, description: newServiceDescription } : s));
      setEditingService(null);
      setNewServiceTitle("");
      setNewServiceDescription("");
    }
  };

  const handleDeleteService = (serviceTitle) => {
    setServicesContent(servicesContent.filter(s => s.title !== serviceTitle));
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
                <h1 className="text-3xl font-bold text-gray-900">Services Content Management</h1>
                <p className="text-sm text-gray-600">Manage services section content</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-green-100">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="text-green-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Manage Services Content</h2>
            </div>

            {/* Add New Service */}
            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus className="text-green-600" size={20} />
                Add New Service
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={newServiceTitle}
                  onChange={(e) => setNewServiceTitle(e.target.value)}
                  placeholder="Service title"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={newServiceDescription}
                  onChange={(e) => setNewServiceDescription(e.target.value)}
                  placeholder="Service description"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleAddService}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <Plus size={16} />
                Add Service
              </button>
            </div>

            {/* Existing Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Existing Services ({servicesContent.length})</h3>
              {servicesContent.map((service, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                  {editingService && editingService.title === service.title ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={newServiceTitle}
                        onChange={(e) => setNewServiceTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Service title"
                      />
                      <input
                        type="text"
                        value={newServiceDescription}
                        onChange={(e) => setNewServiceDescription(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Service description"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateService}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => setEditingService(null)}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-gray-900">{service.title}</h4>
                        <p className="text-gray-600 mt-1">{service.description}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEditService(service)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-1"
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.title)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4 mt-6">
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
  );
}
