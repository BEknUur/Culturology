import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
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
    <div
      className={`modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 backdrop-blur-md transition-all duration-300 ${
        isVisible ? "bg-black/80" : "bg-black/0"
      }`}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className={`relative w-full max-w-5xl overflow-hidden rounded-2xl bg-gradient-to-b from-stone-800 to-stone-950 shadow-2xl transition-all duration-500 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          <h2 className="text-lg font-medium text-amber-100 truncate max-w-lg">
            {item.caption || `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} Content`}
          </h2>
          
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-stone-800/70 text-amber-100 hover:bg-amber-600 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
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
              <div className="w-3/4 p-8 rounded-xl bg-stone-800/50 backdrop-blur-sm">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 rounded-full bg-amber-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                    </svg>
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
            <h3 className="text-lg font-medium text-amber-200 mb-2">About</h3>
            <p className="text-amber-100/90">{item.caption}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaModal;