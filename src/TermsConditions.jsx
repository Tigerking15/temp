import React from "react";
import { FileText, Users, Shield, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Add FloatingBackButton component
const FloatingBackButton = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate("/Home")}
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

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <FloatingBackButton />

      <div className="pt-20 pb-12 px-6 md:px-12 w-full mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <FileText className="text-primary" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                <Users size={24} />
                Acceptance of Terms
              </h2>
              <p className="text-gray-700">
                By accessing and using Swasthya, you accept and agree to be bound by the terms
                and provision of this agreement. If you do not agree to abide by the above,
                please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Use License</h2>
              <p className="text-gray-700 mb-4">
                Permission is granted to temporarily use Swasthya for personal, non-commercial
                transitory viewing only. This is the grant of a license, not a transfer of title,
                and under this license you may not:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software</li>
                <li>Remove any copyright or other proprietary notations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                <Shield size={24} />
                User Responsibilities
              </h2>
              <p className="text-gray-700 mb-4">
                As a user of our platform, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Use the service only for lawful purposes</li>
                <li>Not interfere with the proper functioning of the platform</li>
                <li>Respect the privacy and rights of other users</li>
                <li>Not share your account credentials with others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Medical Disclaimer</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex items-start">
                  <AlertTriangle className="text-yellow-400 mr-2 mt-1" size={20} />
                  <div>
                    <p className="text-yellow-800 font-semibold">Important Notice</p>
                    <p className="text-yellow-700">
                      The information provided on Swasthya is for educational and informational purposes only.
                      It is not intended as a substitute for professional medical advice, diagnosis, or treatment.
                      Always seek the advice of your physician or other qualified health provider.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-700">
                We do not guarantee the accuracy, completeness, or usefulness of any information
                provided on our platform. Use of this service is at your own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Account Termination</h2>
              <p className="text-gray-700">
                We may terminate or suspend your account and bar access to the service immediately,
                without prior notice or liability, under our sole discretion, for any reason whatsoever
                and without limitation, including but not limited to a breach of the Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Limitation of Liability</h2>
              <p className="text-gray-700">
                In no event shall Swasthya or its suppliers be liable for any damages (including,
                without limitation, damages for loss of data or profit, or due to business interruption)
                arising out of the use or inability to use the materials on our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Governing Law</h2>
              <p className="text-gray-700">
                These terms and conditions are governed by and construed in accordance with the laws
                of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that state.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                If a revision is material, we will try to provide at least 30 days notice prior to any new
                terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">Contact Information</h2>
              <p className="text-gray-700">
                If you have any questions about these Terms & Conditions, please contact us:
              </p>
              <div className="bg-primary/5 p-4 rounded-lg mt-4">
                <p className="text-primary font-semibold">Email: legal@swasthya.com</p>
                <p className="text-primary font-semibold">Phone: +91 98765 43210</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
