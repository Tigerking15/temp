import React from "react";
import Navbar from "./Navbar";

export default function DoshaPage() {
  return (
    <div className="font-sans text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/videos/dosha.mp4" type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        {/* Hero Text */}
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-white drop-shadow-lg">
            Discover Your Dosha
          </h1>
          <p className="text-lg md:text-2xl mb-8 text-green-100 drop-shadow-md">
            Balance your mind, body & spirit with Ayurveda
          </p>
          <a
            href="/DoshaQuiz"
            className="px-8 py-4 bg-primary text-white rounded-full font-semibold shadow-lg hover:bg-primary/90 hover:scale-105 transition transform duration-300"
          >
            Take the Dosha Quiz
          </a>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white text-center relative overflow-hidden">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">What is a Dosha?</h2>
        <p className="mb-6 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
          In Ayurveda, <span className="font-semibold">Doshas</span> are the three
          fundamental energies—<span className="text-yellow-200">Vata</span>,{" "}
          <span className="text-red-200">Pitta</span>, and{" "}
          <span className="text-blue-200">Kapha</span>—that govern your body, mind,
          and spirit. Understanding your dosha helps you find balance in lifestyle,
          diet, and well-being.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/AboutDosha"
            className="px-8 py-4 bg-white text-green-600 font-semibold rounded-full shadow-lg hover:bg-green-100 hover:scale-105 transition transform duration-300"
          >
            Learn More
          </a>
        </div>
      </section>
    </div>
  );
}
