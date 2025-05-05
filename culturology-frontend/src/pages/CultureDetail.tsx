import { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCultureBySlug, getQuizByCulture } from "@/api";
import { Culture, Quiz } from "@/types";
import Gallery from "@/components/Gallery";

const tabs = ["About", "Traditions", "Lifestyle"] as const;

const CultureDetail = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [culture, setCulture] = useState<Culture | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("About");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/signin" replace />;

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
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 pt-24 pb-12 font-['Cormorant']"
        style={{
          backgroundImage: "url('/assets/parchment-texture.png')",
          backgroundBlendMode: "overlay"
        }}>
        <div className="container mx-auto max-w-4xl px-4">
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
              className="text-amber-800 mt-4 text-lg italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Consulting the ancient scrolls...
            </motion.p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || !culture) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 pt-24 pb-12 font-['Cormorant']"
        style={{
          backgroundImage: "url('/assets/parchment-texture.png')",
          backgroundBlendMode: "overlay"
        }}>
        <div className="container mx-auto max-w-4xl px-4">
          <motion.div 
            className="text-center py-12 bg-white/30 backdrop-blur-sm rounded-xl p-8 border-2 border-amber-200 shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="mb-6">
              <svg className="w-16 h-16 text-amber-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-amber-800 mt-4 text-lg">{error || "Culture not found in our archives"}</p>
            </div>
            <motion.button
              onClick={() => window.location.reload()}
              className="
                px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 
                text-amber-100 rounded-lg hover:from-amber-500 hover:to-amber-600 
                transition-all duration-300 shadow-md
                font-medium
                relative overflow-hidden
                group
              "
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Try Again</span>
              <span className="absolute inset-0 bg-amber-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
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
      : culture.lifestyle;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 pt-24 pb-12 font-['Cormorant']"
      style={{
        backgroundImage: "url('/assets/parchment-texture.png')",
        backgroundBlendMode: "overlay"
      }}>
      <div className="container mx-auto max-w-4xl px-4 space-y-8">
        
        
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-amber-900">
            <span className="block">Sacred Traditions of</span>
            <span className="relative inline-block mt-2">
              <span className="text-amber-700">{culture.name}</span>
              <motion.span
                className="absolute bottom-0 left-0 w-full h-1 bg-amber-600"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </span>
          </h1>
          
          {culture.region && (
            <motion.p 
              className="mt-4 text-lg text-amber-800/90 flex items-center justify-center gap-2"
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
                  <span className="text-amber-600/50">•</span>
                  <span>
                    {culture.population.toLocaleString()} people
                  </span>
                </>
              )}
            </motion.p>
          )}
        </motion.div>

        
        <motion.div 
          className="rounded-2xl overflow-hidden border-4 border-amber-500/80 shadow-2xl"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.01 }}
        >
          <Gallery images={culture.gallery.map(image => ({ ...image, type: "image" }))} />
        </motion.div>

        
        <motion.div 
          className="flex border-b border-amber-500/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-3 text-lg font-medium ${
                activeTab === tab
                  ? "text-amber-700"
                  : "text-amber-800/70 hover:text-amber-900"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-amber-600"
                  layoutId="tabIndicator"
                />
              )}
            </button>
          ))}
        </motion.div>

        
        <motion.div
          key={activeTab}
          className="bg-white/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border-2 border-amber-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="prose prose-lg max-w-none text-amber-900 
                      prose-headings:text-amber-800 
                      prose-a:text-amber-700 hover:prose-a:text-amber-600
                      prose-strong:text-amber-800
                      prose-ul:marker:text-amber-600
                      prose-li:marker:text-amber-600"
            dangerouslySetInnerHTML={{ __html: tabContent ?? "" }}
          />
        </motion.div>

        {/* Quiz Button */}
        <motion.div 
          className="text-center pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={() => navigate(`/quizzes/${culture.slug}`, { state: { id: culture.id } })}
            className="
              rounded-lg px-8 py-3 text-lg
              bg-gradient-to-r from-amber-600 to-amber-700
              text-amber-100 shadow-lg hover:shadow-xl
              hover:from-amber-500 hover:to-amber-600
              transition-all duration-300
              relative overflow-hidden
              group
              font-medium
            "
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Test Your Knowledge
            </span>
            <span className="absolute inset-0 bg-amber-800/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default CultureDetail;