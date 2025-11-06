import React from 'react';
import { useNavigate } from 'react-router-dom';  // Add this import

const About = () => {
  const navigate = useNavigate();  // Add this hook

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Add back button at the top */}
      <button
        onClick={() => navigate('/home')}
        className="fixed top-4 left-4 px-4 py-2 flex items-center gap-2 bg-white/80 backdrop-blur-sm 
          rounded-lg shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50 
          transition-all duration-300"
      >
        ← Back to Home
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Swasthya 2.0</h1>
          <p className="text-xl text-gray-600">Revolutionizing Healthcare with Ayurveda</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Swasthya 2.0 is dedicated to bridging the gap between traditional Ayurvedic wisdom and modern technology.
            We believe in promoting holistic health through personalized dosha analysis, natural remedies, and
            accessible healthcare solutions.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Offer</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
            <li>Personalized Dosha Assessment through our interactive quiz</li>
            <li>Online Ayurvedic Consultations with certified practitioners</li>
            <li>Nearby Clinic Locator for traditional Ayurvedic treatments</li>
            <li>Virtual Ayurveda Garden with 3D plant models and information</li>
            <li>Symptom-based remedy recommendations</li>
            <li>Educational content about Ayurvedic principles and practices</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed">
            To create a world where everyone has access to personalized, preventive healthcare rooted in
            ancient wisdom, enhanced by cutting-edge technology. We envision a future where Ayurveda is
            not just a treatment method, but a way of life integrated seamlessly into modern healthcare systems.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Traditional Wisdom</h3>
            <p className="text-gray-600">
              Drawing from over 5,000 years of Ayurvedic knowledge, we provide time-tested solutions
              for modern health challenges.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Modern Technology</h3>
            <p className="text-gray-600">
              Leveraging AI, 3D visualization, and digital platforms to make Ayurveda accessible
              and personalized for everyone.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Holistic Approach</h3>
            <p className="text-gray-600">
              Addressing mind, body, and spirit through comprehensive health assessments and
              tailored recommendations.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Community Focus</h3>
            <p className="text-gray-600">
              Building a supportive community of health-conscious individuals committed to
              natural wellness practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
