import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCultures, searchCultures, getRegions } from "@/api";
import { Culture } from "@/types";
import CultureCard from "@/components/CultureCard";
import SearchBar from "@/components/SearchBar";

const Cultures: React.FC = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [filteredCultures, setFilteredCultures] = useState<Culture[]>([]);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regions, setRegions] = useState<string[]>([]);
  const navigate = useNavigate();

  
  useEffect(() => {
    const loadData = async () => {
      if (!isLoaded || !isSignedIn) return;
      
      setLoading(true);
      try {
        const [culturesData, regionsData] = await Promise.all([
          getCultures(),
          getRegions()
        ]);
        
        setCultures(culturesData);
        setFilteredCultures(culturesData);
        setRegions(regionsData);
      } catch (err: any) {
        setError(err.message ?? "Failed to load ancient knowledge");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [isLoaded, isSignedIn]);

  
  useEffect(() => {
    const applyFilters = async () => {
      if (!query && !region) {
        setFilteredCultures(cultures);
        return;
      }

      try {
        const data = await searchCultures(query, region);
        setFilteredCultures(data);
      } catch (err) {
        console.error("Filter error:", err);
      }
    };

    const timeoutId = setTimeout(applyFilters, 300);
    return () => clearTimeout(timeoutId);
  }, [query, region, cultures]);

  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/signin" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50 pt-24 pb-12 font-['Cormorant']">
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-amber-200 text-3xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              rotate: Math.random() * 360
            }}
            animate={{
              y: [0, -5, 0],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            {['𓀀', '𓁹', '𓃩', '𓅓', '𓆣', '𓈖', '𓉐', '𓊹'][Math.floor(Math.random() * 8)]}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        <motion.header
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="inline-block mb-6"
            animate={{
              rotate: [0, 3, -3, 0],
              y: [0, -3, 3, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center shadow-md border border-amber-200">
              <span className="text-2xl text-amber-600">𓃭</span>
            </div>
          </motion.div>
          
          <h1 className="text-4xl font-bold text-stone-800 mb-3">
            <span className="block">Chronicles of</span>
            <span className="relative inline-block">
              <span className="text-amber-600">Ancient Civilizations</span>
              <motion.span
                className="absolute bottom-0 left-0 w-full h-1 bg-amber-400"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.4 }}
              />
            </span>
          </h1>
          
          <motion.p
            className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Discover the rich heritage of ancient cultures that shaped our world
          </motion.p>
        </motion.header>

        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-md border border-stone-200 sticky top-24">
              <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Cultures
              </h3>
              
              <SearchBar 
                onSearch={setQuery} 
                onRegionChange={setRegion} 
              />
              
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-stone-600 mb-3">Quick Links</h4>
                <div className="space-y-3">
                  {cultures.slice(0, 4).map(culture => (
                    <motion.div
                      key={culture.id}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div 
                        onClick={() => navigate(`/cultures/${culture.slug}`)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-amber-50 cursor-pointer transition-colors"
                      >
                        <div className="w-10 h-10 rounded-md overflow-hidden border border-stone-200">
                          <img 
                            src={culture.gallery[0]?.url || '/placeholder.jpg'} 
                            alt={culture.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h5 className="font-medium text-stone-800">{culture.name}</h5>
                          <p className="text-xs text-stone-500">{culture.region}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          
          <div className="lg:col-span-3">
            {loading ? (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="inline-block h-14 w-14 rounded-full border-3 border-amber-500 border-t-transparent mb-5"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                />
                <p className="text-stone-600">
                  Loading ancient knowledge...
                </p>
              </motion.div>
            ) : error ? (
              <motion.div
                className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-stone-200 shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="mb-5">
                  <svg
                    className="w-14 h-14 text-amber-500 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <p className="text-stone-700 mt-3">{error}</p>
                </div>
                <motion.button
                  onClick={() => window.location.reload()}
                  className="
                    px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 
                    text-white rounded-lg hover:from-amber-600 hover:to-amber-700 
                    transition-all duration-300 shadow-sm font-medium
                    flex items-center gap-2 mx-auto
                  "
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Try Again
                </motion.button>
              </motion.div>
            ) : filteredCultures.length === 0 ? (
              <motion.div
                className="text-center py-16 bg-white/90 backdrop-blur-sm rounded-xl border border-stone-200 shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
                  <svg
                    className="w-8 h-8 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl text-stone-800 mb-2">
                  No results found
                </h3>
                <p className="text-stone-600 max-w-md mx-auto mb-5">
                  Try adjusting your search criteria
                </p>
                <motion.button
                  onClick={() => {
                    setQuery("");
                    setRegion("");
                  }}
                  className="
                    px-5 py-2
                    bg-stone-100
                    text-stone-700
                    rounded-lg
                    hover:bg-stone-200
                    transition-colors
                    border border-stone-200
                    text-sm
                  "
                  whileHover={{ scale: 1.03 }}
                >
                  Clear Filters
                </motion.button>
              </motion.div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <motion.h2 
                    className="text-xl font-semibold text-stone-800"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Showing {filteredCultures.length} civilizations
                  </motion.h2>
                </div>

                <motion.div
                  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.08 }}
                >
                  <AnimatePresence>
                    {filteredCultures.map((culture) => (
                      <motion.div
                        key={culture.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, type: "spring" }}
                        whileHover={{ y: -3 }}
                      >
                        <CultureCard culture={culture} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </>
            )}
          </div>
        </div>

        
        <motion.footer
          className="mt-16 text-center text-stone-500 text-sm max-w-2xl mx-auto px-4 border-t border-stone-200 pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Explore the rich tapestry of human history through ancient civilizations
        </motion.footer>
      </div>
    </div>
  );
};

export default Cultures;