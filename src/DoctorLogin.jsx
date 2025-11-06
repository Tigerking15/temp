import React, { useState } from "react";
import { loginDoctor } from "./api";
import { useNavigate } from "react-router-dom";

export default function DoctorLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      const res = await loginDoctor(formData.email, formData.password);
      console.log("Doctor login response:", res);

      if (res && res.token) {
        // ✅ Save token
        localStorage.setItem("doctorToken", res.token);

        // ✅ Build a consistent profile object
        const profile = {
          name: res.name || res.doctor?.name || "",
          email: res.email || res.doctor?.email || formData.email,
          specialization: res.specialization || res.doctor?.specialization || "",
          experience: res.experience || res.doctor?.experience || "",
          location: res.location || res.doctor?.location || "",
          profileImage: res.profileImage || res.doctor?.profileImage || "",
          _id: res._id || res.doctor?._id || "",
        };

        // ✅ Store profile + convenience keys
        localStorage.setItem("doctorProfile", JSON.stringify(profile));
        localStorage.setItem("doctorName", profile.name);

        // ✅ Notify all components (Navbar, Dashboard)
        window.dispatchEvent(new Event("doctorChanged"));

        setMessage("✅ Doctor login successful! Redirecting...");
        setTimeout(() => navigate("/doctor-dashboard"), 600);
      } else {
        const errMsg = res?.message || "Invalid credentials or server error";
        setMessage("❌ " + errMsg);
      }
    } catch (err) {
      console.error("Unexpected doctor login error:", err);
      setMessage("❌ Unexpected error. Check console.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/images/login-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/login.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 md:p-10 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-white mb-4 drop-shadow-lg">
          Doctor Login
        </h2>

        <p className="text-center text-green-100 mb-8">
          Log in to{" "}
          <span className="font-semibold text-green-300">Swasthya</span> as a Doctor
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-green-100 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-100 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-800 shadow-lg hover:shadow-xl transition duration-300"
          >
            Login as Doctor
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-red-400">{message}</p>
        )}

        <p className="mt-6 text-center text-green-100 text-sm">
          Not a doctor?{" "}
          <a
            href="/login"
            className="text-green-300 font-medium hover:underline"
          >
            Login as User
          </a>
        </p>
        <p className="mt-2 text-center text-green-100 text-sm">
          Don’t have a doctor account?{" "}
          <a
            href="/doctor-register"
            className="text-green-300 font-medium hover:underline"
          >
            Register as Doctor
          </a>
        </p>
      </div>
    </div>
  );
}
