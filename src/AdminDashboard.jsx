// frontend/src/components/AdminDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Users,
  MessageSquare,
  FileText,
  TrendingUp,
  LogOut,
  Home,
  UserCheck,
  Star,
  Edit,
  Trash2,
  Reply,
  X,
  Plus,
  Phone,
  Activity,
  Heart,
  Zap,
  Shield,
  Settings,
} from "lucide-react";
import Lottie from "lottie-react";
import meditationAnim from "./assets/lottie/meditation.json";

// API base (uses env if present, else localhost)
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE) ||
  process.env?.REACT_APP_API_BASE ||
  "https://swasthya2-0.onrender.com";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Feedback & analytics state
  const [feedbacks, setFeedbacks] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);

  // Users state (fetched from backend)
  const [users, setUsers] = useState([]);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersQuery, setUsersQuery] = useState("");

  // Doctors state (fetched from backend)
  const [doctors, setDoctors] = useState([]);
  const [doctorsPage, setDoctorsPage] = useState(1);
  const [doctorsTotalPages, setDoctorsTotalPages] = useState(1);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [doctorsQuery, setDoctorsQuery] = useState("");

  // Debounce refs
  const usersDebounceRef = useRef(null);
  const doctorsDebounceRef = useRef(null);

  // Other UI/local state
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [heroText, setHeroText] = useState(localStorage.getItem("heroText") || "Welcome to Swasthya - Your Ayurvedic Wellness Companion");
  const [heroSubtext, setHeroSubtext] = useState(localStorage.getItem("heroSubtext") || "Discover your dosha, get personalized remedies, and embrace holistic healing.");
  const [doshaData, setDoshaData] = useState(JSON.parse(localStorage.getItem("doshaData") || JSON.stringify({
    Vata: "Vata is characterized by qualities of dry, light, cold, rough, subtle, mobile, and clear.",
    Pitta: "Pitta embodies qualities of hot, sharp, light, liquid, oily, and spreading.",
    Kapha: "Kapha is marked by qualities of heavy, slow, cool, oily, smooth, dense, soft, static, and cloudy."
  })));

  // Plants state (backed by DB)
  const [plants, setPlants] = useState([]);
  const [plantsLoading, setPlantsLoading] = useState(false);
  const [plantFormOpen, setPlantFormOpen] = useState(false);
  const [plantFormMode, setPlantFormMode] = useState("create");
  const [formSlug, setFormSlug] = useState("");
  const [formDisplayName, setFormDisplayName] = useState("");
  const [formModelPath, setFormModelPath] = useState("");
  const [formPartsJson, setFormPartsJson] = useState("{}");
  const [selectedPlantSlug, setSelectedPlantSlug] = useState(null);

  const [showHeroModal, setShowHeroModal] = useState(false);
  const [showDoshaModal, setShowDoshaModal] = useState(false);
  const [showPlantsModal, setShowPlantsModal] = useState(false);
  const [contactMessages, setContactMessages] = useState([]);
  const [contactLoading, setContactLoading] = useState(false);
  const [themeSettings, setThemeSettings] = useState(JSON.parse(localStorage.getItem("themeSettings") || JSON.stringify({
    primaryColor: "#10B981",
    secondaryColor: "#3B82F6",
    accentColor: "#8B5CF6",
    backgroundGradient: "from-green-50 via-blue-50 to-purple-50",
    fontFamily: "Inter, sans-serif",
    borderRadius: "rounded-xl",
    shadowStyle: "shadow-lg"
  })));
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [aboutContent, setAboutContent] = useState(localStorage.getItem("aboutContent") || "Swasthya is your comprehensive Ayurvedic wellness companion, designed to help you discover your unique dosha and achieve holistic healing through personalized remedies and ancient wisdom.");
  const [servicesContent, setServicesContent] = useState(JSON.parse(localStorage.getItem("servicesContent") || JSON.stringify([
    { title: "Dosha Analysis", description: "Discover your unique dosha type through our comprehensive quiz" },
    { title: "Personalized Remedies", description: "Get tailored Ayurvedic remedies based on your dosha" },
    { title: "Plant Database", description: "Explore medicinal plants and their healing properties" }
  ])));
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [newServiceTitle, setNewServiceTitle] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [contactFilter, setContactFilter] = useState("all");

  // Admin token retrieval
  const adminToken = localStorage.getItem("adminToken");

  // Helper to construct headers for protected calls
  const authHeaders = adminToken
    ? { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` }
    : { "Content-Type": "application/json" };

  // Fetch functions
  useEffect(() => {
    if (!adminToken) {
      navigate("/admin-login");
      return;
    }

    fetchFeedback();
    fetchAverageRating();
    fetchUsers(usersPage, usersQuery);
    fetchDoctors(doctorsPage, doctorsQuery);
    fetchPlants();
    fetchContactMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search for users
  useEffect(() => {
    if (usersDebounceRef.current) {
      clearTimeout(usersDebounceRef.current);
    }
    usersDebounceRef.current = setTimeout(() => {
      fetchUsers(1, usersQuery);
    }, 500);
    return () => {
      if (usersDebounceRef.current) {
        clearTimeout(usersDebounceRef.current);
      }
    };
  }, [usersQuery]);

  // Debounced search for doctors
  useEffect(() => {
    if (doctorsDebounceRef.current) {
      clearTimeout(doctorsDebounceRef.current);
    }
    doctorsDebounceRef.current = setTimeout(() => {
      fetchDoctors(1, doctorsQuery);
    }, 500);
    return () => {
      if (doctorsDebounceRef.current) {
        clearTimeout(doctorsDebounceRef.current);
      }
    };
  }, [doctorsQuery]);

  const fetchFeedback = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/feedback`, { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setFeedbacks(data.map(f => ({
          id: f._id,
          name: f.name,
          message: f.message,
          rating: f.rating,
          date: new Date(f.createdAt).toLocaleDateString()
        })));
      }
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/feedback/average`, { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setAverageRating(data.averageRating || 0);
        setTotalFeedbacks(data.totalFeedbacks || 0);
      }
    } catch (error) {
      console.error("Failed to fetch average rating:", error);
    }
  };

  const fetchUsers = async (page = 1, q = "") => {
    try {
      setUsersLoading(true);
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "50");
      if (q) params.set("q", q);

      const res = await fetch(`${API_BASE}/api/admin/users?${params.toString()}`, {
        method: "GET",
        headers: authHeaders
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          alert("Session expired or unauthorized. Please login again.");
          localStorage.removeItem("adminToken");
          navigate("/admin-login");
          return;
        }
        console.error("Failed to fetch users:", res.status);
        return;
      }

      const data = await res.json();
      setUsers(data.users.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        dosha: u.doshaType || "Unknown",
        isBanned: !!u.isBanned,
        isAdmin: !!u.isAdmin,
        createdAt: new Date(u.createdAt).toLocaleString()
      })));
      setUsersPage(data.page || 1);
      setUsersTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("fetchUsers error:", err);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchDoctors = async (page = 1, q = "") => {
    try {
      setDoctorsLoading(true);
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "50");
      if (q) params.set("q", q);

      const res = await fetch(`${API_BASE}/api/admin/doctors?${params.toString()}`, {
        method: "GET",
        headers: authHeaders
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          alert("Session expired or unauthorized. Please login again.");
          localStorage.removeItem("adminToken");
          navigate("/admin-login");
          return;
        }
        console.error("Failed to fetch doctors:", res.status);
        return;
      }

      const data = await res.json();
      setDoctors(data.doctors.map(d => ({
        id: d._id,
        name: d.name,
        email: d.email,
        isBanned: !!d.isBanned,
        createdAt: new Date(d.createdAt).toLocaleString()
      })));
      setDoctorsPage(data.page || 1);
      setDoctorsTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("fetchDoctors error:", err);
    } finally {
      setDoctorsLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This action is permanent.")) return;

    const prev = [...users];
    setUsers(prev.filter(u => u.id !== id));

    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
        method: "DELETE",
        headers: authHeaders
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("delete failed:", err);
        setUsers(prev);
        alert(err.message || "Failed to delete user");
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("adminToken");
          navigate("/admin-login");
        }
        return;
      }
    } catch (err) {
      console.error("handleDeleteUser error:", err);
      setUsers(prev);
      alert("Network error while deleting user");
    }
  };

  const handleToggleBan = async (id) => {
    const target = users.find(u => u.id === id);
    if (!target) return;

    const confirmMsg = target.isBanned ? "Unban this user?" : "Ban this user?";
    if (!window.confirm(confirmMsg)) return;

    const prev = [...users];
    setUsers(prev.map(u => (u.id === id ? { ...u, isBanned: !u.isBanned } : u)));

    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${id}/ban`, {
        method: "PATCH",
        headers: authHeaders
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("toggle ban failed:", err);
        setUsers(prev);
        alert(err.message || "Failed to update ban status");
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("adminToken");
          navigate("/admin-login");
        }
        return;
      }

      const resp = await res.json();
      setUsers(prev.map(u => (u.id === id ? { ...u, isBanned: !!resp.isBanned } : u)));
    } catch (err) {
      console.error("handleToggleBan error:", err);
      setUsers(prev);
      alert("Network error while updating ban status");
    }
  };



  const handleToggleBanDoctor = async (id) => {
    const target = doctors.find(d => d.id === id);
    if (!target) return;

    const confirmMsg = target.isBanned ? "Unban this doctor?" : "Ban this doctor?";
    if (!window.confirm(confirmMsg)) return;

    const prev = [...doctors];
    setDoctors(prev.map(d => (d.id === id ? { ...d, isBanned: !d.isBanned } : d)));

    try {
      const res = await fetch(`${API_BASE}/api/admin/doctors/${id}/ban`, {
        method: "PATCH",
        headers: authHeaders
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("toggle ban doctor failed:", err);
        setDoctors(prev);
        alert(err.message || "Failed to update ban status");
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("adminToken");
          navigate("/admin-login");
        }
        return;
      }

      const resp = await res.json();
      setDoctors(prev.map(d => (d.id === id ? { ...d, isBanned: !!resp.isBanned } : d)));
    } catch (err) {
      console.error("handleToggleBanDoctor error:", err);
      setDoctors(prev);
      alert("Network error while updating ban status");
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor? This action is permanent.")) return;

    const prev = [...doctors];
    setDoctors(prev.filter(d => d.id !== id));

    try {
      const res = await fetch(`${API_BASE}/api/admin/doctors/${id}`, {
        method: "DELETE",
        headers: authHeaders
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("delete doctor failed:", err);
        setDoctors(prev);
        alert(err.message || "Failed to delete doctor");
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("adminToken");
          navigate("/admin-login");
        }
        return;
      }
    } catch (err) {
      console.error("handleDeleteDoctor error:", err);
      setDoctors(prev);
      alert("Network error while deleting doctor");
    }
  };

  const handleDoctorSearch = async (e) => {
    e.preventDefault();
    await fetchDoctors(1, doctorsQuery);
  };

  const handleResolveContactMessage = async (id) => {
    if (!window.confirm("Are you sure you want to mark this contact message as resolved?")) return;

    const prev = [...contactMessages];
    setContactMessages(prev.map(q => (q.id === id ? { ...q, status: "resolved" } : q)));

    try {
      const res = await fetch(`${API_BASE}/api/admin/contact-messages/${id}/resolve`, {
        method: "PATCH",
        headers: authHeaders
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("resolve contact message failed:", err);
        setContactMessages(prev);
        alert(err.message || "Failed to resolve contact message");
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("adminToken");
          navigate("/admin-login");
        }
        return;
      }
    } catch (err) {
      console.error("handleResolveContactMessage error:", err);
      setContactMessages(prev);
      alert("Network error while resolving contact message");
    }
  };

  const handleDeleteContactMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact message? This action is permanent.")) return;

    const prev = [...contactMessages];
    setContactMessages(prev.filter(q => q.id !== id));

    try {
      const res = await fetch(`${API_BASE}/api/admin/contact-messages/${id}`, {
        method: "DELETE",
        headers: authHeaders
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("delete contact message failed:", err);
        setContactMessages(prev);
        alert(err.message || "Failed to delete contact message");
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("adminToken");
          navigate("/admin-login");
        }
        return;
      }
    } catch (err) {
      console.error("handleDeleteContactMessage error:", err);
      setContactMessages(prev);
      alert("Network error while deleting contact message");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/home");
  };

  const handleSaveHero = () => {
    localStorage.setItem("heroText", heroText);
    localStorage.setItem("heroSubtext", heroSubtext);
    setShowHeroModal(false);
  };

  const handleDoshaChange = (dosha, value) => {
    setDoshaData(prev => ({ ...prev, [dosha]: value }));
  };

  const handleSaveDosha = () => {
    localStorage.setItem("doshaData", JSON.stringify(doshaData));
    setShowDoshaModal(false);
  };

  const fetchPlants = async () => {
    try {
      setPlantsLoading(true);
      const res = await fetch(`${API_BASE}/api/plants`, { method: "GET", headers: authHeaders });
      if (!res.ok) {
        console.error("Failed to fetch plants:", res.status);
        return;
      }
      const data = await res.json();
      const list = data.plants || data;
      setPlants(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("fetchPlants error:", err);
    } finally {
      setPlantsLoading(false);
    }
  };

  const fetchContactMessages = async () => {
    try {
      setContactLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/contact-messages`, {
        method: "GET",
        headers: authHeaders
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          alert("Session expired or unauthorized. Please login again.");
          localStorage.removeItem("adminToken");
          navigate("/admin-login");
          return;
        }
        console.error("Failed to fetch contact messages:", res.status);
        return;
      }

      const data = await res.json();
      setContactMessages((Array.isArray(data) ? data : []).map(m => ({
        id: m._id,
        name: `${m.firstName} ${m.lastName}`,
        email: m.email,
        message: m.message,
        date: new Date(m.createdAt).toLocaleDateString(),
        status: m.status || "new"
      })));
    } catch (err) {
      console.error("fetchContactMessages error:", err);
    } finally {
      setContactLoading(false);
    }
  };

  const handleCreatePlant = async () => {
    if (!formSlug.trim() || !formDisplayName.trim()) {
      alert("Please provide slug and display name.");
      return;
    }

    let partsObj = {};
    try {
      partsObj = JSON.parse(formPartsJson || "{}");
      if (typeof partsObj !== "object" || Array.isArray(partsObj)) throw new Error("Parts must be a JSON object");
    } catch (err) {
      alert("Invalid parts JSON: " + err.message);
      return;
    }

    const payload = {
      slug: formSlug.trim(),
      displayName: formDisplayName.trim(),
      modelPath: formModelPath.trim() || "",
      parts: partsObj,
      tags: []
    };

    try {
      const res = await fetch(`${API_BASE}/api/plants`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to create plant");
        return;
      }
      const created = data.plant || data;
      setPlants(prev => [created, ...prev]);
      setPlantFormOpen(false);
      setFormSlug(""); setFormDisplayName(""); setFormModelPath(""); setFormPartsJson("{}");
    } catch (err) {
      console.error("createPlant error:", err);
      alert("Network error creating plant");
    }
  };

  const handleUpdatePlant = async (originalSlug) => {
    if (!originalSlug) return;
    let partsObj;
    try {
      partsObj = JSON.parse(formPartsJson || "{}");
      if (typeof partsObj !== "object" || Array.isArray(partsObj)) throw new Error("Parts must be a JSON object");
    } catch (err) {
      alert("Invalid parts JSON: " + err.message);
      return;
    }

    const payload = {
      slug: formSlug.trim(),
      displayName: formDisplayName.trim(),
      modelPath: formModelPath.trim(),
      parts: partsObj
    };

    try {
      const res = await fetch(`${API_BASE}/api/plants/${encodeURIComponent(originalSlug)}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to update plant");
        return;
      }
      const updated = data.plant || payload;
      setPlants(prev => prev.map(p => (p.slug === originalSlug ? updated : p)));
      setPlantFormOpen(false);
      setFormSlug(""); setFormDisplayName(""); setFormModelPath(""); setFormPartsJson("{}");
    } catch (err) {
      console.error("updatePlant error:", err);
      alert("Network error updating plant");
    }
  };

  const handleDeletePlantBySlug = async (slug) => {
    if (!window.confirm(`Delete plant '${slug}'? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/plants/${encodeURIComponent(slug)}`, {
        method: "DELETE",
        headers: authHeaders
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to delete plant");
        return;
      }
      setPlants(prev => prev.filter(p => p.slug !== slug));
      if (selectedPlantSlug === slug) setSelectedPlantSlug(null);
    } catch (err) {
      console.error("deletePlant error:", err);
      alert("Network error deleting plant");
    }
  };

  const handleSaveTheme = () => {
    localStorage.setItem("themeSettings", JSON.stringify(themeSettings));
    setShowThemeModal(false);
  };

  const handleSaveAbout = () => {
    localStorage.setItem("aboutContent", aboutContent);
    setShowAboutModal(false);
  };

  const handleSaveServices = () => {
    localStorage.setItem("servicesContent", JSON.stringify(servicesContent));
    setShowServicesModal(false);
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

  const tabs = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "users", label: "Users", icon: Users },
    { id: "doctors", label: "Doctors", icon: UserCheck },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
    { id: "contact", label: "Contact Us", icon: Phone },
    { id: "content", label: "Content Management", icon: FileText },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-xl border-b border-green-100 backdrop-blur-sm bg-white/90">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-lg opacity-30"></div>
                <div className="relative bg-gradient-to-r from-green-500 to-blue-600 p-3 rounded-full">
                  <BarChart3 className="text-white" size={28} />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Swasthya Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Activity className="text-green-500" size={16} />
                <span>System Online</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition duration-200 shadow-md hover:shadow-lg"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Modal */}
      {showHeroModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Edit Hero Section</h3>
              <button
                onClick={() => setShowHeroModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
                <input
                  type="text"
                  value={heroText}
                  onChange={(e) => setHeroText(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter hero title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
                <textarea
                  value={heroSubtext}
                  onChange={(e) => setHeroSubtext(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter hero subtitle"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowHeroModal(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveHero}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dosha Modal */}
      {showDoshaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Edit Dosha Information</h3>
              <button
                onClick={() => setShowDoshaModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-6">
              {Object.keys(doshaData).map((dosha) => (
                <div key={dosha}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{dosha}</label>
                  <textarea
                    value={doshaData[dosha]}
                    onChange={(e) => handleDoshaChange(dosha, e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              ))}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDoshaModal(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDosha}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plants Modal */}
      {showPlantsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-6xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Manage Plant Database</h3>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
                  onClick={() => {
                    setPlantFormMode("create");
                    setFormSlug(""); setFormDisplayName(""); setFormModelPath(""); setFormPartsJson("{}");
                    setPlantFormOpen(true);
                  }}
                >
                  <Plus size={16} /> Add Plant
                </button>
                <button onClick={() => setShowPlantsModal(false)} className="text-gray-600">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left: plant list */}
              <div className="col-span-1">
                <h4 className="font-semibold mb-2">Plants ({plants.length})</h4>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                  {plantsLoading ? (
                    <div>Loading plants...</div>
                  ) : plants.length === 0 ? (
                    <div className="text-sm text-gray-500">No plants found</div>
                  ) : (
                    plants.map((p) => (
                      <div key={p.slug} className="p-3 border rounded-lg hover:shadow cursor-pointer flex justify-between items-center"
                           onClick={() => setSelectedPlantSlug(p.slug)}>
                        <div>
                          <div className="font-semibold">{p.displayName || p.slug}</div>
                          <div className="text-xs text-gray-500">{p.slug}</div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={(e) => { e.stopPropagation();
                              setPlantFormMode("edit");
                              setFormSlug(p.slug);
                              setFormDisplayName(p.displayName || "");
                              setFormModelPath(p.modelPath || "");
                              setFormPartsJson(JSON.stringify(p.parts || {}, null, 2));
                              setPlantFormOpen(true);
                            }} className="px-2 py-1 bg-blue-600 text-white rounded">Edit</button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeletePlantBySlug(p.slug); }} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Middle & Right: selected plant details */}
              <div className="col-span-2">
                {selectedPlantSlug ? (
                  (() => {
                    const plant = plants.find(x => x.slug === selectedPlantSlug);
                    if (!plant) return <div>Plant not found</div>;
                    return (
                      <div className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold">{plant.displayName || plant.slug}</h3>
                            <div className="text-sm text-gray-600 mb-2">{plant.modelPath}</div>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => {
                              setPlantFormMode("edit");
                              setFormSlug(plant.slug);
                              setFormDisplayName(plant.displayName || "");
                              setFormModelPath(plant.modelPath || "");
                              setFormPartsJson(JSON.stringify(plant.parts || {}, null, 2));
                              setPlantFormOpen(true);
                            }}>Edit</button>
                            <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => handleDeletePlantBySlug(plant.slug)}>Delete</button>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Parts</h4>
                          {plant.parts && Object.keys(plant.parts).length > 0 ? (
                            Object.entries(plant.parts).map(([partName, partObj]) => (
                              <div key={partName} className="mb-3 p-3 border rounded bg-white">
                                <div className="font-semibold">{partName} ({partObj.partUsed || ""})</div>
                                <div className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                                  <strong>Common name:</strong> {partObj.commonName || "-"}<br/>
                                  <strong>Sanskrit:</strong> {partObj.sanskritName || "-"}<br/>
                                  <strong>Scientific:</strong> <em>{partObj.scientificName || "-"}</em><br/>
                                  <strong>Family:</strong> {partObj.family || "-"}<br/>
                                  <strong>Active Constituents:</strong> {partObj.activeConstituents || "-"}<br/>
                                  <strong>Dosha Effect:</strong> {partObj.doshaEffect || "-"}<br/>
                                  <strong>Benefits:</strong> {partObj.benefits || "-"}<br/>
                                  <strong>Traditional Uses:</strong> {partObj.traditionalUses || "-"}<br/>
                                  <strong>Pharmacological Actions:</strong> {partObj.pharmacologicalActions || "-"}<br/>
                                  <strong>Modern Research:</strong> {partObj.modernResearch || "-"}<br/>
                                  <strong>Formulations:</strong> {partObj.formulations || "-"}<br/>
                                  <strong>Cautions:</strong> {partObj.cautions || "-"}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-500">No parts defined for this plant.</div>
                          )}
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-gray-500">Select a plant on the left to view details.</div>
                )}
              </div>
            </div>

            {/* Create / Edit Form Drawer */}
            {plantFormOpen && (
              <div className="fixed right-4 top-20 w-[480px] bg-white border p-4 rounded-lg shadow-lg z-60 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold">{plantFormMode === "create" ? "Add New Plant" : `Edit ${formSlug}`}</h4>
                  <button onClick={() => setPlantFormOpen(false)} className="text-gray-600"><X size={18} /></button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Slug (unique)</label>
                    <input value={formSlug} onChange={(e) => setFormSlug(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="neem" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Display Name</label>
                    <input value={formDisplayName} onChange={(e) => setFormDisplayName(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="Neem" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Model Path (optional)</label>
                    <input value={formModelPath} onChange={(e) => setFormModelPath(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="/models/plants/neem-compressed.glb" />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Parts JSON</label>
                    <textarea value={formPartsJson} onChange={(e) => setFormPartsJson(e.target.value)} rows={10} className="w-full px-3 py-2 border rounded font-mono text-sm" />
                    <p className="text-xs text-gray-500 mt-1">Paste the parts object JSON</p>
                  </div>

                  <div className="flex justify-end gap-2 mt-2">
                    <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={() => setPlantFormOpen(false)}>Cancel</button>
                    {plantFormMode === "create" ? (
                      <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleCreatePlant}>Create</button>
                    ) : (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => handleUpdatePlant(formSlug)}>Save</button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Theme Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Theme Settings</h3>
              <button
                onClick={() => setShowThemeModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                <input
                  type="color"
                  value={themeSettings.primaryColor}
                  onChange={(e) => setThemeSettings({...themeSettings, primaryColor: e.target.value})}
                  className="w-full h-10 rounded border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                <input
                  type="color"
                  value={themeSettings.secondaryColor}
                  onChange={(e) => setThemeSettings({...themeSettings, secondaryColor: e.target.value})}
                  className="w-full h-10 rounded border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                <input
                  type="color"
                  value={themeSettings.accentColor}
                  onChange={(e) => setThemeSettings({...themeSettings, accentColor: e.target.value})}
                  className="w-full h-10 rounded border border-gray-300"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowThemeModal(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTheme}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Edit About Content</h3>
              <button
                onClick={() => setShowAboutModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <textarea
                value={aboutContent}
                onChange={(e) => setAboutContent(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter about content"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowAboutModal(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAbout}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Modal */}
      {showServicesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Manage Services</h3>
              <button
                onClick={() => setShowServicesModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-6">
              {/* Add New Service */}
              <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Plus className="text-green-600" size={20} />
                  Add New Service
                </h4>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newServiceTitle}
                    onChange={(e) => setNewServiceTitle(e.target.value)}
                    placeholder="Service title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={newServiceDescription}
                    onChange={(e) => setNewServiceDescription(e.target.value)}
                    placeholder="Service description"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddService}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Service
                  </button>
                </div>
              </div>

              {/* Existing Services */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Existing Services</h4>
                {servicesContent.map((service, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                    {editingService && editingService.title === service.title ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={newServiceTitle}
                          onChange={(e) => setNewServiceTitle(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          value={newServiceDescription}
                          onChange={(e) => setNewServiceDescription(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                          <h5 className="font-semibold text-lg text-gray-900">{service.title}</h5>
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
                  onClick={() => setShowServicesModal(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveServices}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full mx-auto mt-3 ms-3">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 bg-white shadow-xl rounded-2xl p-6 border border-green-100">
            <nav className="space-y-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200 ${
                      activeTab === tab.id
                        ? "bg-green-100 text-green-700 shadow-md"
                        : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                    }`}
                  >
                    <Icon size={20} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white shadow-xl rounded-2xl p-8 border border-green-100 me-4">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                  <Home className="text-green-600" size={24} />
                  Dashboard Overview
                </h2>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-8 border border-green-100">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Swasthya Admin</h3>
                      <p className="text-gray-600 mb-4">Manage your Ayurvedic wellness platform with ease</p>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-green-600">
                          <Heart className="animate-pulse" size={20} />
                          <span className="font-semibold">Healthy Platform</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600">
                          <Zap className="animate-pulse" size={20} />
                          <span className="font-semibold">Real-time Updates</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-32 h-32">
                      <Lottie animationData={meditationAnim} loop={true} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition duration-300">
                    <Users className="mb-2" size={32} />
                    <h3 className="font-semibold text-lg">Total Users</h3>
                    <p className="text-3xl font-bold">{users.length}</p>
                    <div className="mt-2 flex items-center gap-1 text-green-100">
                      <TrendingUp size={16} />
                      <span className="text-sm">+12% this month</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition duration-300">
                    <MessageSquare className="mb-2" size={32} />
                    <h3 className="font-semibold text-lg">Total Feedback</h3>
                    <p className="text-3xl font-bold">{totalFeedbacks}</p>
                    <div className="mt-2 flex items-center gap-1 text-blue-100">
                      <TrendingUp size={16} />
                      <span className="text-sm">+8% this month</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition duration-300">
                    <Star className="mb-2" size={32} />
                    <h3 className="font-semibold text-lg">Average Rating</h3>
                    <p className="text-3xl font-bold">{(averageRating || 0).toFixed(1)}</p>
                    <div className="mt-2 flex items-center gap-1 text-yellow-100">
                      <Star size={16} className="fill-current" />
                      <span className="text-sm">Out of 5</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition duration-300">
                    <Phone className="mb-2" size={32} />
                    <h3 className="font-semibold text-lg">Contact Queries</h3>
                    <p className="text-3xl font-bold">{contactMessages.length}</p>
                    <div className="mt-2 flex items-center gap-1 text-orange-100">
                      <TrendingUp size={16} />
                      <span className="text-sm">+15% this month</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition duration-300">
                    <UserCheck className="mb-2" size={32} />
                    <h3 className="font-semibold text-lg">Total Doctors</h3>
                    <p className="text-3xl font-bold">{doctors.length}</p>
                    <div className="mt-2 flex items-center gap-1 text-purple-100">
                      <TrendingUp size={16} />
                      <span className="text-sm">+10% this month</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Users className="text-green-600" size={24} />
                      </div>
                      <h4 className="font-semibold text-lg">User Management</h4>
                    </div>
                    <p className="text-gray-600 mb-4">Manage user accounts, view profiles, and handle permissions</p>
                    <button
                      onClick={() => setActiveTab("users")}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Manage Users
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MessageSquare className="text-blue-600" size={24} />
                      </div>
                      <h4 className="font-semibold text-lg">Feedback Center</h4>
                    </div>
                    <p className="text-gray-600 mb-4">Review user feedback and respond to inquiries</p>
                    <button
                      onClick={() => setActiveTab("feedback")}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      View Feedback
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <BarChart3 className="text-purple-600" size={24} />
                      </div>
                      <h4 className="font-semibold text-lg">Analytics</h4>
                    </div>
                    <p className="text-gray-600 mb-4">View detailed analytics and performance metrics</p>
                    <button
                      onClick={() => setActiveTab("analytics")}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      View Analytics
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CONTENT TAB */}
            {activeTab === "content" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                  <FileText className="text-green-600" size={24} />
                  Content Management
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-200 bg-gray-50">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Home className="text-green-600" size={20} />
                      Homepage Content
                    </h3>
                    <button
                      onClick={() => setShowHeroModal(true)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Edit Hero Section
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-200 bg-gray-50">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <UserCheck className="text-green-600" size={20} />
                      Dosha Information
                    </h3>
                    <button
                      onClick={() => setShowDoshaModal(true)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Update Dosha Data
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-200 bg-gray-50">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <TrendingUp className="text-green-600" size={20} />
                      Plant Database
                    </h3>
                    <button
                      onClick={() => setShowPlantsModal(true)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Manage Plants
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-200 bg-gray-50">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Settings className="text-green-600" size={20} />
                      Theme Settings
                    </h3>
                    <button
                      onClick={() => setShowThemeModal(true)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Customize Theme
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-200 bg-gray-50">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <FileText className="text-green-600" size={20} />
                      About Content
                    </h3>
                    <button
                      onClick={() => setShowAboutModal(true)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Edit About Section
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-200 bg-gray-50">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Shield className="text-green-600" size={20} />
                      Services Content
                    </h3>
                    <button
                      onClick={() => setShowServicesModal(true)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Manage Services
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === "analytics" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                  <BarChart3 className="text-green-600" size={24} />
                  Analytics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-200 bg-gray-50">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <BarChart3 className="text-green-600" size={20} />
                      Page Views
                    </h3>
                    <p className="text-3xl font-bold text-green-600">1,234</p>
                    <p className="text-sm text-gray-600">+12% from last month</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-200 bg-gray-50">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <Users className="text-green-600" size={20} />
                      User Registrations
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">89</p>
                    <p className="text-sm text-gray-600">+5% from last month</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-200 bg-gray-50">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <UserCheck className="text-green-600" size={20} />
                      Dosha Quizzes Taken
                    </h3>
                    <p className="text-3xl font-bold text-purple-600">156</p>
                    <p className="text-sm text-gray-600">+8% from last month</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-200 bg-gray-50">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <MessageSquare className="text-green-600" size={20} />
                      Feedback Submissions
                    </h3>
                    <p className="text-3xl font-bold text-orange-600">23</p>
                    <p className="text-sm text-gray-600">+15% from last month</p>
                  </div>
                </div>
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === "users" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                  <Users className="text-green-600" size={24} />
                  User Management
                </h2>
              
                <div className="flex items-center justify-between mb-4 gap-4">
                  <form  className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={usersQuery}
                      onChange={(e) => setUsersQuery(e.target.value)}
                      placeholder="Search users by name or email"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </form>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const next = Math.max(1, usersPage - 1);
                        setUsersPage(next);
                        fetchUsers(next, usersQuery);
                      }}
                      className="px-3 py-2 bg-gray-100 rounded"
                    >
                      Prev
                    </button>
                    <span className="text-sm text-gray-600">Page {usersPage} / {usersTotalPages}</span>
                    <button
                      onClick={() => {
                        const next = Math.min(usersTotalPages, usersPage + 1);
                        setUsersPage(next);
                        fetchUsers(next, usersQuery);
                      }}
                      className="px-3 py-2 bg-gray-100 rounded"
                    >
                      Next
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto bg-gray-50 rounded-xl overflow-hidden shadow-md">
                    <thead className="bg-green-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left">Name</th>
                        <th className="px-6 py-4 text-left">Email</th>
                        <th className="px-6 py-4 text-left">Dosha</th>
                        <th className="px-6 py-4 text-left">Status</th>
                        <th className="px-6 py-4 text-center">Ban/Unban</th>
                        <th className="px-6 py-4 text-center">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersLoading ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-8 text-center">Loading users...</td>
                        </tr>
                      ) : users.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-8 text-center">No users found</td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-gray-100 transition duration-200">
                            <td className="px-6 py-4">{user.name}</td>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4">{user.dosha}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                user.isBanned ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                              }`}>
                                {user.isBanned ? "Banned" : "Active"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleToggleBan(user.id)}
                                className={`px-3 py-1 rounded ${user.isBanned ? "bg-yellow-500 text-white hover:bg-yellow-600" : "bg-red-600 text-white hover:bg-red-700"}`}
                              >
                                {user.isBanned ? "Unban" : "Ban"}
                              </button>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* DOCTORS TAB */}
            {activeTab === "doctors" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                  <UserCheck className="text-green-600" size={24} />
                  Doctor Management
                </h2>

                <div className="flex items-center justify-between mb-4 gap-4">
                  <form onSubmit={handleDoctorSearch} className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={doctorsQuery}
                      onChange={(e) => setDoctorsQuery(e.target.value)}
                      placeholder="Search doctors by name or email"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </form>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const next = Math.max(1, doctorsPage - 1);
                        setDoctorsPage(next);
                        fetchDoctors(next, doctorsQuery);
                      }}
                      className="px-3 py-2 bg-gray-100 rounded"
                    >
                      Prev
                    </button>
                    <span className="text-sm text-gray-600">Page {doctorsPage} / {doctorsTotalPages}</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto bg-gray-50 rounded-xl overflow-hidden shadow-md">
                    <thead className="bg-green-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left">Name</th>
                        <th className="px-6 py-4 text-left">Email</th>
                        <th className="px-6 py-4 text-left">Status</th>
                        <th className="px-6 py-4 text-center">Ban/Unban</th>
                        <th className="px-6 py-4 text-center">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctorsLoading ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center">Loading doctors...</td>
                        </tr>
                      ) : doctors.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center">No doctors found</td>
                        </tr>
                      ) : (
                        doctors.map((doctor) => (
                          <tr key={doctor.id} className="border-b hover:bg-gray-100 transition duration-200">
                            <td className="px-6 py-4">{doctor.name}</td>
                            <td className="px-6 py-4">{doctor.email}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                doctor.isBanned ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                              }`}>
                                {doctor.isBanned ? "Banned" : "Active"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleToggleBanDoctor(doctor.id)}
                                className={`px-3 py-1 rounded ${doctor.isBanned ? "bg-yellow-500 text-white hover:bg-yellow-600" : "bg-red-600 text-white hover:bg-red-700"}`}
                              >
                                {doctor.isBanned ? "Unban" : "Ban"}
                              </button>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleDeleteDoctor(doctor.id)}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FEEDBACK TAB */}
            {activeTab === "feedback" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                  <MessageSquare className="text-green-600" size={24} />
                  Feedback Management
                </h2>

                <div className="mb-6 flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Filter by Rating:</label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {feedbacks.filter(feedback => ratingFilter === "all" || feedback.rating === parseInt(ratingFilter)).map((feedback) => (
                    <div key={feedback.id} className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-200 bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{feedback.name}</h3>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400 font-semibold">{feedback.rating}</span>
                              <Star size={16} className="text-yellow-400 fill-current" />
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2">{feedback.message}</p>
                          <p className="text-sm text-gray-500">{feedback.date}</p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => setEditingFeedback(feedback)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-1"
                          >
                            <Reply size={14} />
                            Reply
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm("Are you sure you want to delete this feedback?")) {
                                try {
                                  const res = await fetch(`${API_BASE}/api/feedback/${feedback.id}`, {
                                    method: "DELETE",
                                  });
                                  if (res.ok) {
                                    setFeedbacks(feedbacks.filter(f => f.id !== feedback.id));
                                    const avgRes = await fetch(`${API_BASE}/api/feedback/average`);
                                    if (avgRes.ok) {
                                      const avgData = await avgRes.json();
                                      setAverageRating(avgData.averageRating);
                                      setTotalFeedbacks(avgData.totalFeedbacks);
                                    }
                                  } else {
                                    alert("Failed to delete feedback");
                                  }
                                } catch (error) {
                                  console.error("Error deleting feedback:", error);
                                  alert("Error deleting feedback");
                                }
                              }
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-1"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONTACT TAB */}
            {activeTab === "contact" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                  <Phone className="text-green-600" size={24} />
                  Contact Us Queries
                </h2>

                <div className="mb-6 flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="contactFilter" value="all" checked={contactFilter === "all"} onChange={(e) => setContactFilter(e.target.value)} />
                      All
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="contactFilter" value="resolved" checked={contactFilter === "resolved"} onChange={(e) => setContactFilter(e.target.value)} />
                      Resolved
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="contactFilter" value="not resolved" checked={contactFilter === "not resolved"} onChange={(e) => setContactFilter(e.target.value)} />
                      Not Resolved
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  {contactMessages.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No contact queries yet.</p>
                  ) : (
                    contactMessages.filter(query => {
                      if (contactFilter === "all") return true;
                      if (contactFilter === "resolved") return query.status === "resolved";
                      return query.status !== "resolved";
                    }).map((query) => (
                      <div key={query.id} className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-200 bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{query.name}</h3>
                              <span className="text-sm text-gray-500">({query.email})</span>
                            </div>
                            <p className="text-gray-700 mb-2">{query.message}</p>
                            <p className="text-sm text-gray-500">{query.date}</p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            {query.status !== "resolved" && (
                              <button
                                onClick={() => handleResolveContactMessage(query.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
                              >
                                Resolve
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteContactMessage(query.id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-1"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
