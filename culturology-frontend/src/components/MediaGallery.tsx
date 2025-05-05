import { useState, useEffect } from "react";
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
          <div
            key={item.id}
            className={`group relative cursor-pointer overflow-hidden rounded-xl border-2 border-amber-600 hover:border-amber-400 transition-all duration-300 bg-stone-900 transform ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDelay: `${index * 50}ms`,
              boxShadow: "0 10px 30px -15px rgba(251, 191, 36, 0.3)"
            }}
            onClick={() => setSelected(item)}
            onMouseEnter={() => setHoveredId(String(item.id))}
            onMouseLeave={() => setHoveredId(null)}
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
              
              <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/70 to-black/30 transition-opacity duration-300 ${
                hoveredId === String(item.id) ? "opacity-100" : "opacity-0"
              }`}>
                <div className="rounded-full bg-amber-500 p-4 transform transition-transform duration-500 hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            {item.caption && (
              <div className="p-3 bg-gradient-to-b from-stone-800 to-stone-900 border-t border-amber-900/30">
                <h3 className="font-medium text-amber-100 truncate">{item.caption}</h3>
                <p className="text-xs text-amber-200/70 mt-1">
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </p>
              </div>
            )}
            
            <div className="absolute top-3 right-3">
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                item.type === 'video' 
                  ? 'bg-amber-500/20 text-amber-300' 
                  : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {item.type}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <MediaModal item={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
};

export default MediaGallery;