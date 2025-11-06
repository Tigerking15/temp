// src/Register.jsx
import React, { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    profileImage: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("⚠️ Passwords do not match!");
      return;
    }

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('email', formData.email);
    submitData.append('password', formData.password);
    submitData.append('age', formData.age ? Number(formData.age) : "");
    submitData.append('gender', formData.gender);

    if (profileImage) {
      submitData.append('profileImage', profileImage);
    }

    try {
      const response = await fetch('https://swasthya2-0.onrender.com/api/users/register', {
        method: 'POST',
        body: submitData
      });

      const res = await response.json();

      setMessage(res.message || (res.success ? "Registered" : "Error"));

      if (res.success) {
        // optionally set user profile in localStorage immediately
        localStorage.setItem("token", res.token);
        localStorage.setItem("userProfile", JSON.stringify(res.user));
        setTimeout(() => {
          window.location.href = "/login";
        }, 900);
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <video autoPlay loop muted playsInline preload="auto" poster="/images/register-poster.jpg" className="absolute inset-0 w-full h-full object-cover z-0">
        <source src="/videos/login.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/50 z-0"></div>

      <div className="relative z-10 w-full max-w-lg p-8 md:p-10 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-white mb-2 drop-shadow-lg">Create Your Account</h2>
        <p className="text-center text-green-100 mb-8">Join <span className="font-semibold text-green-300">Swasthya</span> and take charge of your health!</p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-green-100 mb-1">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" className="w-full px-4 py-3 rounded-xl bg-white/70 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-100 mb-1">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className="w-full px-4 py-3 rounded-xl bg-white/70 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-100 mb-1">Age</label>
              <input type="number" min="0" name="age" value={formData.age} onChange={handleChange} placeholder="Age" className="w-full px-4 py-3 rounded-xl bg-white/70 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-100 mb-1">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white/70 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400">
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-100 mb-1">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" className="w-full px-4 py-3 rounded-xl bg-white/70 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-100 mb-1">Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter your password" className="w-full px-4 py-3 rounded-xl bg-white/70 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-100 mb-1">Profile Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    setMessage("⚠️ File size must be less than 5MB!");
                    return;
                  }
                  setProfileImage(file);
                  setMessage("");
                }
              }}
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <p className="text-xs text-green-200 mt-1">Max 5MB, JPG/PNG only</p>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-800 shadow-lg hover:shadow-xl transition duration-300">Register</button>
        </form>

        {message && <p className="mt-4 text-center text-sm text-red-400">{message}</p>}

        <p className="mt-6 text-center text-green-100 text-sm">Already have an account? <a href="/login" className="text-green-300 font-medium hover:underline">Login</a></p>
        <p className="mt-2 text-center text-green-100 text-sm">Are you a doctor? <a href="/doctor-register" className="text-green-300 font-medium hover:underline">Register as Doctor</a></p>
      </div>
    </div>
  );
}
