import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { MediaItem } from "@/api/media";
import MediaModal from "./MediaModal";

interface MediaGalleryProps {
  items: MediaItem[];
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ items }) => {
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className={`group relative cursor-pointer overflow-hidden rounded-xl border-2 border-amber-600/50 hover:border-amber-400 transition-all duration-300 bg-stone-900/70 backdrop-blur-sm ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDelay: `${index * 50}ms`,
              boxShadow: "0 10px 30px -15px rgba(251, 191, 36, 0.2)"
            }}
            onClick={() => setSelected(item)}
            onMouseEnter={() => setHoveredId(String(item.id))}
            onMouseLeave={() => setHoveredId(null)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="relative overflow-hidden">
              <div className="w-full h-48 overflow-hidden">
                <img
                  src={item.thumbnail || "/placeholder.jpg"}
                  alt={item.caption || "media"}
                  className={`w-full h-full object-cover transform transition-transform duration-700 ${
                    hoveredId === String(item.id) ? "scale-110" : "scale-100"
                  }`}
                />
              </div>
              
              <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${
                hoveredId === String(item.id) ? "opacity-100" : "opacity-0"
              }`}>
                <div className="rounded-full bg-amber-600 p-4 transform transition-transform duration-500 hover:scale-110 shadow-lg">
                  <span className="text-2xl text-white">
                    {item.type === 'video' ? '𓃭' : '𓁹'}
                  </span>
                </div>
              </div>
            </div>
            
            {item.caption && (
              <div className="p-4 bg-gradient-to-b from-stone-800/80 to-stone-900 border-t border-amber-900/30">
                <h3 className="font-medium text-amber-100 truncate">{item.caption}</h3>
                <p className="text-xs text-amber-200/70 mt-1">
                  {item.type === 'video' ? 'Ancient Vision' : 'Sacred Glyph'}
                </p>
              </div>
            )}
            
            <div className="absolute top-3 right-3">
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                item.type === 'video' 
                  ? 'bg-amber-500/30 text-amber-300 border border-amber-500/30' 
                  : 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
              }`}>
                {item.type === 'video' ? '𓃭 Vision' : '𓁹 Glyph'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {selected && (
        <MediaModal item={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
};

export default MediaGallery;