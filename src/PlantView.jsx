// src/PlantView.jsx
import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, Environment, Line } from "@react-three/drei";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";

function PlantModel({ modelPath, scale = 0.2, slug }) {
  const { scene } = useGLTF(modelPath);
  const position = slug === "neem" ? [0, -15, 0] : [0, -1, 0];
  const rotation = [0, Math.PI, 0];
  return <primitive object={scene} scale={scale} position={position} rotation={rotation} />;
}

export default function PlantView() {
  const { slug } = useParams();
  const [selectedPart, setSelectedPart] = useState(null);

  const models = {
    neem: "/models/plants/neem-compressed.glb",
    ashwagandha: "/models/plants/ashwagandha_compressed.glb",
    tulsi: "/models/plants/tulsi_compressed.glb",
    turmeric: "/models/plants/turmeric_bulb_compressed.glb",
    amla: "/models/plants/amla_compressed.glb",
    brahmi: "/models/plants/brahmi_compressed.glb",
  };

  const modelPath = models[slug] || models.neem;
  const scale = slug === "neem" ? 0.15 : 0.2;

  const isNeem = slug === "neem";
  const minDistance = isNeem ? 10 : 1;
  const maxDistance = isNeem ? 600 : 10;
  const cameraPosition = isNeem ? [0, 50, 600] : [0, 2, minDistance];
  const orbitTarget = isNeem ? [0, 50, 0] : [0, -1, 0];

  const plantLabels = {
    neem: [{ text: "Leaves", pos: [250, 100, 0], lineTo: [2, 100, 0] }],
    tulsi: [{ text: "Leaves", pos: [0, -0.6, 0], lineTo: [0, -0.9, 0] }],
    ashwagandha: [
      { text: "Leaves", pos: [0, -0.3, 0], lineTo: [0, -1, 0] },
      { text: "Fruit", pos: [0.4, -0.3, 0], lineTo: [0.1, -1, 0] },
    ],
    turmeric: [{ text: "Rhizome", pos: [0, -0.6, 0], lineTo: [0, -1, 0] }],
    amla: [
      { text: "Leaves", pos: [0, -0.7, 0], lineTo: [0, -1, 0] },
      { text: "Fruit", pos: [0.5, -0.9, 0.3], lineTo: [0.1, -1, 0] },
    ],
    brahmi: [
      { text: "Leaves", pos: [0, -0.7, 0], lineTo: [0, -1, 0] },
      { text: "Flower", pos: [-0.4, -0.9, 0], lineTo: [-0.1, -1, -0.1] },
    ],
  };

  const medicinalInfo = {
    neem: {
      Leaves: {
        commonName: "Neem",
        sanskritName: "Nimba (निंब)",
        scientificName: "Azadirachta indica",
        family: "Meliaceae",
        partUsed: "Leaves",
        activeConstituents:
          "Azadirachtin, Nimbin, Nimbidin, Nimbidol, Gedunin, Quercetin, and Salannin.",
        doshaEffect: "Balances Pitta and Kapha; may aggravate Vata if overused.",
        benefits:
          "Antibacterial, antiviral, antifungal, anti-inflammatory, blood purifier, detoxifier, and immune stimulant.",
        traditionalUses:
          "Used in skin diseases, liver disorders, oral care, and fever management. Decoctions are used for washing wounds and treating acne.",
        pharmacologicalActions:
          "Anti-inflammatory, hepatoprotective, antioxidant, immunomodulatory, antiulcer, hypoglycemic.",
        modernResearch:
          "Studies show neem compounds inhibit bacterial biofilms and support hepatic enzyme function.",
        formulations:
          "Used in Neem oil, Nimbadi Churna, Nimbadi Taila, and Neem Capsules.",
        cautions:
          "Avoid during pregnancy and lactation. Prolonged use can cause gastrointestinal irritation.",
      },
    },

    turmeric: {
      Rhizome: {
        commonName: "Turmeric",
        sanskritName: "Haridra (हरिद्रा)",
        scientificName: "Curcuma longa",
        family: "Zingiberaceae",
        partUsed: "Rhizome",
        activeConstituents:
          "Curcumin, Demethoxycurcumin, Bisdemethoxycurcumin, and volatile oils.",
        doshaEffect: "Balances all three Doshas (Tridoshahara), especially Kapha and Pitta.",
        benefits:
          "Powerful anti-inflammatory, antioxidant, liver tonic, blood purifier, and wound healer.",
        traditionalUses:
          "Used for joint pain, respiratory conditions, skin disorders, and digestive problems. Applied externally for wound healing.",
        pharmacologicalActions:
          "Anticancer, hepatoprotective, neuroprotective, antimicrobial, hypolipidemic.",
        modernResearch:
          "Curcumin is proven to modulate inflammatory pathways and oxidative stress responses.",
        formulations: "Haridra Khanda, Curcumin Extract, Turmeric Milk (Haldi Doodh).",
        cautions: "Avoid in gallstone disease and with anticoagulant medications.",
      },
    },

    tulsi: {
      Leaves: {
        commonName: "Tulsi (Holy Basil)",
        sanskritName: "Tulasi (तुलसी)",
        scientificName: "Ocimum sanctum",
        family: "Lamiaceae",
        partUsed: "Leaves",
        activeConstituents: "Eugenol, Ursolic acid, Linalool, and Rosmarinic acid.",
        doshaEffect: "Balances Kapha and Vata; mildly increases Pitta.",
        benefits:
          "Immunity booster, antitussive, antipyretic, antimicrobial, and adaptogenic.",
        traditionalUses:
          "Used in respiratory infections, cold, cough, and as a stress reliever. Worshipped and used in daily Ayurvedic regimens.",
        pharmacologicalActions:
          "Antioxidant, neuroprotective, cardioprotective, hypoglycemic, antifungal.",
        modernResearch:
          "Tulsi extracts improve cortisol regulation and reduce oxidative stress markers.",
        formulations:
          "Tulsi Ark, Panch Tulsi Drops, and herbal teas containing Tulsi leaf extracts.",
        cautions: "Avoid excessive intake during pregnancy; may interfere with fertility.",
      },
    },

    ashwagandha: {
      Leaves: {
        commonName: "Ashwagandha",
        sanskritName: "Ashwagandha (अश्वगंधा)",
        scientificName: "Withania somnifera",
        family: "Solanaceae",
        partUsed: "Leaves",
        activeConstituents: "Withanolides, Withaferin A, Alkaloids, and Saponins.",
        doshaEffect: "Balances Vata and Kapha.",
        benefits:
          "Rejuvenative, adaptogenic, anti-stress, improves sleep, stamina, and strength.",
        traditionalUses:
          "Used in nervous exhaustion, insomnia, debility, infertility, and arthritis.",
        pharmacologicalActions:
          "Anti-anxiety, anti-inflammatory, anti-stress, thyroid-modulating.",
        modernResearch:
          "Clinical trials confirm Ashwagandha reduces cortisol levels and enhances male fertility.",
        formulations: "Ashwagandharishta, Chyawanprash, and Ashwagandha Capsules.",
        cautions: "Avoid during pregnancy; use cautiously in hyperthyroidism.",
      },
      Fruit: {
        commonName: "Ashwagandha",
        sanskritName: "Ashwagandha (अश्वगंधा)",
        scientificName: "Withania somnifera",
        family: "Solanaceae",
        partUsed: "Fruit",
        activeConstituents: "Withanolides, Sitoindosides, and Alkaloids.",
        doshaEffect: "Balances Vata and Kapha.",
        benefits:
          "Restorative tonic, rejuvenative, supports hormonal balance, and enhances vitality.",
        traditionalUses:
          "Used in formulations for stress relief and anti-aging in Ayurveda.",
        pharmacologicalActions:
          "Antioxidant, endocrine modulator, immunostimulant, neuroprotective.",
        modernResearch:
          "Withanolides have shown promising effects in neural regeneration studies.",
        formulations: "Ashwagandha Rasayana, Medhya Rasayanas.",
        cautions: "Use under medical supervision for endocrine disorders.",
      },
    },

    amla: {
      Leaves: {
        commonName: "Amla (Indian Gooseberry)",
        sanskritName: "Amalaki (आमलकी)",
        scientificName: "Phyllanthus emblica",
        family: "Phyllanthaceae",
        partUsed: "Leaves",
        activeConstituents: "Ascorbic acid, Ellagic acid, Gallic acid, and Polyphenols.",
        doshaEffect: "Balances all three Doshas (Tridoshahara).",
        benefits: "Antioxidant, digestive, rejuvenative, and anti-inflammatory.",
        traditionalUses:
          "Used in digestion, liver health, and as a cooling tonic for the eyes and skin.",
        pharmacologicalActions:
          "Antioxidant, hepatoprotective, antiulcer, hypolipidemic, immunomodulatory.",
        modernResearch:
          "Amla extract shows hepatoprotective and cholesterol-lowering activity.",
        formulations: "Triphala, Chyawanprash, and Amla Juice.",
        cautions: "Generally safe; avoid overconsumption in cold weather due to cooling nature.",
      },
      Fruit: {
        commonName: "Amla (Indian Gooseberry)",
        sanskritName: "Amalaki (आमलकी)",
        scientificName: "Phyllanthus emblica",
        family: "Phyllanthaceae",
        partUsed: "Fruit",
        activeConstituents: "Vitamin C, Tannins, Flavonoids, and Polyphenols.",
        doshaEffect: "Balances all three Doshas.",
        benefits: "Rejuvenative, antioxidant, and immunity booster.",
        traditionalUses:
          "Used for skin, hair, and digestive health. Core ingredient in Chyawanprash.",
        pharmacologicalActions:
          "Antioxidant, adaptogenic, immunomodulatory, anti-aging.",
        modernResearch:
          "Clinical studies confirm strong free-radical scavenging activity.",
        formulations: "Amla Juice, Chyawanprash, Triphala.",
        cautions: "Safe for regular use; may lower blood sugar in diabetics.",
      },
    },

    brahmi: {
      Leaves: {
        commonName: "Brahmi",
        sanskritName: "Brahmi (ब्राह्मी)",
        scientificName: "Bacopa monnieri",
        family: "Plantaginaceae",
        partUsed: "Leaves",
        activeConstituents: "Bacosides A & B, Alkaloids, Saponins, and Sterols.",
        doshaEffect: "Balances Vata and Pitta.",
        benefits: "Memory enhancer, calming, anti-anxiety, antioxidant.",
        traditionalUses:
          "Used for memory, concentration, epilepsy, and stress reduction.",
        pharmacologicalActions:
          "Nootropic, antioxidant, neuroprotective, anti-inflammatory.",
        modernResearch:
          "Clinical studies support improved memory retention and reduced anxiety.",
        formulations: "Brahmi Ghrita, Saraswatarishta, Brahmi Tablets.",
        cautions: "May cause mild nausea in high doses; avoid during pregnancy.",
      },
      Flower: {
        commonName: "Brahmi",
        sanskritName: "Brahmi (ब्राह्मी)",
        scientificName: "Bacopa monnieri",
        family: "Plantaginaceae",
        partUsed: "Flower",
        activeConstituents: "Bacosides, Flavonoids, and Saponins.",
        doshaEffect: "Balances Pitta.",
        benefits: "Supports cognition, calms the nervous system, reduces mental fatigue.",
        traditionalUses: "Used in formulations for mental clarity and longevity.",
        pharmacologicalActions: "Antioxidant, adaptogenic, neuroprotective.",
        modernResearch:
          "Bacopa flower extract shows potential in reducing oxidative brain damage.",
        formulations: "Brahmi Rasayana, Medhya Rasayanas.",
        cautions: "Generally safe; use moderately in cold seasons.",
      },
    },
  };

  const selectedData = selectedPart && medicinalInfo[slug]?.[selectedPart];

  return (
    <div className="w-screen h-screen bg-[#00aef00d] flex flex-col relative">
      <Navbar />
      <div className="h-20"></div>

      <Canvas camera={{ position: cameraPosition, fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <Environment preset="forest" background={false} />

        <Suspense
          fallback={
            <Html center>
              <div className="text-green-700 font-bold text-xl">Loading {slug}…</div>
            </Html>
          }
        >
          <PlantModel modelPath={modelPath} scale={scale} slug={slug} />
          {plantLabels[slug]?.map((label, i) => (
            <React.Fragment key={i}>
              <Html position={label.pos}>
                <div
                  className="bg-[#2F6B3A]/90 px-3 py-1 rounded text-sm font-semibold text-white shadow cursor-pointer hover:bg-green-800 transition"
                  onClick={() => setSelectedPart(label.text)}
                >
                  {label.text}
                </div>
              </Html>
              <Line points={[label.pos, label.lineTo]} color="green" lineWidth={2} />
            </React.Fragment>
          ))}
        </Suspense>

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          target={orbitTarget}
          minDistance={minDistance}
          maxDistance={maxDistance}
        />
      </Canvas>

      <AnimatePresence>
        {selectedData && (
          <motion.div
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 200 }}
            transition={{ duration: 0.6 }}
            className="absolute top-24 left-8 w-[420px] max-h-[80vh] overflow-y-auto p-6 
           bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-lg 
           z-50 scrollbar-thin scrollbar-thumb-green-400 text-white"

          >
            <button
              className="absolute top-3 right-4 text-green-700 text-xl hover:text-red-600"
              onClick={() => setSelectedPart(null)}
            >
              ✖
            </button>

            <h2 className="text-2xl font-extrabold text-green-900 mb-4">
              {selectedData.commonName} – {selectedData.partUsed}
            </h2>

            <div className="text-sm text-gray-800 leading-relaxed space-y-2">
              <p><span className="font-semibold">Sanskrit Name:</span> {selectedData.sanskritName}</p>
              <p><span className="font-semibold">Scientific Name:</span> <em>{selectedData.scientificName}</em></p>
              <p><span className="font-semibold">Family:</span> {selectedData.family}</p>
              <p><span className="font-semibold">Part Used:</span> {selectedData.partUsed}</p>
              <p><span className="font-semibold">Active Constituents:</span> {selectedData.activeConstituents}</p>
              <p><span className="font-semibold">Dosha Effect:</span> {selectedData.doshaEffect}</p>
              <p><span className="font-semibold">Medicinal Benefits:</span> {selectedData.benefits}</p>
              <p><span className="font-semibold">Traditional Uses:</span> {selectedData.traditionalUses}</p>
              <p><span className="font-semibold">Pharmacological Actions:</span> {selectedData.pharmacologicalActions}</p>
              <p><span className="font-semibold">Modern Research:</span> {selectedData.modernResearch}</p>
              <p><span className="font-semibold">Common Formulations:</span> {selectedData.formulations}</p>
              <p><span className="font-semibold">Cautions:</span> {selectedData.cautions}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
