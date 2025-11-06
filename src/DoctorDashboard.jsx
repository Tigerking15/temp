import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Users, Calendar, User, LogOut, Home, UserCheck, Edit, Save, X, Check, XCircle } from "lucide-react";
import { getMyDoctorProfile, updateDoctorProfile, getDoctorConsultations, updateConsultationStatus, getImageUrl } from "./api";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    experience: "",
    location: "",
    isRegistered: false
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...doctorProfile });

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      const res = await getMyDoctorProfile();
      if (res.success) {
        setDoctorProfile(res.doctor);
        setTempProfile(res.doctor);
      } else {
        // If not logged in, redirect to doctor login
        navigate("/doctor-login");
      }
    };

    const fetchConsultations = async () => {
      const res = await getDoctorConsultations();
      if (res.success) {
        setAppointments(res.consultations);
      } else {
        // Fallback to mock data if API fails
        setAppointments([
          { id: 1, userName: "John Doe", userEmail: "john@example.com", date: "2023-10-15", time: "10:00", status: "Confirmed" },
          { id: 2, userName: "Jane Smith", userEmail: "jane@example.com", date: "2023-10-16", time: "14:00", status: "Pending" },
          { id: 3, userName: "Bob Johnson", userEmail: "bob@example.com", date: "2023-10-17", time: "11:30", status: "Confirmed" },
        ]);
      }
    };

    fetchDoctorProfile();
    fetchConsultations();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctorProfile");
    navigate("/home");
  };

  const handleSaveProfile = async () => {
    const res = await updateDoctorProfile({
      name: tempProfile.name,
      email: tempProfile.email,
      specialization: tempProfile.specialization,
      experience: tempProfile.experience,
      location: tempProfile.location,
    });
    if (res.success) {
      const updatedProfile = { ...res.doctor, isRegistered: true };
      setDoctorProfile(updatedProfile);
      setTempProfile(updatedProfile);
      localStorage.setItem("doctorProfile", JSON.stringify(updatedProfile));
      setEditingProfile(false);
    } else {
      alert("Failed to update profile: " + res.message);
    }
  };

  const handleCancelEdit = () => {
    setTempProfile({ ...doctorProfile });
    setEditingProfile(false);
  };

  const handleAcceptAppointment = async (appointmentId) => {
    console.log("Accepting appointment:", appointmentId);
    const res = await updateConsultationStatus(appointmentId, "Confirmed");
    console.log("Accept response:", res);
    if (res.success) {
      setAppointments(appointments.map(app =>
        app._id === appointmentId ? { ...app, status: "Confirmed" } : app
      ));
      alert("Appointment confirmed successfully!");
    } else {
      alert("Failed to confirm appointment: " + (res.message || "Unknown error"));
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    console.log("Cancelling appointment:", appointmentId);
    const res = await updateConsultationStatus(appointmentId, "Cancelled");
    console.log("Cancel response:", res);
    if (res.success) {
      setAppointments(appointments.filter(app => app._id !== appointmentId));
      alert("Appointment cancelled successfully!");
    } else {
      alert("Failed to cancel appointment: " + (res.message || "Unknown error"));
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-green-100">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              {doctorProfile.avatar && (
                <img
                  src={getImageUrl(doctorProfile.avatar)}
                  alt="Doctor Avatar"
                  className="w-12 h-12 rounded-full border-2 border-green-500 shadow-md"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {doctorProfile.name || "Doctor Dashboard"}
                </h1>
                <p className="text-sm text-gray-600">{doctorProfile.specialization || "Specialization"}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 shadow-md"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

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
            {activeTab === "overview" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                  <Home className="text-green-600" size={24} />
                  Dashboard Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-xl shadow-lg text-white">
                    <Calendar className="mb-2" size={32} />
                    <h3 className="font-semibold text-lg">Total Appointments</h3>
                    <p className="text-3xl font-bold">{appointments.length}</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-6 rounded-xl shadow-lg text-white">
                    <UserCheck className="mb-2" size={32} />
                    <h3 className="font-semibold text-lg">Confirmed</h3>
                    <p className="text-3xl font-bold">{appointments.filter(a => a.status === "Confirmed").length}</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-6 rounded-xl shadow-lg text-white">
                    <Users className="mb-2" size={32} />
                    <h3 className="font-semibold text-lg">Pending</h3>
                    <p className="text-3xl font-bold">{appointments.filter(a => a.status === "Pending").length}</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-6 rounded-xl shadow-lg text-white">
                    <User className="mb-2" size={32} />
                    <h3 className="font-semibold text-lg">Profile Status</h3>
                    <p className="text-3xl font-bold">{doctorProfile.isRegistered ? "Registered" : "Incomplete"}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "appointments" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                  <Calendar className="text-green-600" size={24} />
                  Appointment Tracking
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto bg-gray-50 rounded-xl overflow-hidden shadow-md">
                    <thead className="bg-green-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left">User Name</th>
                        <th className="px-6 py-4 text-left">User Email</th>
                        <th className="px-6 py-4 text-left">Date</th>
                        <th className="px-6 py-4 text-left">Time</th>
                        <th className="px-6 py-4 text-left">Status</th>
                        <th className="px-6 py-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment) => (
                        <tr key={appointment._id} className="border-b hover:bg-gray-100 transition duration-200">
                          <td className="px-6 py-4">{appointment.userId?.name || "N/A"}</td>
                          <td className="px-6 py-4">{appointment.userId?.email || "N/A"}</td>
                          <td className="px-6 py-4">{appointment.date}</td>
                          <td className="px-6 py-4">{appointment.time}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              appointment.status === "Confirmed" ? "bg-green-100 text-green-800" :
                              appointment.status === "Cancelled" ? "bg-red-100 text-red-800" :
                              "bg-yellow-100 text-yellow-800"
                            }`}>
                              {appointment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {appointment.status === "Pending" && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleAcceptAppointment(appointment._id)}
                                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-1"
                                >
                                  <Check size={14} />
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleCancelAppointment(appointment._id)}
                                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-1"
                                >
                                  <XCircle size={14} />
                                  Cancel
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                  <User className="text-green-600" size={24} />
                  Doctor Profile & Registration
                </h2>
                <div className="max-w-2xl">
                  {editingProfile ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                          <input
                            type="text"
                            value={tempProfile.name}
                            onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter your name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <input
                            type="email"
                            value={tempProfile.email}
                            onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter your email"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                          <input
                            type="text"
                            value={tempProfile.specialization}
                            onChange={(e) => setTempProfile({ ...tempProfile, specialization: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="e.g., Ayurvedic Practitioner"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)</label>
                          <input
                            type="number"
                            value={tempProfile.experience}
                            onChange={(e) => setTempProfile({ ...tempProfile, experience: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="e.g., 5"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                          <input
                            type="text"
                            value={tempProfile.location}
                            onChange={(e) => setTempProfile({ ...tempProfile, location: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="e.g., Mumbai"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={handleCancelEdit}
                          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                        >
                          <Save size={16} />
                          Save Profile
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                          <p className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">{doctorProfile.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <p className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">{doctorProfile.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                          <p className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">{doctorProfile.specialization}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                          <p className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">{doctorProfile.experience} years</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                          <p className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">{doctorProfile.location}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setEditingProfile(true)}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                      >
                        <Edit size={16} />
                        Edit Profile
                      </button>
                    </div>
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