import React, { useState } from "react";
import { registerDoctor } from "./api";

export default function DoctorRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    experience: "",
    location: "",
    profileImage: "",
  });

  const [avatar, setAvatar] = useState(null);
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
    submitData.append('specialization', formData.specialization);
    submitData.append('experience', formData.experience ? Number(formData.experience) : 0);
    submitData.append('location', formData.location);

    if (avatar) {
      submitData.append('avatar', avatar);
    }

    try {
      const response = await fetch('https://swasthya2-0.onrender.com/api/doctors/register', {
        method: 'POST',
        body: submitData
      });

      const res = await response.json();

      setMessage(res.message || (res.success ? "Registered" : "Error"));

      if (res.success) {
        // optionally set doctor profile in localStorage immediately
        localStorage.setItem("doctorToken", res.token);
        localStorage.setItem("doctorProfile", JSON.stringify(res.doctor));
        setTimeout(() => {
          window.location.href = "/doctor-login";
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
        <h2 className="text-3xl font-extrabold text-center text-white mb-2 drop-shadow-lg">Register as Doctor</h2>
        <p className="text-center text-green-100 mb-8">Join <span className="font-semibold text-green-300">Swasthya</span> as a Doctor</p>

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
              <label className="block text-sm font-medium text-green-100 mb-1">Specialization</label>
              <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g., Ayurvedic Practitioner" className="w-full px-4 py-3 rounded-xl bg-white/70 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-100 mb-1">Experience (years)</label>
              <input type="number" min="0" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g., 5" className="w-full px-4 py-3 rounded-xl bg-white/70 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-100 mb-1">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Mumbai" className="w-full px-4 py-3 rounded-xl bg-white/70 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400" required />
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
                  setAvatar(file);
                  setMessage("");
                }
              }}
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <p className="text-xs text-green-200 mt-1">Max 5MB, JPG/PNG only</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-100 mb-1">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" className="w-full px-4 py-3 rounded-xl bg-white/70 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-100 mb-1">Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter your password" className="w-full px-4 py-3 rounded-xl bg-white/70 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400" required />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-green-800 shadow-lg hover:shadow-xl transition duration-300">Register as Doctor</button>
        </form>

        {message && <p className="mt-4 text-center text-sm text-red-400">{message}</p>}

        <p className="mt-6 text-center text-green-100 text-sm">Already have a doctor account? <a href="/doctor-login" className="text-green-300 font-medium hover:underline">Login as Doctor</a></p>
        <p className="mt-2 text-center text-green-100 text-sm">Not a doctor? <a href="/register" className="text-green-300 font-medium hover:underline">Register as User</a></p>
      </div>
    </div>
  );
}
