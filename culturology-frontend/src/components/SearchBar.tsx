import React, { useState, useEffect } from "react";
import { getRegions } from "@/api";

interface SearchBarProps {
  onSearch: (q: string) => void;
  onRegionChange: (r: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onRegionChange }) => {
  const [regions, setRegions] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const list = await getRegions();
        setRegions(list);
      } catch (err) {
        console.error("Не удалось загрузить регионы:", err);
      }
    })();
  }, []);

  return (
    <div className="flex gap-4">
      <input
        type="text"
        placeholder="Search cultures..."
        onChange={(e) => onSearch(e.target.value)}
        className="
          flex-1
          rounded-lg
          px-5 py-3
          border-2 border-amber-400
          bg-stone-50 text-stone-900 placeholder-stone-500
          focus:outline-none focus:ring-2 focus:ring-amber-500
          transition-shadow duration-200
          shadow-lg
        "
      />
      <select
        defaultValue=""
        onChange={(e) => onRegionChange(e.target.value)}
        className="
          rounded-lg
          px-4 py-3
          border-2 border-amber-400
          bg-stone-50 text-stone-900
          focus:outline-none focus:ring-2 focus:ring-amber-500
          transition-shadow duration-200
          shadow-lg
        "
      >
        <option value="">All regions</option>
        {regions.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchBar;
