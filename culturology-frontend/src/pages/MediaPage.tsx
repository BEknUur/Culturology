
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import { getMediaItems, MediaItem } from "@/api/media";
import MediaGallery from "@/components/MediaGallery";

const MediaPage: React.FC = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  if (!isLoaded) {
    return null;
  }
  
  if (!isSignedIn) {
    return <Navigate to="/signin" replace />;
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMediaItems();
        setItems(data);
      } catch (e: any) {
        setError(e.message || "Failed to load media");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <p className="p-4 text-center">Loading media…</p>;
  }
  if (error) {
    return <p className="p-4 text-red-400 text-center">{error}</p>;
  }
  if (items.length === 0) {
    return <p className="p-4 text-center">No media found.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Media Gallery</h1>
      <MediaGallery items={items} />
    </div>
  );
};

export default MediaPage;
