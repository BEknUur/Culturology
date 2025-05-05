import React, { useEffect } from "react";
import ReactPlayer from "react-player";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { MediaItem } from "@/api/media";

interface MediaModalProps {
  item: MediaItem;
  onClose: () => void;
}
const MediaModal: React.FC<MediaModalProps> = ({ item, onClose }) => {
  
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  
  const isPlayable = ReactPlayer.canPlay(item.url);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-stone-900 shadow-2xl">
       
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1 text-amber-100 hover:text-white"
          aria-label="Close"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

       
        <div className="relative w-full pb-[56.25%] bg-black">
          {item.type === "video" && isPlayable ? (
            <ReactPlayer
              url={item.url}
              controls
              width="100%"
              height="100%"
              className="absolute top-0 left-0 rounded-t-2xl"
              light={item.thumbnail || false}
             
              style={{ borderRadius: "0.5rem 0.5rem 0 0" }}
            />
          ) : item.type === "video" ? (
            <video
              src={item.url}
              controls
              poster={item.thumbnail || undefined}
              className="absolute top-0 left-0 w-full h-full object-cover rounded-t-2xl bg-black"
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
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <audio src={item.url} controls className="w-3/4" />
            </div>
          )}
        </div>

        
        {item.caption && (
          <div className="p-4 border-t border-stone-800 bg-stone-800/50 text-amber-100">
            {item.caption}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaModal;
