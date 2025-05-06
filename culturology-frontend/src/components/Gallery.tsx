import { useState } from "react";
import { motion } from "framer-motion";
import { MediaItem } from "@/types/culture";

interface GalleryProps {
  images: MediaItem[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = () => setOpenIndex(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((item, i) => (
          <motion.div
            key={i}
            className="relative cursor-pointer overflow-hidden rounded-xl bg-stone-800/70 border border-amber-800/30"
            onClick={() => setOpenIndex(i)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -5 }}
          >
            {item.type === "video" ? (
              <>
                <img
                  src={item.thumbnail || "/placeholder-video.jpg"}
                  alt={item.caption ?? "video thumbnail"}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="text-4xl text-amber-300">𓃭</span>
                </div>
              </>
            ) : (
              <img
                src={item.url}
                alt={item.caption ?? ""}
                className="w-full h-40 object-cover"
              />
            )}
            {item.caption && (
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3 text-amber-100 text-sm">
                {item.caption}
              </div>
            )}
            <div className="absolute top-2 right-2 bg-stone-900/80 text-amber-300 px-2 py-1 rounded-full text-xs">
              {item.type === 'video' ? '𓃭 Vision' : '𓁹 Glyph'}
            </div>
          </motion.div>
        ))}
      </div>

      {openIndex !== null && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={close}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative max-h-full max-w-full overflow-auto bg-stone-900 rounded-xl border border-amber-600/30 shadow-2xl"
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button
              onClick={close}
              className="absolute top-4 right-4 z-10 bg-stone-800/80 text-amber-300 hover:text-amber-100 w-10 h-10 rounded-full flex items-center justify-center border border-amber-600/30"
            >
              <span className="text-xl">✕</span>
            </button>

            {(() => {
              const item = images[openIndex];
              if (item.type === "video") {
                return (
                  <video
                    src={item.url}
                    controls
                    autoPlay
                    className="max-h-[80vh] w-auto block mx-auto"
                  >
                    {item.subtitlesUrl && (
                      <track
                        src={item.subtitlesUrl}
                        kind="subtitles"
                        srcLang="en"
                        label="English"
                        default
                      />
                    )}
                  </video>
                );
              } else {
                return (
                  <div className="p-8">
                    <img
                      src={item.url}
                      alt={item.caption ?? ""}
                      className="max-h-[70vh] w-auto block mx-auto rounded-lg"
                    />
                  </div>
                );
              }
            })()}

            {images[openIndex].audioUrl && (
              <div className="p-6 bg-stone-800/50 border-t border-amber-900/30">
                <audio
                  src={images[openIndex].audioUrl}
                  controls
                  className="w-full"
                />
              </div>
            )}

            {images[openIndex].caption && (
              <div className="p-6 bg-gradient-to-b from-stone-800 to-stone-900">
                <h3 className="text-xl font-medium text-amber-300 mb-2">
                  {images[openIndex].type === 'video' ? '𓃭 Vision' : '𓁹 Glyph'} Description
                </h3>
                <p className="text-amber-100/90">{images[openIndex].caption}</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Gallery;