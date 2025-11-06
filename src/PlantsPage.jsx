import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Plus, Edit, Trash2, TrendingUp } from "lucide-react";

export default function PlantsPage() {
  const navigate = useNavigate();
  const [plants, setPlants] = useState(JSON.parse(localStorage.getItem("plants")) || [
    { name: "Amla", description: "Rich in Vitamin C, boosts immunity." },
    { name: "Ashwagandha", description: "Adaptogen that reduces stress." },
    { name: "Brahmi", description: "Enhances memory and cognitive function." }
  ]);
  const [editingPlant, setEditingPlant] = useState(null);
  const [newPlantName, setNewPlantName] = useState("");
  const [newPlantDescription, setNewPlantDescription] = useState("");

  useEffect(() => {
    // Check if admin is logged in
    if (!localStorage.getItem("adminToken")) {
      navigate("/admin-login");
      return;
    }
  }, [navigate]);

  const handleSave = () => {
    localStorage.setItem("plants", JSON.stringify(plants));
    alert("Plant database updated successfully!");
  };

  const handleAddPlant = () => {
    if (newPlantName && newPlantDescription) {
      setPlants([...plants, { name: newPlantName, description: newPlantDescription }]);
      setNewPlantName("");
      setNewPlantDescription("");
    }
  };

  const handleEditPlant = (plant) => {
    setEditingPlant(plant);
    setNewPlantName(plant.name);
    setNewPlantDescription(plant.description);
  };

  const handleUpdatePlant = () => {
    if (editingPlant && newPlantName && newPlantDescription) {
      setPlants(plants.map(p => p.name === editingPlant.name ? { name: newPlantName, description: newPlantDescription } : p));
      setEditingPlant(null);
      setNewPlantName("");
      setNewPlantDescription("");
    }
  };

  const handleDeletePlant = (plantName) => {
    setPlants(plants.filter(p => p.name !== plantName));
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
                <h1 className="text-3xl font-bold text-gray-900">Plant Database Management</h1>
                <p className="text-sm text-gray-600">Manage medicinal plants and their descriptions</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-green-100">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="text-green-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Manage Plant Database</h2>
            </div>

            {/* Add New Plant */}
            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus className="text-green-600" size={20} />
                Add New Plant
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={newPlantName}
                  onChange={(e) => setNewPlantName(e.target.value)}
                  placeholder="Plant name"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="text"
                  value={newPlantDescription}
                  onChange={(e) => setNewPlantDescription(e.target.value)}
                  placeholder="Plant description"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleAddPlant}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <Plus size={16} />
                Add Plant
              </button>
            </div>

            {/* Existing Plants */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Existing Plants ({plants.length})</h3>
              {plants.map((plant, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                  {editingPlant && editingPlant.name === plant.name ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={newPlantName}
                        onChange={(e) => setNewPlantName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Plant name"
                      />
                      <input
                        type="text"
                        value={newPlantDescription}
                        onChange={(e) => setNewPlantDescription(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Plant description"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdatePlant}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => setEditingPlant(null)}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-gray-900">{plant.name}</h4>
                        <p className="text-gray-600 mt-1">{plant.description}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEditPlant(plant)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-1"
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePlant(plant.name)}
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
