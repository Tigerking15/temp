// src/ContactUs.jsx
import React, { useMemo, useRef, useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Configure API base (Vite/CRA/.env) with localhost fallback
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE) ||
  process.env?.REACT_APP_API_BASE ||
  "https://swasthya2-0.onrender.com";

const FloatingBackButton = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate("/Home")}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className="fixed top-4 left-4 px-4 py-2 flex items-center gap-2 
        bg-white/80 backdrop-blur-sm rounded-lg shadow-lg 
        border border-gray-200 text-gray-700 hover:bg-gray-50 
        transition-all duration-300 z-50"
    >
      <span aria-hidden="true">←</span>
      <span>Back to Home</span>
    </motion.button>
  );
};

export default function ContactUs() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
    website: "", // honeypot (must stay empty)
  });
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ state: "idle", message: "" }); // idle | sending | success | error
  const abortRef = useRef(null);
  const maxMsg = 2000;

  const errors = useMemo(() => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Please enter your first name.";
    if (!form.lastName.trim()) e.lastName = "Please enter your last name.";

    if (!form.email.trim()) e.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Please enter a valid email.";

    if (!form.subject.trim()) e.subject = "Please add a subject.";
    if (!form.message.trim()) e.message = "Please write a message.";
    else if (form.message.length > maxMsg) e.message = `Keep under ${maxMsg} characters.`;

    if (form.website) e.website = "Spam detected."; // honeypot trigger
    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      subject: true,
      message: true,
    });
    if (!isValid) return;

    setStatus({ state: "sending", message: "Sending your message…" });

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await Promise.race([
        fetch(`${API_BASE}/api/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            subject: form.subject.trim(),
            message: form.message.trim(),
          }),
          signal: controller.signal,
        }),
        new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 12000)),
      ]);

      if (!res || !res.ok) throw new Error("server");
      const data = await res.json().catch(() => ({}));

      setStatus({
        state: "success",
        message: data?.message || "Thanks! We’ll get back to you shortly.",
      });
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
        website: "",
      });
      setTouched({});
    } catch (err) {
      setStatus({
        state: "error",
        message:
          err?.message === "timeout"
            ? "Request timed out. Please try again."
            : "We couldn’t send your message right now. Please try again.",
      });
    }
  };

  const fieldClass = (field) =>
    `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition
     ${touched[field] && errors[field] ? "border-rose-300" : "border-gray-300"}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <FloatingBackButton />
      <div className="pt-20 pb-12 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions or need assistance? We’re here to help you on your wellness journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-primary mb-6">Send us a Message</h2>

            {/* Status banners */}
            {status.state !== "idle" && (
              <div
                className={`mb-6 rounded-xl border px-4 py-3 text-sm flex items-start gap-2 ${
                  status.state === "sending"
                    ? "border-gray-200 bg-gray-50 text-gray-700"
                    : status.state === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-rose-200 bg-rose-50 text-rose-800"
                }`}
                role="status"
                aria-live="polite"
              >
                {status.state === "success" ? (
                  <CheckCircle2 className="w-4 h-4 mt-0.5" />
                ) : status.state === "error" ? (
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                ) : (
                  <svg className="h-4 w-4 mt-0.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                )}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    onBlur={() => setTouched((t) => ({ ...t, firstName: true }))}
                    className={fieldClass("firstName")}
                    placeholder="Your first name"
                    required
                  />
                  {touched.firstName && errors.firstName && (
                    <p className="mt-1 text-xs text-rose-600">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    onBlur={() => setTouched((t) => ({ ...t, lastName: true }))}
                    className={fieldClass("lastName")}
                    placeholder="Your last name"
                    required
                  />
                  {touched.lastName && errors.lastName && (
                    <p className="mt-1 text-xs text-rose-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  className={fieldClass("email")}
                  placeholder="your@email.com"
                  required
                />
                {touched.email && errors.email && (
                  <p className="mt-1 text-xs text-rose-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  onBlur={() => setTouched((t) => ({ ...t, subject: true }))}
                  className={fieldClass("subject")}
                  placeholder="How can we help?"
                  required
                />
                {touched.subject && errors.subject && (
                  <p className="mt-1 text-xs text-rose-600">{errors.subject}</p>
                )}
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <span
                    className={`text-xs ${
                      form.message.length > maxMsg ? "text-rose-600" : "text-gray-500"
                    }`}
                  >
                    {Math.max(maxMsg - form.message.length, 0)} characters left
                  </span>
                </div>
                <textarea
                  name="message"
                  rows="5"
                  value={form.message}
                  onChange={handleChange}
                  onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                  className={fieldClass("message") + " resize-y"}
                  placeholder="Tell us more about your inquiry…"
                  required
                  maxLength={maxMsg + 1}
                />
                {touched.message && errors.message && (
                  <p className="mt-1 text-xs text-rose-600">{errors.message}</p>
                )}
              </div>

              {/* Honeypot field (hidden from users) */}
              <div className="hidden">
                <label>Website</label>
                <input
                  name="website"
                  type="text"
                  value={form.website}
                  onChange={handleChange}
                  autoComplete="off"
                  tabIndex={-1}
                />
              </div>

              <button
                type="submit"
                disabled={status.state === "sending" || !isValid}
                className={`w-full text-white py-3 px-6 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2
                  ${
                    status.state === "sending" || !isValid
                      ? "bg-primary/70 cursor-not-allowed"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                aria-busy={status.state === "sending"}
              >
                {status.state === "sending" ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-primary mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Mail className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Us</h3>
                    <p className="text-gray-600">support@swasthya.com</p>
                    <p className="text-sm text-gray-500">We respond within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Phone className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Call Us</h3>
                    <p className="text-gray-600">+91 98765 43210</p>
                    <p className="text-sm text-gray-500">Mon–Fri, 9:00–18:00 IST</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <MapPin className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Visit Us</h3>
                    <p className="text-gray-600">Mumbai, Maharashtra, India</p>
                    <p className="text-sm text-gray-500">By appointment only</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-primary mb-4">Office Hours</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Monday – Friday</span>
                  <span>9:00 AM – 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM – 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>
          {/* /Contact Information */}
        </div>
      </div>
    </div>
  );
}