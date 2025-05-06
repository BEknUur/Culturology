import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { getMediaItems, MediaItem } from "@/api/media";

const MediaPage: React.FC = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100
      }
    }
  };

  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/signin" replace />;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getMediaItems();
        setItems(data);
        setSelected(data[0] || null);
      } catch (e: any) {
        setError(e.message || "Failed to load media");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center" 
           style={{ backgroundImage: "url('/assets/parchment-texture.png')", backgroundBlendMode: "overlay" }}>
        <motion.div
          className="h-16 w-16 border-4 border-amber-600 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center"
           style={{ backgroundImage: "url('/assets/parchment-texture.png')", backgroundBlendMode: "overlay" }}>
        <motion.div
          className="bg-amber-100/80 border border-amber-300 rounded-xl p-8 text-center shadow-lg backdrop-blur-sm"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <p className="text-2xl text-amber-800 mb-2 font-['Cormorant']">𓃗 Error Loading Visions</p>
          <p className="text-amber-700 font-['Cormorant']">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 flex items-center justify-center"
           style={{ backgroundImage: "url('/assets/parchment-texture.png')", backgroundBlendMode: "overlay" }}>
        <motion.div
          className="bg-amber-100/80 border border-amber-300 rounded-xl p-8 text-center shadow-lg backdrop-blur-sm"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <p className="text-2xl text-amber-800 mb-2 font-['Cormorant']">𓃒 No Visions Found</p>
          <p className="text-amber-700 font-['Cormorant']">The oracle has not yet spoken</p>
        </motion.div>
      </div>
    );
  }

  const CustomLightPreview = ({ thumbnail }: { thumbnail?: string }) => (
    <div className="relative w-full h-full bg-amber-100/50">
      <img 
        src={thumbnail || "/placeholder.jpg"} 
        className="w-full h-full object-cover opacity-90"
        alt="Video preview"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur-sm border-2 border-amber-400 flex items-center justify-center shadow-md">
          <span className="text-3xl text-amber-700">𓃭</span>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 pt-24 pb-12 px-4 font-['Cormorant'] text-stone-800"
      ref={ref}
      style={{
        backgroundImage: "url('/assets/parchment-texture.png')",
        backgroundBlendMode: "overlay"
      }}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-5xl text-amber-800/20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontFamily: "'Noto Sans Symbols', sans-serif"
            }}
            animate={{
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: Math.random() * 40 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {['𓃭', '𓃗', '𓃒', '𓃀', '𓂀', '𓃔', '𓃱', '𓃯'][i % 8]}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="container mx-auto"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-bold tracking-tight text-center mb-12"
          variants={itemVariants}
        >
          <span className="block text-amber-900">Sacred Visions</span>
          <span className="relative inline-block mt-2">
            <span className="text-amber-700">of Ancient Cultures</span>
            <motion.span
              className="absolute bottom-0 left-0 w-full h-1 bg-amber-600"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </span>
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div 
            className="lg:w-3/4 w-full"
            variants={itemVariants}
          >
            <div className="relative bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden border-2 border-amber-200/70 shadow-lg">
              <ReactPlayer
                url={selected.url}
                controls
                width="100%"
                height="60vh"
                light={<CustomLightPreview thumbnail={selected.thumbnail} />}
                playing
                style={{
                  backgroundColor: '#fef3c7',
                  borderTopLeftRadius: '0.75rem',
                  borderTopRightRadius: '0.75rem'
                }}
              />
              
              {selected.caption && (
                <div className="p-6 bg-white/90 border-t border-amber-100">
                  <h3 className="text-xl font-bold text-amber-800 mb-2 flex items-center font-['Cormorant']">
                    <span className="mr-2">𓃗</span> Discover & Learn
                  </h3>
                  <p className="text-stone-700 font-['Cormorant']">{selected.caption}</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div 
            className="lg:w-1/4 w-full space-y-4 overflow-y-auto max-h-[70vh] pr-2"
            variants={itemVariants}
          >
            <motion.h3 
              className="text-2xl font-bold text-amber-800 sticky top-0 bg-white/90 backdrop-blur-sm p-3 z-10 flex items-center border-b border-amber-100 font-['Cormorant']"
              variants={itemVariants}
            >
              <span className="mr-2">𓃭</span> Ancient Visions
            </motion.h3>
            
            {items.map((item) => (
              <motion.div
                key={item.url}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 cursor-pointer rounded-lg p-3 transition-all font-['Cormorant']
                  ${
                    item.url === selected.url
                      ? "bg-amber-100/80 border-2 border-amber-400 shadow-inner"
                      : "bg-white/80 hover:bg-amber-50/50 border border-amber-100"
                  }`}
                onClick={() => setSelected(item)}
                variants={itemVariants}
              >
                <div className="relative w-20 h-14 overflow-hidden rounded border border-amber-200">
                  <img
                    src={item.thumbnail || "/placeholder.jpg"}
                    alt={item.caption}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-white/30">
                    <span className="text-xl text-amber-700">
                      {item.type === "video" ? "𓃭" : "𓁹"}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-stone-800 line-clamp-2">
                    {item.caption || "Ancient Vision"}
                  </p>
                  <span className="text-xs text-amber-700/80 mt-1">
                    {item.type === "video" ? "Vision Scroll" : "Sacred Glyph"}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div 
          className="bg-white/30 backdrop-blur-sm p-8 rounded-xl border border-amber-200/50 shadow-lg mt-12 text-center"
          variants={itemVariants}
        >
          <motion.h2 
            className="text-3xl font-bold text-amber-800 mb-6 font-['Cormorant']"
            variants={itemVariants}
          >
            The Wisdom of Ages
          </motion.h2>
          
          <motion.p 
            className="text-xl text-stone-700 max-w-3xl mx-auto leading-relaxed italic font-['Cormorant']"
            variants={itemVariants}
          >
            "These visions carry the whispers of ancestors across time. Watch with reverence, learn with humility."
          </motion.p>
        </motion.div>
      </motion.div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-amber-300/30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
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

export default MediaPage;