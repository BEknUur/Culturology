import { useState } from "react";
import ReactPlayer from "react-player";
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
          <div
            key={i}
            className="relative cursor-pointer overflow-hidden rounded-lg bg-stone-800"
            onClick={() => setOpenIndex(i)}
          >
            {item.type === "video" ? (
              <>
                <img
                  src={item.thumbnail || "/placeholder-video.jpg"}
                  alt={item.caption ?? "video thumbnail"}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="text-4xl text-white">▶️</span>
                </div>
              </>
            ) : (
              <img
                src={item.url}
                alt={item.caption ?? ""}
                className="w-full h-40 object-cover transition-transform group-hover:scale-105"
              />
            )}
            {item.caption && (
              <div className="absolute bottom-0 left-0 w-full bg-black/60 text-sm text-white p-1">
                {item.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      
      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={close}
        >
          <div
            className="relative max-h-full max-w-full overflow-auto bg-stone-900 rounded-lg"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={close}
              className="absolute top-2 right-2 text-white text-2xl"
            >
              ✕
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
                  <img
                    src={item.url}
                    alt={item.caption ?? ""}
                    className="max-h-[80vh] w-auto block mx-auto"
                  />
                );
              }
            })()}

            
            {images[openIndex].audioUrl && (
              <audio
                src={images[openIndex].audioUrl}
                controls
                className="w-full mt-2"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
