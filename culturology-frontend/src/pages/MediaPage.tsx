import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { getMediaItems, MediaItem } from "@/api/media";
import MediaGallery from "@/components/MediaGallery";
import { Navigate } from "react-router-dom";

const MediaPage: React.FC = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/signin" replace />;

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        setItems(await getMediaItems());
      } catch (e: any) {
        setError(e.message || "Failed to load media");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredItems = filterType
    ? items.filter((item) => item.type === filterType)
    : items;
  const mediaTypes = Array.from(new Set(items.map((i) => i.type)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 to-stone-800 text-amber-100">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300">
            Media Gallery
          </h1>
          <p className="mt-2 text-amber-200/80">
           
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-300 mb-2">Error Loading Media</p>
            <p className="text-red-200/70">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-amber-900/20 border border-amber-700 rounded-lg p-10 text-center">
            <p className="text-amber-200 mb-2">No Media Found</p>
            <p className="text-amber-200/60">Please check back later</p>
          </div>
        ) : (
          <>
            {mediaTypes.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                <button
                  onClick={() => setFilterType(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filterType === null
                      ? "bg-amber-500 text-stone-900"
                      : "bg-stone-800 text-amber-200 hover:bg-stone-700"
                  }`}
                >
                  All
                </button>
                {mediaTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      filterType === type
                        ? "bg-amber-500 text-stone-900"
                        : "bg-stone-800 text-amber-200 hover:bg-stone-700"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            )}
            <div className="backdrop-blur-lg bg-stone-900/30 rounded-2xl p-6 shadow-xl border border-amber-700">
              <MediaGallery items={filteredItems} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MediaPage;
