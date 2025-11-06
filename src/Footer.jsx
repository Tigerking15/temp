// src/Footer.jsx
import React from "react";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* About */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6">About Us</h3>
          <p className="text-sm leading-relaxed">
            We are committed to providing you with reliable wellness insights and tools to help improve your health journey.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="/about" className="hover:text-white transition-colors duration-200">About</a></li>
            <li><a href="/services" className="hover:text-white transition-colors duration-200">Services</a></li>
            <li><a href="/blog" className="hover:text-white transition-colors duration-200">Blog</a></li>
            <li><a href="/faq" className="hover:text-white transition-colors duration-200">FAQ</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6">Support</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="/contact" className="hover:text-white transition-colors duration-200">Contact Us</a></li>
            <li><a href="/privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-white transition-colors duration-200">Terms & Conditions</a></li>
            <li><a href="/help" className="hover:text-white transition-colors duration-200">Help Center</a></li>
            <li><a href="/feedback" className="hover:text-white transition-colors duration-200">Feedback</a></li>
            <li><a href="/admin-login" className="hover:text-white transition-colors duration-200">Admin Login</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6">Get in Touch</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3"><Mail size={18}/> support@swasthya.com</li>
            <li className="flex items-center gap-3"><Phone size={18}/> +91 98765 43210</li>
            <li className="flex items-center gap-3"><MapPin size={18}/> Mumbai, India</li>
          </ul>
          <div className="flex gap-6 mt-6">
            <button className="hover:text-white transition-colors duration-200"><Facebook size={20}/></button>
            <button className="hover:text-white transition-colors duration-200"><Twitter size={20}/></button>
            <button className="hover:text-white transition-colors duration-200"><Instagram size={20}/></button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 mt-10 pt-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Swasthya. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
