import { useState } from "react";
import { PlayIcon } from "@heroicons/react/24/solid";
import type { MediaItem } from "@/api/media";
import MediaModal from "./MediaModal";

interface MediaGalleryProps {
  items: MediaItem[];
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ items }) => {
  const [selected, setSelected] = useState<MediaItem | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((m) => (
          <div
            key={m.id}
            className="relative cursor-pointer overflow-hidden rounded-xl border border-amber-700 hover:shadow-2xl transition-shadow bg-stone-900"
            onClick={() => setSelected(m)}
          >
            <img
              src={m.thumbnail || "/placeholder.jpg"}
              alt={m.caption || "media"}
              className="w-full h-40 object-cover transform hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
              <PlayIcon className="h-12 w-12 text-amber-300" />
            </div>
            {m.caption && (
              <div className="p-2 bg-stone-800 text-sm text-amber-100">
                {m.caption}
              </div>
            )}
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
