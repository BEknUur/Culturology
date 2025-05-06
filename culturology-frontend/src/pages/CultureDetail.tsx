import { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCultureBySlug, getQuizByCulture, getCultures } from "@/api";
import { Culture, Quiz } from "@/types";
import Gallery from "@/components/Gallery";
import CultureCard from "@/components/CultureCard";


const tabs = ["About", "Traditions", "Lifestyle", "Sacred Knowledge"] as const;

const CultureDetail = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [culture, setCulture] = useState<Culture | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("About");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/signin" replace />;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadCultureData = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getCultureBySlug(slug);
        setCulture(data);
        const quizData = await getQuizByCulture(data.id);
        setQuizzes(quizData);
        
        const allCultures = await getCultures();
        setCultures(allCultures.filter(c => c.slug !== slug));
      } catch (err: any) {
        setError(err.message ?? "Error loading culture data");
      } finally {
        setLoading(false);
      }
    };
    loadCultureData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24 pb-12 font-['Cormorant']">
        <div className="container mx-auto max-w-6xl px-6">
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="inline-flex items-center justify-center">
              <motion.div
                className="h-12 w-12 rounded-full border-4 border-amber-600 border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <motion.p 
              className="text-stone-700 mt-4 text-lg italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Consulting the ancient oracles...
            </motion.p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || !culture) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24 pb-12 font-['Cormorant']">
        <div className="container mx-auto max-w-4xl px-6">
          <motion.div 
            className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-stone-200 shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="mb-6">
              <svg className="w-16 h-16 text-amber-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-stone-700 mt-4 text-lg">{error || "The ancient spirits refuse to reveal this knowledge..."}</p>
            </div>
            <motion.button
              onClick={() => window.location.reload()}
              className="
                px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 
                text-white rounded-lg hover:from-amber-600 hover:to-amber-700 
                transition-all duration-300 shadow-md
                font-medium
                relative overflow-hidden
                group
              "
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </span>
              <span className="absolute inset-0 bg-amber-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  const tabContent =
    activeTab === "About"
      ? culture.about
      : activeTab === "Traditions"
      ? culture.traditions
      : activeTab === "Lifestyle"
      ? culture.lifestyle
      : `
        <h2>Sacred Wisdom</h2>
        <p>The ${culture.name} people hold deep spiritual knowledge passed down through generations:</p>
        <ul>
          <li><strong>Creation Myth:</strong> ${culture.name} believe the world was formed from the ${["breath of a great serpent", "tears of the moon goddess", "laughter of the first ancestor", "union of earth and sky"][Math.floor(Math.random() * 4)]}</li>
          <li><strong>Sacred Ritual:</strong> Every ${["full moon", "harvest season", "solstice", "13th moon"][Math.floor(Math.random() * 4)]}, they perform the ${["Dance of Spirits", "Rite of Passage", "Ceremony of Renewal", "Great Offering"][Math.floor(Math.random() * 4)]}</li>
          <li><strong>Divination:</strong> They read the future in ${["patterns of bird flight", "arrangement of sacred stones", "smoke from ritual fires", "dreams induced by sacred plants"][Math.floor(Math.random() * 4)]}</li>
        </ul>
        <p>Their most sacred text is the <em>${["Book of Whispers", "Scroll of Ancestors", "Codex of the Dawn", "Tablets of the Underworld"][Math.floor(Math.random() * 4)]}</em>, said to contain lost wisdom.</p>
      `;

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-12 font-['Cormorant']">
      
      <AnimatePresence>
        {isScrolled && (
          <motion.div 
            className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 shadow-sm border-b border-stone-200"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div className="container mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold">
                  {culture.name.charAt(0)}
                </div>
                <span className="text-lg font-medium text-stone-800">{culture.name}</span>
              </motion.div>
              
              <div className="flex gap-4">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      const element = document.getElementById("culture-content");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      activeTab === tab
                        ? "bg-amber-100 text-amber-700"
                        : "text-stone-600 hover:text-stone-800 hover:bg-stone-100"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              <motion.button
                onClick={() => navigate(`/quizzes/${culture.slug}`, { state: { id: culture.id } })}
                className="
                  px-4 py-2
                  text-sm
                  bg-gradient-to-r from-amber-500 to-amber-600
                  text-white rounded-lg shadow-sm
                  hover:from-amber-600 hover:to-amber-700
                  transition-all duration-300
                  flex items-center gap-2
                "
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Take Quiz
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto max-w-7xl px-6 space-y-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="culture-content">
          
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-stone-200 shadow-lg sticky top-24"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl font-bold text-stone-800 mb-4">Explore Cultures</h3>
              <div className="space-y-4">
                {cultures.slice(0, 5).map((c) => (
                  <motion.div
                    key={c.id}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CultureCard culture={c} variant="compact" />
                  </motion.div>
                ))}
              </div>
              <motion.button
                onClick={() => navigate("/cultures")}
                className="mt-6 w-full py-2 text-center text-amber-600 hover:text-amber-700 font-medium rounded-lg border border-amber-200 hover:border-amber-300 transition-colors duration-300"
                whileHover={{ scale: 1.01 }}
              >
                View All Cultures →
              </motion.button>
            </motion.div>
          </div>

          
          <div className="lg:col-span-6 space-y-8">
            
            <motion.div 
              className="text-center pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-stone-800 md:text-5xl">
                <span className="block">Sacred Traditions of</span>
                <span className="relative inline-block mt-2">
                  <span className="text-amber-600">{culture.name}</span>
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-1 bg-amber-500"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </span>
              </h1>
              
              {culture.region && (
                <motion.p 
                  className="mt-4 text-lg text-stone-600 flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {culture.region}
                  </span>
                  {culture.population && (
                    <>
                      <span className="text-stone-400">•</span>
                      <span>
                        {culture.population.toLocaleString()} people
                      </span>
                    </>
                  )}
                </motion.p>
              )}
            </motion.div>

            
            <motion.div 
              className="rounded-2xl overflow-hidden border border-stone-300 shadow-xl"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.005 }}
            >
              <Gallery images={culture.gallery.map(image => ({ ...image, type: "image" }))} />
            </motion.div>

            
            <motion.div 
              className="flex border-b border-stone-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-6 py-3 text-lg font-medium ${
                    activeTab === tab
                      ? "text-amber-600"
                      : "text-stone-600 hover:text-stone-800"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500"
                      layoutId="tabIndicator"
                    />
                  )}
                </button>
              ))}
            </motion.div>

          
            <motion.div
              key={activeTab}
              className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-stone-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="prose prose-lg max-w-none text-stone-700 
                          prose-headings:text-stone-800 
                          prose-a:text-amber-600 hover:prose-a:text-amber-700
                          prose-strong:text-stone-800
                          prose-ul:marker:text-amber-500
                          prose-li:marker:text-amber-500
                          prose-img:rounded-lg prose-img:shadow-md
                          prose-blockquote:border-l-amber-500
                          prose-blockquote:bg-amber-50
                          prose-blockquote:px-6 prose-blockquote:py-3
                          prose-blockquote:rounded-r-lg"
                dangerouslySetInnerHTML={{ __html: tabContent ?? "" }}
              />
            </motion.div>
          </div>

          
          <div className="lg:col-span-3">
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-stone-200 shadow-lg sticky top-24"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >       
              
              <motion.div 
                className="mt-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200 shadow-sm"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800">Test Your Knowledge</h4>
                    <p className="text-sm text-stone-600 mt-1">Take a quiz about {culture.name} culture</p>
                  </div>
                </div>
                
                <motion.button
                  onClick={() => navigate(`/quizzes/${culture.slug}`, { state: { id: culture.id } })}
                  className="
                    w-full
                    rounded-lg
                    px-6 py-3
                    text-base
                    bg-gradient-to-r from-amber-500 to-amber-600
                    text-white shadow-md hover:shadow-lg
                    hover:from-amber-600 hover:to-amber-700
                    transition-all duration-300
                    relative overflow-hidden
                    group
                    font-medium
                    flex items-center justify-center gap-3
                  "
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start Quiz
                  </span>
                  <span className="absolute inset-0 bg-amber-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </motion.button>
              </motion.div>
              
            
              <div className="mt-6 bg-stone-50 rounded-xl p-6 border border-stone-200">
                <h4 className="font-bold text-stone-800 mb-3">Quick Facts</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-stone-700"><strong>Language:</strong> {culture.language || "Unknown"}</span>
                  </li>
                  {culture.population && (
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-stone-700"><strong>Population:</strong> {culture.population.toLocaleString()}</span>
                    </li>
                  )}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CultureDetail;