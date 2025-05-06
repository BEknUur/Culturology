import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { motion } from "framer-motion";
import { getMediaItems, MediaItem } from "@/api/media";

const MediaPage: React.FC = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <motion.div
          className="h-16 w-16 border-4 border-amber-400 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <motion.div
          className="bg-amber-100 border border-amber-300 rounded-xl p-8 text-center shadow-lg"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <p className="text-2xl text-amber-700 mb-2">𓃗 Error Loading Visions</p>
          <p className="text-amber-600">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <motion.div
          className="bg-amber-100 border border-amber-300 rounded-xl p-8 text-center shadow-lg"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <p className="text-2xl text-amber-700 mb-2">𓃒 No Visions Found</p>
          <p className="text-amber-600">The oracle has not yet spoken</p>
        </motion.div>
      </div>
    );
  }

  const CustomLightPreview = ({ thumbnail }: { thumbnail?: string }) => (
    <div className="relative w-full h-full bg-amber-50">
      <img 
        src={thumbnail || "/placeholder.jpg"} 
        className="w-full h-full object-cover opacity-90"
        alt="Video preview"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur-sm border-2 border-amber-300 flex items-center justify-center shadow-md">
          <span className="text-3xl text-amber-600">𓃭</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-16 pb-12 px-4 font-['Cormorant'] text-stone-800">
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-5xl text-amber-400/20"
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

      <motion.h1 
        className="text-4xl md:text-5xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-700">
          Sacred Visions
        </span>
      </motion.h1>

      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        
        <motion.div 
          className="lg:w-3/4 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden border-2 border-amber-200 shadow-lg">
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
                <h3 className="text-xl font-bold text-amber-700 mb-2 flex items-center">
                  <span className="mr-2">𓃗</span> Oracle's Notes
                </h3>
                <p className="text-stone-700">{selected.caption}</p>
              </div>
            )}
          </div>
        </motion.div>

        
        <motion.div 
          className="lg:w-1/4 w-full space-y-4 overflow-y-auto max-h-[70vh] pr-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-bold text-amber-700 sticky top-0 bg-white/90 backdrop-blur-sm p-3 z-10 flex items-center border-b border-amber-100">
            <span className="mr-2">𓃭</span> Ancient Visions
          </h3>
          
          {items.map((item) => (
            <motion.div
              key={item.url}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 cursor-pointer rounded-lg p-3 transition-all
                ${
                  item.url === selected.url
                    ? "bg-amber-100/80 border-2 border-amber-300 shadow-inner"
                    : "bg-white/80 hover:bg-amber-50/50 border border-amber-100"
                }`}
              onClick={() => setSelected(item)}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              <div className="relative w-20 h-14 overflow-hidden rounded border border-amber-200">
                <img
                  src={item.thumbnail || "/placeholder.jpg"}
                  alt={item.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-white/30">
                  <span className="text-xl text-amber-600">
                    {item.type === "video" ? "𓃭" : "𓁹"}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-stone-800 line-clamp-2">
                  {item.caption || "Ancient Vision"}
                </p>
                <span className="text-xs text-amber-600/80 mt-1">
                  {item.type === "video" ? "Vision Scroll" : "Sacred Glyph"}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MediaPage;