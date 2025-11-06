import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 🟢 new: maintain reactive state for user
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    window.dispatchEvent(new Event("userChanged")); // 🔔 notify other components
    window.location.href = "/home";
  };

  // 🟢 Detect scroll (your existing code)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight - 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🟢 Listen for login/logout changes (userChanged + storage)
  useEffect(() => {
    const syncUser = () => {
      setUserName(localStorage.getItem("userName") || "");
      setToken(localStorage.getItem("token") || null);
    };

    window.addEventListener("userChanged", syncUser);
    window.addEventListener("storage", syncUser); // for cross-tab login/logout
    return () => {
      window.removeEventListener("userChanged", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  // Determine navbar theme
  const isDarkPage =
    ["/contact", "/privacy", "/terms", "/help"].includes(location.pathname) ||
    location.pathname.startsWith("/garden");
  const isPlantView = location.pathname.startsWith("/garden");

  return (
    <nav
      className={`w-full fixed top-0 left-0 z-50 backdrop-blur-md shadow-md transition-all duration-300 ${
        isPlantView
          ? "bg-white"
          : scrolled || isDarkPage
          ? "bg-white/70"
          : "bg-transparent"
      }`}
    >
      <div className="flex justify-between px-6 py-4 w-full mx-auto">
        {/* Logo and Menu on Left */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div
            className={`${
              scrolled || isDarkPage ? "text-black" : "text-white"
            } font-extrabold text-xl md:text-2xl`}
          >
            <a href="/home">Swasthya</a>
          </div>

          {/* Menu */}
          <ul
            className={`hidden md:flex space-x-8 font-light ${
              scrolled || isDarkPage ? "text-black" : "text-white"
            }`}
          >
            <li>
              <a href="/dosha" className="hover:text-primary transition-colors duration-200">
                Dosha
              </a>
            </li>
            <li>
              <a
                href="/SymptomRecommender"
                className="hover:text-primary transition-colors duration-200"
              >
                Remedy-Finder
              </a>
            </li>
            <li>
              <a
                href="/OnlineConsultation"
                className="hover:text-primary transition-colors duration-200"
              >
                Online-Consultation
              </a>
            </li>
            <li>
              <a
                href="/NearbyClinics"
                className="hover:text-primary transition-colors duration-200"
              >
                Clinics
              </a>
            </li>
            <li>
              <a
                href="/AyurvedaGarden"
                className="hover:text-primary transition-colors duration-200"
              >
                Ayurveda-Garden
              </a>
            </li>
          </ul>
        </div>

        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          {token ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`px-4 py-2 ${
                  scrolled || isDarkPage ? "text-white" : "text-white"
                } bg-transparent hover:bg-white/10 rounded transition duration-200 flex items-center space-x-1`}
              >
                <span>{userName || "Profile"}</span>
                <svg
                  className={`w-4 h-4 ${
                    scrolled || isDarkPage ? "text-white" : "text-white"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48backdrop-blur-md bg-white/30 border border-white/40 
             rounded-xl shadow-lg z-50 transition-all duration-200"
>
                  <a
                    href="/UserDashboard"
                    className="block px-4 py-2 text-sm text-white-900 hover:bg-gray-100"
                  >
                    Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-white-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <a
                href="/login"
                className={`px-4 py-2 ${
                  scrolled || isDarkPage ? "text-black border-black" : "text-white"
                }  rounded shadow transition duration-200`}
              >
                Login
              </a>
              <a
                href="/register"
                className={`px-4 py-2 ${
                  scrolled || isDarkPage ? "text-black border-black" : "text-white"
                }  rounded shadow transition duration-200`}
              >
                Register
              </a>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <button className="text-primary focus:outline-none">
            <svg
              xmlns="http://www.w3.org/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
