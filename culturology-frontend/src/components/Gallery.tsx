import { Image } from "@/types";

const Gallery = ({ images }: { images: Image[] }) => (
  <div className="flex gap-4 overflow-x-auto py-2">
    {images.map((img, idx) => (
      <figure key={idx} className="w-60 flex-shrink-0">
        <img
          src={img.url}
          alt={img.caption || "image"}
          className="h-40 w-full rounded object-cover"
        />
        {img.caption && (
          <figcaption className="mt-1 text-center text-xs text-gray-500">
            {img.caption}
          </figcaption>
        )}
      </figure>
    ))}
  </div>
);
export default Gallery;