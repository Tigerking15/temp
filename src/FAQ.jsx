import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

// Add back button component
const FloatingBackButton = () => {
  const navigate = useNavigate();
  
  return (
    <motion.button
      onClick={() => navigate('/Home')}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className="fixed top-4 left-4 px-4 py-2 flex items-center gap-2 
        bg-white/80 backdrop-blur-sm rounded-lg shadow-lg 
        border border-gray-200 text-gray-700 hover:bg-gray-50 
        transition-all duration-300 z-50"
    >
      <span aria-hidden="true">←</span>
      <span>Back to Home</span>
    </motion.button>
  );
};

// Add these animation variants
const accordionVariants = {
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      mass: 0.8,
    }
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      mass: 0.8,
    }
  }
};

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const navigate = useNavigate();

  const faqs = [
    {
      question: "What is Ayurveda?",
      answer: "Ayurveda is an ancient Indian system of medicine that emphasizes holistic well-being by balancing mind, body, and spirit. It promotes preventive care through natural remedies, herbs, diet, and daily routines."
    },
    {
      question: "What are the three doshas?",
      answer: "Ayurveda identifies three doshas — Vata (air + space), Pitta (fire + water), and Kapha (earth + water). Each individual has a unique balance of these energies, influencing personality, health, and lifestyle."
    },
    {
      question: "How does the dosha quiz work?",
      answer: "Our quiz analyzes your habits, preferences, and body type to determine your dominant dosha. Based on your results, you’ll receive personalized lifestyle and wellness recommendations."
    },
    {
      question: "Are Ayurvedic treatments safe?",
      answer: "When guided by certified practitioners, Ayurvedic treatments are safe and effective. Always consult a qualified expert before starting herbal supplements or therapies."
    },
    {
      question: "How can I find nearby Ayurvedic clinics?",
      answer: "You can use our ‘Nearby Clinics’ feature to explore verified Ayurvedic centers, filter by location or services, and connect directly with trusted practitioners."
    },
    {
      question: "What is the virtual Ayurveda garden?",
      answer: "Our virtual Ayurveda garden lets you explore medicinal plants in an interactive environment, learn about their traditional uses, and understand their role in natural healing."
    },
    {
      question: "What is Panchakarma therapy?",
      answer: "Panchakarma is Ayurveda's primary purification and detoxification treatment. It includes five therapeutic treatments: Vamana (therapeutic emesis), Virechana (therapeutic purgation), Basti (therapeutic enema), Nasya (nasal medication), and Raktamokshana (blood letting)."
    },
    {
      question: "How does Ayurveda view seasonal changes?",
      answer: "Ayurveda recognizes six seasons (Ritucharya) and recommends specific dietary and lifestyle modifications for each to maintain optimal health and prevent seasonal diseases."
    },
    {
      question: "What is the significance of 'Dinacharya' in Ayurveda?",
      answer: "Dinacharya refers to daily routines in Ayurveda. It includes practices like tongue scraping, oil pulling, self-massage (abhyanga), and specific timing for meals to maintain health and prevent disease."
    },
    {
      question: "Can Ayurveda help with mental health?",
      answer: "Yes, Ayurveda offers comprehensive approaches to mental health through meditation, specific herbs (like Brahmi and Ashwagandha), lifestyle modifications, and stress-reduction techniques."
    },
    {
      question: "What is 'Prakriti' in Ayurveda?",
      answer: "Prakriti is your unique mind-body constitution determined at birth. It's a combination of the three doshas (Vata, Pitta, Kapha) and influences your physical and mental characteristics."
    },
    {
      question: "How important is meditation in Ayurvedic practice?",
      answer: "Meditation is crucial in Ayurveda for maintaining mental balance, reducing stress, and promoting overall wellness. It's often prescribed alongside other treatments for holistic healing."
    },
    {
      question: "What is the role of massage in Ayurvedic treatment?",
      answer: "Ayurvedic massage (Abhyanga) uses specific oils and techniques to improve circulation, remove toxins, reduce stress, and balance the doshas. Different oils are chosen based on your constitution."
    },
    {
      question: "Are there any side effects of Ayurvedic medicines?",
      answer: "While Ayurvedic medicines are generally safe, some herbs may have side effects or interact with conventional medicines. It's important to consult qualified practitioners and inform them about any ongoing medications."
    },
    {
      question: "What is the concept of Agni in Ayurveda?",
      answer: "Agni refers to the digestive fire responsible for metabolism. Strong Agni is crucial for proper digestion and absorption of nutrients. Weak Agni can lead to the formation of ama (toxins)."
    },
    {
      question: "How does Ayurveda approach weight management?",
      answer: "Ayurveda addresses weight management through personalized diet plans, herbs, exercise routines, and lifestyle modifications based on your body constitution and specific imbalances."
    },
    {
      question: "What is the importance of proper food combinations in Ayurveda?",
      answer: "Ayurveda emphasizes proper food combinations as they affect digestion and nutrient absorption. Certain combinations are considered incompatible (virudh aahar) and should be avoided."
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add this optimization for smooth scrolling
  const scrollConfig = {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1] // Custom ease curve for smoother animation
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <FloatingBackButton />
      
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Page Header */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight"
          >
            Frequently Asked Questions
          </motion.h1>
          <p className="text-lg text-gray-600 mt-3">
            Your guide to Ayurveda, wellness, and our services
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-10">
          <input
            type="text"
            placeholder="Search your question..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200 focus:ring-2 focus:ring-green-400 focus:outline-none transition"
          />
        </div>

        {/* FAQ Cards */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                layout // Add this for smoother container resizing
                layoutRoot // Add this to prevent child re-render
              >
                <motion.button
                  className="w-full px-6 py-4 text-left flex items-center justify-between"
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  layout
                >
                  <span className="font-medium">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: expandedFAQ === index ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  </motion.div>
                </motion.button>

                <AnimatePresence mode="wait">
                  {expandedFAQ === index && (
                    <motion.div
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={accordionVariants}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-gray-600">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredFAQs.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No FAQs found matching your search.</p>
          </div>
        )}

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg mt-16 p-10 text-center border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6">
            Our team is here to help you find the right Ayurvedic guidance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/contact"
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-all duration-200 shadow-sm"
            >
              Contact Us
            </a>
            <a
              href="/help"
              className="bg-white text-green-700 border border-green-600 px-6 py-3 rounded-xl font-medium hover:bg-green-50 transition-all duration-200"
            >
              Visit Help Center
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
