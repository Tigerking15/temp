import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();

  // List of background images (add your own image paths here)
  const backgroundImages = [
    "/background/enter1.jpg",
    "/background/enter2.jpg",
    "/background/enter3.jpg",
  ];

  // Randomly select one background image when the component loads
  const randomImage = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    return backgroundImages[randomIndex];
  }, []); // runs only once when the component mounts

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center transition-all duration-700"
      style={{
        backgroundImage: `url(${randomImage})`,
      }}
    >
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Large "Swasthya" text positioned like "Soil Sense." */}
      <h1 className="absolute left-10 top-1/4 text-white text-8xl md:text-9xl lg:text-[10rem] font-extrabold leading-tight z-10 drop-shadow-lg">
        Swasthya.
      </h1>

      {/* Tagline + Enter button at bottom center */}
      <div className="absolute bottom-20 text-center z-10">
        <p className="text-lg md:text-xl text-white mb-3 font-light drop-shadow-md">
          Your one-stop platform for holistic health and Ayurveda wellness.
        </p>
        <button
          onClick={() => navigate("/home")}
          className="px-10 py-3 text-lg font-semibold text-white bg-green-600 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300"
        >
          Enter
        </button>
      </div>
    </div>
  );
}

export default Welcome;
