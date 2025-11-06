import React, { useState } from "react";
import { HelpCircle, ChevronDown, Search, MessageCircle, Book, Settings, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HelpCenter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const navigate = useNavigate(); // for navigation

  const faqs = [
    {
      question: "How do I take the Dosha quiz?",
      answer: "Navigate to the Dosha page from the main menu and click 'Take Quiz'. Answer the questions honestly about your physical and mental characteristics. You'll receive your dosha type and personalized recommendations."
    },
    {
      question: "What is Ayurveda and how can it help me?",
      answer: "Ayurveda is an ancient Indian system of medicine that focuses on holistic wellness. It helps balance your body, mind, and spirit through natural remedies, diet, and lifestyle practices tailored to your unique constitution."
    },
    {
      question: "How do I find nearby clinics?",
      answer: "Use our 'Clinics' section to search for Ayurvedic practitioners in your area. You can filter by location, services offered, and ratings to find the best match for your needs."
    },
    {
      question: "Can I book online consultations?",
      answer: "Yes! Visit the 'Online Consultation' section to schedule virtual appointments with certified Ayurvedic practitioners. Choose your preferred time and receive personalized health guidance."
    },
    {
      question: "How do I use the Symptom Recommender?",
      answer: "Go to 'Remedy-Finder' and describe your symptoms. Our system will suggest natural herbal remedies and lifestyle changes based on Ayurvedic principles and your dosha type."
    },
    {
      question: "Is my personal information secure?",
      answer: "Absolutely. We use industry-standard encryption and security measures to protect your data. We never share your personal information without your explicit consent."
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white relative">

      {/* Floating Back Button - Privacy Policy Style */}
      <button
        onClick={() => navigate("/Home")}
        className="fixed top-4 left-4 px-4 py-2 flex items-center gap-2 
          bg-white/80 backdrop-blur-sm rounded-lg shadow-lg 
          border border-gray-200 text-gray-700 hover:bg-gray-50 
          transition-all duration-300 z-50"
      >
        <ArrowLeft size={20} /> Back to Home
      </button>

      <div className="pt-20 pb-12 px-6 md:px-12 w-full mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <HelpCircle className="text-primary" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
            Help Center
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions and get the help you need for your wellness journey.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Quick Help Options */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <MessageCircle size={24} />
                Contact Support
              </h3>
              <p className="text-gray-600 mb-4">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <a
                href="/contact"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition duration-200"
              >
                Get in Touch
              </a>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Book size={24} />
                User Guide
              </h3>
              <p className="text-gray-600 mb-4">
                Learn how to make the most of Swasthya with our comprehensive guides.
              </p>
              <button className="inline-block bg-primary/10 text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/20 transition duration-200">
                View Guides
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Settings size={24} />
                Account Help
              </h3>
              <p className="text-gray-600 mb-4">
                Issues with your account? Password reset, profile updates, and more.
              </p>
              <a
                href="/login"
                className="inline-block bg-primary/10 text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/20 transition duration-200"
              >
                Account Support
              </a>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-primary mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition duration-200"
                    >
                      <span className="font-semibold text-gray-900">{faq.question}</span>
                      <ChevronDown
                        size={20}
                        className={`text-gray-500 transform transition-transform duration-200 ${
                          expandedFAQ === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedFAQ === index && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {filteredFAQs.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No FAQs found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-primary/5 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Still Need Help?</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Our comprehensive knowledge base and community forums are great places to find more detailed information and connect with other users.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition duration-200">
              Browse Knowledge Base
            </button>
            <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold border border-primary hover:bg-primary/5 transition duration-200">
              Join Community
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
