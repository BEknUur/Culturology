import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { motion } from "framer-motion";
import type { MediaItem } from "@/api/media";

interface MediaModalProps {
  item: MediaItem;
  onClose: () => void;
}

const MediaModal: React.FC<MediaModalProps> = ({ item, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);
    
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if ((e.target as Element).classList.contains('modal-backdrop')) {
        handleClose();
      }
    };
    
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", handleClickOutside);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };
  
  const isPlayable = ReactPlayer.canPlay(item.url);

  return (
    <motion.div
      className={`modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 backdrop-blur-md ${
        isVisible ? "bg-black/90" : "bg-black/0"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      role="dialog"
      aria-modal="true"
    >
      <motion.div 
        className={`relative w-full max-w-5xl overflow-hidden rounded-2xl bg-gradient-to-b from-stone-800 to-stone-900 shadow-2xl border border-amber-700/30 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: isVisible ? 1 : 0.9, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          <h2 className="text-xl font-medium text-amber-100 truncate max-w-lg">
            {item.type === 'video' ? '𓃭 ' : '𓁹 '}
            {item.caption || `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} Artifact`}
          </h2>
          
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-stone-800/70 text-amber-100 hover:bg-amber-600 hover:text-white transition-colors border border-amber-700/30"
            aria-label="Close"
          >
            <span className="text-xl">✕</span>
          </button>
        </div>

        <div className="relative w-full pb-[56.25%] bg-black">
          {item.type === "video" && isPlayable ? (
            <ReactPlayer
              url={item.url}
              controls
              width="100%"
              height="100%"
              className="absolute top-0 left-0"
              light={item.thumbnail || false}
              playing={isVisible}
            />
          ) : item.type === "video" ? (
            <video
              src={item.url}
              controls
              poster={item.thumbnail || undefined}
              className="absolute top-0 left-0 w-full h-full object-cover bg-black"
              autoPlay={isVisible}
            >
              {item.subtitles_url && (
                <track
                  src={item.subtitles_url}
                  kind="subtitles"
                  label="Subtitles"
                  default
                />
              )}
            </video>
          ) : (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-to-b from-stone-900 to-black">
              <div className="w-3/4 p-8 rounded-xl bg-stone-800/50 backdrop-blur-sm border border-amber-700/30">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 rounded-full bg-amber-600">
                    <span className="text-2xl text-white">𓂀</span>
                  </div>
                </div>
                <audio 
                  src={item.url} 
                  controls 
                  className="w-full" 
                  autoPlay={isVisible}
                />
              </div>
            </div>
          )}
        </div>

        {item.caption && (
          <div className="p-6 border-t border-amber-900/20 bg-gradient-to-b from-stone-800/80 to-stone-900">
            <h3 className="text-lg font-medium text-amber-300 mb-2">𓃗 Oracle's Note</h3>
            <p className="text-amber-100/90">{item.caption}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MediaModal;