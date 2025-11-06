import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Add services data array
const services = [
  {
    icon: "🌿",
    title: "Online Consultation",
    description: "Connect with certified Ayurvedic practitioners from the comfort of your home.",
    features: [
      "Video consultations",
      "Digital prescriptions",
      "Follow-up support",
      "24/7 chat support"
    ],
    link: "/OnlineConsultation"
  },
  {
    icon: "📋",
    title: "Dosha Assessment",
    description: "Discover your unique mind-body constitution through our detailed assessment.",
    features: [
      "Comprehensive questionnaire",
      "Personalized report",
      "Diet recommendations",
      "Lifestyle guidelines"
    ],
    link: "/DoshaQuiz"
  },
  {
    icon: "🍃",
    title: "Treatment Plans",
    description: "Customized Ayurvedic treatment plans based on your dosha and health concerns.",
    features: [
      "Personalized herbs",
      "Diet plans",
      "Exercise routines",
      "Progress tracking"
    ],
    link: "/UserDashboard"
  }
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Fixed back button */}
      <button
        onClick={() => navigate('/home')}
        className="fixed top-4 left-4 px-4 py-2 flex items-center gap-2 bg-white/80 backdrop-blur-sm 
          rounded-lg shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50 
          transition-all duration-300"
        
      >
        <span aria-hidden="true">←</span>
        <span>Back to Home</span>
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-xl text-gray-600">Comprehensive Ayurvedic Healthcare Solutions</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>

              <ul className="text-sm text-gray-500 mb-4 space-y-1">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to={service.link}
                className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Why Choose Our Services?</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Personalized Approach</h3>
              <p className="text-gray-600">
                Every service is tailored to your unique dosha constitution and individual health needs,
                ensuring the most effective and appropriate recommendations.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Expert Practitioners</h3>
              <p className="text-gray-600">
                Our team consists of certified Ayurvedic doctors and practitioners with years of experience
                in traditional healing practices and modern healthcare integration.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Technology-Driven</h3>
              <p className="text-gray-600">
                We combine ancient wisdom with cutting-edge technology to provide accurate assessments,
                interactive learning experiences, and convenient access to healthcare.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Holistic Wellness</h3>
              <p className="text-gray-600">
                Beyond treating symptoms, we focus on preventive care, lifestyle guidance, and overall
                well-being to help you achieve optimal health.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
