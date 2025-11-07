// src/Home.jsx
import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import Navbar from "./Navbar";
import wellnessAnim from "./assets/lottie/Yoga Se Hi hoga.json";
import {
  Sparkles,
  Stethoscope,
  MapPin,
  Brain,
  Leaf,
  UtensilsCrossed,
  X,
} from "lucide-react";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE) ||
  process.env?.REACT_APP_API_BASE ||
  "https://swasthya2-0.onrender.com";

export default function Home() {
  const [latestFeedback, setLatestFeedback] = useState([]);
  const [feedbackError, setFeedbackError] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFeedback = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/feedback`);
        if (!res.ok) throw new Error("Failed to fetch feedback");
        const data = await res.json();

        const normalized = Array.isArray(data)
          ? data
            .map((d) => ({
              name: d.name || "User",
              text: d.message || d.feedback || "",
              rating: d.rating || 5,
              createdAt: d.createdAt || "",
            }))
            .filter((d) => d.text?.trim().length > 0)
            .sort(
              (a, b) =>
                b.rating - a.rating ||
                new Date(b.createdAt) - new Date(a.createdAt)
            )
            .slice(0, 4)
          : [];

        if (isMounted) setLatestFeedback(normalized);
      } catch {
        if (isMounted) setFeedbackError("");
      }
    };

    const fetchAverageRating = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/feedback/average`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (isMounted) {
          setAverageRating(data.averageRating);
          setTotalFeedbacks(data.totalFeedbacks);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchFeedback();
    fetchAverageRating();

    return () => {
      isMounted = false;
    };
  }, []);

  const fallbackFeedback = [
    {
      name: "Aarav Mehta",
      text: "Swasthya helped me balance my dosha and improve my digestion naturally!",
      rating: 5,
      img: "https://randomuser.me/api/portraits/men/11.jpg",
    },
    {
      name: "Priya Sharma",
      text: "The online consultation feature is so convenient — the doctor was amazing!",
      rating: 5,
      img: "https://randomuser.me/api/portraits/women/24.jpg",
    },
    {
      name: "Rohan Iyer",
      text: "Love how the recipes are customized to my body type — healthy and tasty!",
      rating: 4,
      img: "https://randomuser.me/api/portraits/men/29.jpg",
    },
    {
      name: "Meera Patel",
      text: "The 3D plants section made learning about herbs so fun and interactive.",
      rating: 5,
      img: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    {
      name: "Aditya Rao",
      text: "Finding nearby clinics was a game-changer — finally real Ayurveda near me!",
      rating: 4,
      img: "https://randomuser.me/api/portraits/men/53.jpg",
    },
    {
      name: "Sneha Kapoor",
      text: "Beautiful interface and accurate dosha insights. I recommend Swasthya to everyone.",
      rating: 5,
      img: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  ];

  const displayFeedback =
    latestFeedback.length > 0 ? latestFeedback : fallbackFeedback;

  const features = [
    {
      icon: <Brain className="text-purple-600" size={40} />,
      title: "Dosha Analyzer",
      desc: "Identify your dominant dosha and receive personalized advice.",
      full: "Our AI-powered dosha analyzer helps you identify whether you're Vata, Pitta, or Kapha dominant. Based on your results, you'll receive tailored lifestyle and dietary advice for optimal balance.",
    },
    {
      icon: <UtensilsCrossed className="text-pink-600" size={40} />,
      title: "Dosha-Based Recipes",
      desc: "Delicious recipes curated to match your dosha for balanced living.",
      full: "Explore curated recipes designed for your dosha type. From detoxifying kitchari to cooling herbal teas, discover the perfect balance between taste and wellness with every bite.",
    },
    {
      icon: <Leaf className="text-emerald-600" size={40} />,
      title: "3D Medicinal Plants",
      desc: "Explore herbs in immersive 3D and understand their healing properties.",
      full: "Immerse yourself in 3D visuals of ancient Ayurvedic herbs. Learn about their Sanskrit names, dosha balance effects, medicinal properties, and real-world applications in remedies and diets.",
    },
    {
      icon: <Stethoscope className="text-green-600" size={40} />,
      title: "Online Consultations",
      desc: "Connect instantly with certified Ayurvedic doctors from your home.",
      full: "Our online consultation platform lets you book appointments with certified Ayurvedic doctors from anywhere. Get personalized treatment plans, herbal prescriptions, and diet advice tailored to your body type — all without leaving your home.",
    },
    {
      icon: <MapPin className="text-blue-600" size={40} />,
      title: "Find Clinics Nearby",
      desc: "Locate trusted Ayurvedic clinics and wellness centers near you.",
      full: "Discover verified Ayurvedic clinics and wellness centers in your city. Each listing includes authentic reviews, services offered, consultation timings, and direct contact information to help you make informed health decisions.",
    },
    {
      icon: <Sparkles className="text-yellow-600" size={40} />,
      title: "Personalized Remedies",
      desc: "Get yoga, lifestyle, and herbal suggestions tailored just for you.",
      full: "Receive holistic recommendations that include yoga postures, pranayama routines, and herbal remedies specifically aligned to your body constitution and lifestyle patterns.",
    },
  ];

  return (
    <div className="font-sans5 text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/videos/river.mp4" type="video/mp4" />
        </video>

        {/* 🔥 Dark Overlay added here */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>

        <div className="z-20 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 animate-fadeIn">
            Embrace Nature, Embrace Health
          </h1>
          <p className="text-lg md:text-2xl text-white mb-8 animate-fadeIn delay-200">
            Discover the secrets of Ayurveda & herbal wellness for a healthier
            life.
          </p>
          <div className="flex justify-center animate-fadeIn delay-400">
            <a
              href="/register"
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:scale-105 transition transform duration-300"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Lottie animationData={wellnessAnim} loop={true} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Discover the Power of Ayurveda
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedFeature(feature)}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 text-center border border-green-100 cursor-pointer"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Popup */}
      {selectedFeature && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-3xl mx-4 relative animate-fadeInUp">
            <button
              onClick={() => setSelectedFeature(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              <X size={28} />
            </button>
            <div className="flex justify-center mb-4">{selectedFeature.icon}</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800 text-center">
              {selectedFeature.title}
            </h3>
            <p className="text-gray-600 leading-relaxed text-justify">
              {selectedFeature.full}
            </p>
          </div>
        </div>
      )}

      {/* Sliding Feedback Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">
          What Our Users Say
        </h2>

        {totalFeedbacks > 0 && (
          <div className="mb-10 flex justify-center items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md w-fit mx-auto">
            <span className="text-yellow-400 text-2xl font-bold">
              {averageRating}
            </span>
            <span className="text-yellow-400 text-xl">★</span>
            <span className="text-gray-600 font-medium">
              Based on {totalFeedbacks} reviews
            </span>
          </div>
        )}

        <div className="w-full overflow-hidden">
          <div
            className="flex gap-8 animate-marquee"
            style={{
              animation: "marquee 30s linear infinite",
              width: `${displayFeedback.length *2* 300}px`,
            }}
          >
            {[...displayFeedback, ...displayFeedback].map((item, idx) => (
              <div
                key={idx}
                className="bg-white w-[280px] flex-shrink-0 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center border border-green-100"
              >
                <img
                  src={
                    item.img ||
                    `https://randomuser.me/api/portraits/men/${(idx % displayFeedback.length) + 10}.jpg`
                  }
                  alt={item.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-green-400"
                />
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h3>
                <p className="text-gray-600 italic text-sm mt-2 mb-3">
                  "{item.text}"
                </p>
                <div className="text-yellow-400">
                  {"★".repeat(item.rating)}
                  {"☆".repeat(5 - item.rating)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>

        {feedbackError && (
          <p className="mt-6 text-sm text-gray-500 text-center">
            {feedbackError}
          </p>
        )}
      </section>

      {/* Call To Action */}
      {/* ✅ Call To Action Section (fixed hover visibility) */}
<section className="py-24 bg-green-700 text-white text-center relative overflow-hidden">
  <div className="absolute inset-0 opacity-10 pointer-events-none">
    <Lottie
      animationData={wellnessAnim}
      loop={true}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </div>
  <div className="relative z-10 max-w-4xl mx-auto">
    <h2 className="text-3xl md:text-4xl font-bold mb-6">
      Start Your Wellness Journey Today!
    </h2>
    <p className="mb-8 text-lg md:text-xl">
      Sign up and get personalized Ayurvedic recommendations
    </p>
    <a
      href="/register"
      className="px-10 py-4 bg-white text-green-700 font-semibold rounded-full shadow-lg 
                 hover:bg-green-600 hover:text-white hover:shadow-xl 
                 transform transition-all duration-300"
    >
      Register Now
    </a>
  </div>
</section>

    </div>
  );
}
