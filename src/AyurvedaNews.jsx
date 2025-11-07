import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const AyurvedaNews = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const cached = localStorage.getItem("ayurvedaNews");
    if (cached) {
      setNews(JSON.parse(cached));
      return;
    }

    const fetchNews = async () => {
      try {
        const res = await fetch(
          `https://temp-2qik.onrender.com/news`
        );
        const data = await res.json();
        setNews(data.articles || []);
        localStorage.setItem("ayurvedaNews", JSON.stringify(data.articles || []));
      } catch (err) {
        console.error("Error fetching news:", err);
      }
    };

    fetchNews();
  }, []);

  const duplicatedNews = [...news, ...news];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto overflow-hidden mt-8">
      <div className="relative h-80 overflow-hidden">
        <motion.div
          className="flex flex-col space-y-4"
          animate={{ y: ["0%", "-50%"] }}
          transition={{
            duration: 40,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {duplicatedNews.map((article, index) => (
            <div
              key={index}
              className="p-4 border-b border-gray-200 hover:bg-green-50 transition rounded-xl"
            >
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lg text-green-800 hover:underline"
              >
                {article.title}
              </a>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {article.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AyurvedaNews;
