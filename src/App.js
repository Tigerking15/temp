import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import "./App.css";

// Import pages & components
import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import DoshaPage from "./DoshaPage";
import OnlineConsultation from "./OnlineConsultation";
import NearbyClinics from "./NearbyClinics";
import Welcome from "./Welcome";
import AyurvedaGarden from "./AyurvedaGarden";
import PlantView from "./PlantView";
import DoshaQuiz from "./DoshaQuiz";
import DoshaResult from "./DoshaResult";
import SymptomRecommender from "./SymptomRecommender";
import { AppProvider } from "./context/AppContext";
import UserDashboard from "./UserDashboard";
import AboutDosha from "./AboutDosha";
import Footer from "./Footer";
import Feedback from "./Feedback";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import ContactUs from "./ContactUs";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsConditions from "./TermsConditions";
import HelpCenter from "./HelpCenter";
import DoctorDashboard from "./DoctorDashboard";
import DoctorLogin from "./DoctorLogin";
import DoctorRegister from "./DoctorRegister";
import About from "./About";
import Services from "./Services";
import Blog from "./Blog";
import FAQ from "./FAQ";

// Protected Route Components
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin-login" />;
};

const DoctorProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("doctorToken");
  return token ? children : <Navigate to="/doctor-login" />;
};

function AppContent() {
  const location = useLocation();

  // Define routes where Footer should be hidden
  const hideFooterRoutes = [
    "/login",
    "/register",
    "/doctor-login",
    "/doctor-register",
    "/admin-login",
    "/admin-dashboard"
  ];

  // Check if current path matches or starts with any excluded route
  const shouldHideFooter = hideFooterRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/doctor-register" element={<DoctorRegister />} />
          <Route path="/dosha" element={<DoshaPage />} />
          <Route path="/OnlineConsultation" element={<ProtectedRoute><OnlineConsultation /></ProtectedRoute>} />
          <Route path="/NearbyClinics" element={<NearbyClinics />} />
          <Route path="/AyurvedaGarden" element={<ProtectedRoute><AyurvedaGarden /></ProtectedRoute>} />
          <Route path="/DoshaQuiz" element={<ProtectedRoute><DoshaQuiz /></ProtectedRoute>} />
          <Route path="/DoshaResult" element={<DoshaResult />} />
          <Route path="/SymptomRecommender" element={<ProtectedRoute><SymptomRecommender /></ProtectedRoute>} />
          <Route path="/UserDashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/AboutDosha" element={<AboutDosha />} />
          <Route path="/garden/:slug" element={<PlantView />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/doctor-dashboard" element={<DoctorProtectedRoute><DoctorDashboard /></DoctorProtectedRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </main>

      {/* ✅ Conditionally render Footer */}
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
