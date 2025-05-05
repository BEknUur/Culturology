import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCultures, searchCultures } from "@/api";
import { Culture } from "@/types";
import CultureCard from "@/components/CultureCard";
import SearchBar from "@/components/SearchBar";

const Cultures: React.FC = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCultures = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = query || region
        ? await searchCultures(query, region)
        : await getCultures();

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format from server");
      }

      setCultures(data);
    } catch (err: any) {
      setError(err.message ?? "Error loading cultures");
      setCultures([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      loadCultures();
    }
  }, [query, region, isLoaded, isSignedIn]);

  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/signin" replace />;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 pt-24 pb-12 font-['Cormorant']"
      style={{
        backgroundImage: "url('/assets/parchment-texture.png')",
        backgroundBlendMode: "overlay"
      }}>
      <div className="container mx-auto max-w-6xl px-4 space-y-8">
        {/* Header Section */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-amber-900 md:text-5xl">
            <span className="block">Sacred Wisdom of</span>
            <span className="text-amber-700">Ancient Cultures</span>
          </h1>
          <p className="mt-4 text-lg text-amber-800/90 max-w-2xl mx-auto leading-relaxed italic">
            "Explore the diversity of traditions and communities from our ancestors"
          </p>
        </motion.div>

        {/* Search Bar Section */}
        <motion.div
          className="bg-white/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border-2 border-amber-200 max-w-3xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          whileHover={{ scale: 1.01 }}
        >
          <SearchBar onSearch={setQuery} onRegionChange={setRegion} />
        </motion.div>

        {/* Content Section */}
        <div className="mt-8">
          {loading ? (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="inline-block h-12 w-12 rounded-full border-4 border-amber-600 border-t-transparent animate-spin mb-4"></div>
              <p className="text-amber-800 text-lg italic">Consulting the ancient archives...</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              className="text-center py-12 bg-white/30 backdrop-blur-sm rounded-xl p-8 border-2 border-amber-200 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mb-6">
                <svg className="w-16 h-16 text-amber-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-amber-800 mt-4 text-lg">{error}</p>
              </div>
              <button
                onClick={loadCultures}
                className="
                  px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 
                  text-amber-100 rounded-lg hover:from-amber-500 hover:to-amber-600 
                  transition-all duration-300 shadow-md
                  font-medium
                  relative overflow-hidden
                  group
                "
              >
                <span className="relative z-10">Try Again</span>
                <span className="absolute inset-0 bg-amber-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </motion.div>
          ) : cultures.length === 0 ? (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-200/50 mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl text-amber-800 mb-2">No cultures found</h3>
              <p className="text-amber-800/80 max-w-md mx-auto italic">
                The scrolls are silent... Try different search terms
              </p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {cultures.map((culture) => (
                <motion.div
                  key={culture.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -5 }}
                >
                  <CultureCard culture={culture} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-amber-300/20 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              rotate: [0, 360]
            }}
            transition={{
              duration: Math.random() * 30 + 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Cultures;