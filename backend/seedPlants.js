// seedPlants.js
// Run with: node seedPlants.js
// Make sure: npm install axios
// If your backend uses auth, set API_URL and API_TOKEN env vars.

import axios from "axios";

const API_URL = process.env.API_URL || "https://swasthya2-0.onrender.com/api/plants/bulk?overwrite=true";

/**
 * 1️⃣ Models mapping (from your PlantView.jsx)
 */
const models = {
  neem: "/models/plants/neem-compressed.glb",
  ashwagandha: "/models/plants/ashwagandha_compressed.glb",
  tulsi: "/models/plants/tulsi_compressed.glb",
  turmeric: "/models/plants/turmeric_bulb_compressed.glb",
  amla: "/models/plants/amla_compressed.glb",
  brahmi: "/models/plants/brahmi_compressed.glb",
};

/**
 * 2️⃣ medicinalInfo data copied exactly from your PlantView.jsx
 */
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
      pharmacologicalActions: "Antioxidant, adaptogenic, immunomodulatory, anti-aging.",
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

/**
 * 3️⃣ Build backend payload
 */
function buildPayload(medicinalInfo) {
  const plants = [];

  for (const [slug, partsObj] of Object.entries(medicinalInfo)) {
    const firstPart = Object.values(partsObj)[0];
    const displayName = firstPart?.commonName || slug;

    const parts = {};
    for (const [partName, data] of Object.entries(partsObj)) {
      parts[partName] = { partUsed: partName, ...data };
    }

    plants.push({
      slug,
      displayName,
      modelPath: models[slug] || "",
      parts,
      tags: [],
    });
  }
  return plants;
}

/**
 * 4️⃣ Send data to backend
 */
async function seed() {
  const payload = buildPayload(medicinalInfo);
  console.log(`🚀 Seeding ${payload.length} plants...`);

  try {
    const response = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        // Uncomment next line if you use auth:
        // Authorization: `Bearer ${process.env.API_TOKEN}`
      },
    });
    console.log("✅ Seed success:", response.status, response.data);
  } catch (err) {
    console.error("❌ Seed failed:", err.response?.status, err.response?.data || err.message);
  }
}

seed();
