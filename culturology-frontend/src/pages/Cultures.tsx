import { useEffect, useState } from "react";
import { getCultures, searchCultures } from "@/api";
import { Culture } from "@/types/culture";
import CultureCard from "@/components/CultureCard";
import SearchBar from "@/components/SearchBar";

const Cultures = () => {
  const [cultures, setCultures] = useState<Culture[]>([]);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string | undefined>();

  const load = async () => {
    const data = query || region ? await searchCultures(query, region) : await getCultures();
    setCultures(data);
  };
  useEffect(() => {
    load();
  }, [query, region]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <SearchBar onSearch={setQuery} onRegionChange={setRegion} />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {cultures.map((c) => (
          <CultureCard key={c.id} culture={c} />
        ))}
      </div>
    </div>
  );
};
export default Cultures;