// AyurvedaGardenList.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

// Plants list with images
const plants = [
  {
    name: "Neem",
    slug: "neem",
    description: "A medicinal plant widely used in Ayurveda.",
    image: "/models/images/neemleaves.jpg",
  },
  {
    name: "Ashwagandha",
    slug: "ashwagandha",
    description: "An adaptogenic herb known for stress relief.",
    image: "/models/images/ashwagandha.jpg",
  },
  {
    name: "Tulsi",
    slug: "tulsi",
    description: "A sacred plant with numerous health benefits.",
    image: "/models/images/tulsi.jpg",
  },
  {
    name: "Turmeric",
    slug: "turmeric",
    description: "Cooking spice and powerful ayurvedic herb.",
    image: "/models/images/turmeric.jpg",
  },
  {
    name: "Amla",
    slug: "amla",
    description: "Fruit with antioxidant properties high in ascorbic acid.",
    image: "/models/images/amla.jpg",
  },
  {
    name: "Brahmi",
    slug: "brahmi",
    description: "Flowering herb commonly used to improve memory and cognition.",
    image: "/models/images/brahmi.jpg",
  },
];

export default function AyurvedaGardenList() {
  const navigate = useNavigate();

  return (
    <div className="relative w-screen min-h-screen flex flex-col items-center overflow-hidden">
      {/* 🔹 Background Video */}
<video
  autoPlay
  loop
  muted
  playsInline
  preload="auto"
  className="absolute inset-0 w-full h-full object-cover z-0 brightness-50"
 
>
  <source src="/videos/ayurvedagarden.mp4" type="video/mp4" />
</video>

      {/* Navbar */}
      <Navbar />

      {/* Main container with bottom margin for footer */}
      <div className="relative z-10 w-full flex flex-col items-center pt-20 mb-20">
        <h1 className="text-3xl font-bold text-white mb-8">Ayurveda Garden</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6">
          {plants.map((plant) => (
            <div
              key={plant.slug}
              className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-xl shadow-lg p-4 cursor-pointer hover:shadow-2xl transition duration-300"
              onClick={() => navigate(`/garden/${plant.slug}`)}
            >
              <img
                src={plant.image}
                alt={plant.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h2 className="text-xl font-semibold text-white mb-1">
                {plant.name}
              </h2>
              <p className="text-gray-200 text-sm">{plant.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
