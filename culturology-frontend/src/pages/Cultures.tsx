import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import { getCultures, searchCultures } from "@/api";
import { Culture } from "@/types";
import CultureCard from "@/components/CultureCard";
import SearchBar from "@/components/SearchBar";

const Cultures: React.FC = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const loadCultures = async () => {
    setLoading(true);
    setError(null);
    try {
      const data =
        query || region
          ? await searchCultures(query, region)
          : await getCultures();

      if (!Array.isArray(data)) {
        throw new Error("Неверный формат данных от сервера");
      }

      setCultures(data);
    } catch (err: any) {
      setError(err.message ?? "Ошибка при загрузке культур");
      setCultures([]);
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      loadCultures();
    }
  }, [query, region, isLoaded, isSignedIn]);

  
  if (!isLoaded) return null;
  
  if (!isSignedIn) return <Navigate to="/signin" replace />;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-amber-900 to-stone-900 pt-24 pb-12">
      <div className="container mx-auto max-w-6xl px-4 space-y-8">
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-amber-100 md:text-5xl">
            World's <span className="text-amber-400">Indigenous Cultures</span>
          </h1>
          <p className="mt-2 text-lg text-amber-100/80">
            Explore the diversity of indigenous traditions and communities from around the globe
          </p>
        </div>

        
        <div
          className="
            bg-gradient-to-r from-amber-800 to-amber-600
            rounded-2xl
            p-8
            shadow-2xl
            border-4 border-amber-500
            transform hover:scale-105
            transition-transform duration-300
            max-w-3xl mx-auto
          "
        >
          <SearchBar onSearch={setQuery} onRegionChange={setRegion} />
        </div>
        <div>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-12 w-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mb-4"></div>
              <p className="text-amber-100">Загрузка культур...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-stone-900/60 backdrop-blur-sm rounded-xl p-8 border border-red-900/30">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={loadCultures}
                className="px-6 py-3 bg-amber-700 text-amber-100 rounded-lg hover:bg-amber-600 transition-colors shadow-md"
              >
                Попробовать снова
              </button>
            </div>
          ) : cultures.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-amber-100">Культуры не найдены.</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {cultures.map((c) => (
                <CultureCard key={c.id} culture={c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cultures;
