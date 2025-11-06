// src/AboutDosha.jsx
import React, { useState } from "react";
import Lottie from "lottie-react";
import Navbar from "./Navbar";

import vataAnim from "./assets/lottie/vata.json";
import pittaAnim from "./assets/lottie/pitta.json";
import waterAnim from "./assets/lottie/water.json";

const doshas = [
  {
    name: "Vata",
    element: "Air & Space",
    description: "Energetic, creative, but prone to anxiety and dryness.",
    anim: vataAnim,
    details: `
- Qualities: Light, dry, cold, irregular, mobile, quick
- Strengths: Creative, energetic, flexible
- Challenges: Anxiety, insomnia, dry skin, digestive irregularities
- Balance Tips: Warm, grounding foods; regular routine; meditation; oil massage
    `,
  },
  {
    name: "Pitta",
    element: "Fire & Water",
    description: "Intelligent, ambitious, prone to irritability and heat.",
    anim: pittaAnim,
    details: `
- Qualities: Hot, sharp, intense, oily, light, fluid
- Strengths: Intelligent, focused, ambitious
- Challenges: Irritability, anger, acidity, inflammation
- Balance Tips: Cooling foods (cucumber, mint, milk); avoid spicy/oily foods; yoga & nature walks
    `,
  },
  {
    name: "Kapha",
    element: "Earth & Water",
    description: "Calm, loyal, but can be sluggish or gain weight easily.",
    anim: waterAnim,
    details: `
- Qualities: Heavy, slow, steady, stable, cool, moist
- Strengths: Loyal, patient, compassionate, grounded, strong immunity
- Challenges: Lethargy, weight gain, congestion, resistance to change
- Balance Tips: Light, spicy foods; daily exercise; stay mentally stimulated; avoid oversleeping
    `,
  },
];

function DoshaCard({ dosha }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Card */}
      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer bg-white/10 backdrop-blur-2xl border border-white/20 
        rounded-3xl shadow-xl p-6 flex flex-col items-center text-center 
        transition transform hover:-translate-y-2 hover:shadow-2xl hover:scale-105 relative"
      >
        {/* Element */}
        <span className="text-sm text-green-200 mb-2">{dosha.element}</span>

        {/* Lottie Animation */}
        <div className="w-32 h-32 mb-3">
          <Lottie animationData={dosha.anim} loop />
        </div>

        <h3 className="text-xl font-bold text-white drop-shadow-lg">
          {dosha.name}
        </h3>
        <p className="text-sm text-green-100">{dosha.description}</p>
        <p className="mt-2 text-xs text-green-200 italic">Click for more info</p>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 max-w-md shadow-2xl relative">
            <button
              className="absolute top-3 right-3 text-green-100 hover:text-white"
              onClick={() => setOpen(false)}
            >
              ✖
            </button>
            <h3 className="text-2xl font-bold text-green-300 mb-2">
              {dosha.name} – {dosha.element}
            </h3>
            <p className="whitespace-pre-line text-green-100 text-sm">
              {dosha.details}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default function AboutDosha() {
  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      {/* 🔹 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
        ref={(video) => {
          if (video) video.playbackRate = 0.5; // Slow down to 50%
        }}
      >
        <source src="/videos/doshabg.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/20 z-0"></div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        {/* Dosha Cards Section */}
        <section className="py-20 px-4 md:px-20 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-green-300 drop-shadow-lg">
            Understanding the Three Doshas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl w-full">
            {doshas.map((d, idx) => (
              <DoshaCard key={idx} dosha={d} />
            ))}
          </div>
        </section>

        {/* 🔹 Two Embedded YouTube Videos Side by Side */}
        <section className="py-16 px-6 text-center bg-black/30 backdrop-blur-xl">
          <h3 className="text-3xl md:text-4xl font-bold text-green-300 mb-10">
            Watch to Learn More About Doshas
          </h3>

          {/* Responsive Two-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* First Video */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/WfN1ZLNzP4A"
                title="Understanding Doshas - Ayurveda"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Second Video */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/bXhJy4N3L4E"
                title="Ayurveda Dosha Balance Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
