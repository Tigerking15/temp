// src/Login.jsx
import React, { useState } from "react";
import { loginUser } from "./api";
import { useNavigate } from "react-router-dom";

export default function Login() {
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
      const res = await loginUser(formData.email, formData.password);
      console.log("Login response:", res);

      if (res && res.token) {
        // ✅ Save token
        localStorage.setItem("token", res.token);

        // ✅ Build a consistent profile object
        const profile = {
          name:
            res.name ||
            res.fullName ||
            res.user?.fullName ||
            res.user?.name ||
            "",
          email: res.email || res.user?.email || formData.email,
          age: res.age || res.user?.age || "",
          gender: res.gender || res.user?.gender || "",
          dosha: res.doshaType || res.user?.doshaType || "Unknown",
          _id: res._id || res.user?._id || "",
        };

        // ✅ Store profile + convenience keys
        localStorage.setItem("userProfile", JSON.stringify(profile));
        localStorage.setItem("userName", profile.name);
        localStorage.setItem("userId", profile._id);

        // ✅ Notify all components (Navbar, Dashboard)
        window.dispatchEvent(new Event("userChanged"));

        setMessage("✅ Login successful! Redirecting...");
        setTimeout(() => navigate("/Dosha"), 600);
      } else {
        const errMsg = res?.message || "Invalid credentials or server error";
        setMessage("❌ " + errMsg);
      }
    } catch (err) {
      console.error("Unexpected login error:", err);
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
          Welcome Back
        </h2>

        <p className="text-center text-green-100 mb-8">
          Log in to{" "}
          <span className="font-semibold text-green-300">Swasthya</span>
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
            Login
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-red-400">{message}</p>
        )}

        <p className="mt-6 text-center text-green-100 text-sm">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-green-300 font-medium hover:underline"
          >
            Register
          </a>
        </p>
        <p className="mt-2 text-center text-green-100 text-sm">
          Are you a doctor?{" "}
          <a
            href="/doctor-login"
            className="text-green-300 font-medium hover:underline"
          >
            Login as Doctor
          </a>
        </p>
        <p className="mt-2 text-center text-green-100 text-sm">
          Are you a Admin?{" "}
          <a
            href="/admin-login"
            className="text-green-300 font-medium hover:underline"
          >
            Login as Admin
          </a>
        </p>
      </div>
    </div>
  );
}
