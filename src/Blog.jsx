import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Add this import

const Blog = () => {
  const navigate = useNavigate(); // Add this hook
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activePost, setActivePost] = useState(null);

  const blogPosts = [
    {
      id: 1,
      title: "Understanding Your Dosha: The Key to Ayurvedic Balance",
      excerpt: "Learn how identifying your dominant dosha can transform your approach to health and wellness.",
      category: "dosha",
      date: "2024-01-15",
      readTime: "6 min read",
      image: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800",
      content: `Ayurveda divides the human constitution into three fundamental energies – Vata, Pitta, and Kapha – collectively called doshas. Each person has a unique combination of these, known as their Prakriti. 

Vata governs movement, creativity, and flexibility; Pitta controls digestion, metabolism, and intelligence; Kapha oversees structure, immunity, and calmness. Imbalance among these energies leads to physical or mental discomfort.

For instance, an excessive Vata can cause anxiety or insomnia, while excess Pitta may lead to irritability and acidity. Kapha imbalance often results in lethargy and congestion. By identifying your dominant dosha, you can align diet, exercise, and routine to restore harmony.

Practices such as eating warm foods for Vata, cooling herbs for Pitta, and stimulating routines for Kapha help maintain equilibrium. Ayurveda’s holistic approach recognizes that true wellness lies in understanding yourself – your dosha, your rhythm, and your nature.

This knowledge empowers you to tailor your lifestyle: the right foods, daily routine, herbal support, and mindful practices all work together to create balance. Over time, you’ll notice improved digestion, steadier moods, better sleep, and a stronger sense of vitality.`
    },
    {
      id: 2,
      title: "Top 10 Medicinal Plants in Ayurveda",
      excerpt: "Discover the healing properties of traditional Ayurvedic herbs and their modern applications.",
      category: "plants",
      date: "2024-01-12",
      readTime: "7 min read",
      image: "https://images.pexels.com/photos/7087771/pexels-photo-7087771.jpeg?auto=compress&cs=tinysrgb&w=800",
      content: `Ayurveda’s treasure lies in its herbal pharmacopoeia – a system of healing drawn from nature’s abundant gifts.

Here are ten renowned plants still central to modern Ayurvedic medicine:

1. Ashwagandha (Indian Ginseng) – reduces stress, supports hormonal balance, and enhances energy levels.  
2. Tulsi (Holy Basil) – detoxifies the body, supports lung health, and boosts immunity.  
3. Amla (Indian Gooseberry) – rich in Vitamin C, rejuvenates tissues, improves digestion and promotes hair growth.  
4. Turmeric (Haldi) – anti-inflammatory, antioxidant and supports joint and skin health.  
5. Brahmi – supports cognitive function, focus, and memory.  
6. Neem – natural detoxifier and skin healer used for centuries in Ayurveda.  
7. Triphala – a blend supporting digestion, metabolism and gut cleansing.  
8. Guggul – helps improve circulation and supports healthy cholesterol levels.  
9. Shatavari – a tonic for female reproductive health and hormonal balance.  
10. Licorice (Mulethi) – soothes the throat and enhances immunity.

Integrating these plants into teas, powders or simply including them in your diet promotes vitality and inner balance. Modern research is confirming many of these benefits. By choosing herbs wisely and consistently, you honour the ancient science and support your own healing journey.`
    },
    {
      id: 3,
      title: "Seasonal Eating: Aligning Your Diet with Nature’s Rhythm",
      excerpt: "How to adjust your nutrition according to seasons for optimal health and digestion.",
      category: "nutrition",
      date: "2024-01-10",
      readTime: "6 min read",
      image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
      content: `Ayurveda teaches that nature’s cycles influence our internal balance – making seasonal eating a cornerstone of holistic health.

Spring (Kapha Season) – favour light, warm foods like soups, steamed vegetables, and spices such as ginger and black pepper. Avoid too much dairy and sweets which increase sluggishness.  
Summer (Pitta Season) – choose cooling foods like cucumber, coconut water, leafy greens. Avoid overly spicy, salty or fried foods which aggravate Pitta.  
Autumn/Winter (Vata Season) – opt for warm, cooked meals such as khichdi, ghee, root vegetables. Use herbs like cinnamon and cardamom for grounding effect.

When your diet flows with nature’s rhythm, your digestion strengthens, immunity rises and your mind feels aligned. Ayurveda calls this “Ritucharya” – eating and living in harmony with the season. Understanding this alignment empowers you to adapt your diet and lifestyle, leading to deeper wellbeing, better resilience and a more vibrant life.`
    },
    {
      id: 4,
      title: "The Science Behind Ayurvedic Medicine",
      excerpt: "Exploring the scientific evidence supporting traditional Ayurvedic practices.",
      category: "science",
      date: "2024-01-08",
      readTime: "8 min read",
      image: "https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=800",
      content: `Ayurveda, once viewed as an ancient art, is now gaining recognition in scientific communities worldwide. Research increasingly validates its preventive and personalised approach to health.

Modern pharmacology finds that many Ayurvedic herbs contain bioactive compounds with measurable therapeutic effects. For example, curcumin from turmeric exhibits anti-inflammatory properties whilst Ashwagandha reduces cortisol and enhances resilience.

Neuroscience supports mindfulness and meditation – both central to Ayurveda – for stress reduction and cognitive balance. Detoxification therapies like Panchakarma show benefits in reducing oxidative stress markers.

What sets Ayurveda apart is its systems-approach – focusing on root causes rather than isolated symptoms. It views health as dynamic equilibrium among mind, body & environment – a principle that Western science is only now beginning to rediscover.

This growing synergy between tradition and research opens up new pathways. For practitioners and individuals alike, it means Ayurvedic insights are not just philosophical but increasingly evidence-based.`
    },
    {
      id: 5,
      title: "Daily Routines for Optimal Health (Dinacharya)",
      excerpt: "Learn about Ayurvedic daily routines that promote longevity and wellbeing.",
      category: "lifestyle",
      date: "2024-01-05",
      readTime: "6 min read",
      image: "https://images.pexels.com/photos/3823054/pexels-photo-3823054.jpeg?auto=compress&cs=tinysrgb&w=800",
      content: `Dinacharya – the Ayurvedic daily regimen – is a rhythmic discipline that keeps body and mind aligned with nature’s clock.

Morning Rituals – wake before sunrise, cleanse the mouth and tongue, drink warm water and practise gentle yoga or meditation.  
Midday Focus – eat your heaviest meal when digestion is strongest (around noon). Include warm, fresh foods and avoid distractions while eating.  
Evening Wind-down – engage in calming activities, take a light dinner, digital detox before 9PM, and sleep early to support cellular repair.

Following Dinacharya stabilises digestion, mental clarity and energy levels. Modern chronobiology confirms this ancient wisdom – your body truly thrives when it follows the sun and cycles. By embracing these routines you build a foundation for lasting health and wellbeing.`
    },
    {
      id: 6,
      title: "Managing Stress Through Ayurvedic Practices",
      excerpt: "Natural techniques to reduce stress and promote mental clarity using Ayurveda.",
      category: "wellness",
      date: "2024-01-03",
      readTime: "5 min read",
      image: "https://images.pexels.com/photos/3822625/pexels-photo-3822625.jpeg?auto=compress&cs=tinysrgb&w=800",
      content: `Ayurveda identifies stress as an imbalance in Vata – the principle of movement. When Vata is disturbed, the mind becomes restless and the body tense.

To restore calm, Ayurveda recommends grounding practices:  
Abhyanga (Oil Massage) – warm sesame oil calms the nervous system and enhances sleep quality.  
Herbs – adaptogens like Ashwagandha and Brahmi soothe anxiety and boost focus.  
Meditation & Breathwork – deep breathing and mantra recitation settle the racing mind.  
Diet – avoid caffeine & cold foods; opt for warm soups and herbal teas.

Incorporating these practices daily rewires your body’s stress response, showing that inner peace isn’t a luxury – it’s a discipline rooted in nature’s wisdom. Over time you’ll experience more clarity of mind, a calmer temperament, improved sleep and a stronger sense of presence.`
    }
  ];

  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'dosha', name: 'Dosha' },
    { id: 'plants', name: 'Medicinal Plants' },
    { id: 'nutrition', name: 'Nutrition' },
    { id: 'science', name: 'Science' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'wellness', name: 'Wellness' }
  ];

  const filteredPosts =
    selectedCategory === 'all'
      ? blogPosts
      : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-6">
      {/* Add back button */}
      <button
        onClick={() => navigate('/Home')}
        className="fixed top-4 left-4 px-4 py-2 flex items-center gap-2 bg-white/80 backdrop-blur-sm 
          rounded-lg shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50 
          transition-all duration-300 z-50"
      >
        <span aria-hidden="true">←</span>
        <span>Back to Home</span>
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-2">Ayurvedic Blog</h1>
          <p className="text-lg text-gray-700">Insights, Tips, and Wisdom from the World of Ayurveda 🌿</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-green-600 text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-green-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <motion.article
              key={post.id}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
              onClick={() => setActivePost(post)}
            >
              <img src={post.image} alt={post.title} className="h-48 w-full object-cover" />
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span className="capitalize">{post.category}</span>
                  <span className="mx-2">•</span>
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-xl font-semibold text-green-800 mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-3">{post.excerpt}</p>
                <span className="text-green-600 font-semibold hover:text-green-700">Read More →</span>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <AnimatePresence>
          {activePost && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl p-8 max-w-4xl mx-4 shadow-2xl relative overflow-y-auto max-h-[90vh] w-full lg:w-3/4"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <button
                  onClick={() => setActivePost(null)}
                  className="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl"
                >
                  ×
                </button>
                <h2 className="text-2xl font-bold text-green-700 mb-4">{activePost.title}</h2>
                <img src={activePost.image} alt={activePost.title} className="rounded-lg mb-4 w-full h-64 object-cover" />
                <p className="text-gray-700 whitespace-pre-line">{activePost.content}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Blog;
