// src/pages/Cultures.tsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import { getCultures, searchCultures } from "@/api";
import { Culture } from "@/types/culture";
import CultureCard from "@/components/CultureCard";
import SearchBar from "@/components/SearchBar";

const Cultures = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string>();

  // Ждём загрузки статуса сессии Clerk
  if (!isLoaded) return null;
  // Если не залогинены — отправляем на SignIn
  if (!isSignedIn) return <Navigate to="/signin" replace />;

  // Загружаем данные
  useEffect(() => {
    (async () => {
      const data = query || region
        ? await searchCultures(query, region)
        : await getCultures();
      setCultures(data);
    })();
  }, [query, region]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <SearchBar onSearch={setQuery} onRegionChange={setRegion} />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {cultures.map(c => <CultureCard key={c.id} culture={c} />)}
      </div>
    </div>
  );
};

export default Cultures;
