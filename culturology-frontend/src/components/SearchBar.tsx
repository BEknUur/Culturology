import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getRegions } from "@/api";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  onSearch: (q: string) => void;
  onRegionChange: (r: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onRegionChange }) => {
  const [regions, setRegions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRegions = async () => {
      setIsLoading(true);
      try {
        const list = await getRegions();
        setRegions(list);
      } catch (err) {
        console.error("Failed to load regions:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadRegions();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onRegionChange(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/cultures?q=${searchQuery}`);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Search input */}
      <motion.div 
        className="relative"
        whileHover={{ scale: 1.01 }}
      >
        <input
          type="text"
          placeholder="Search ancient cultures..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="
            w-full
            rounded-lg
            px-4 py-3
            border border-stone-300
            bg-white text-stone-800 placeholder-stone-500
            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
            transition-all duration-200
            shadow-sm
            pr-10
            font-['Cormorant'] text-lg
          "
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </motion.div>

      
      <motion.div 
        className="relative"
        whileHover={{ scale: 1.01 }}
      >
        <select
          defaultValue=""
          onChange={handleRegionChange}
          disabled={isLoading}
          className="
            w-full
            rounded-lg
            px-4 py-3
            border border-stone-300
            bg-white text-stone-800
            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
            transition-all duration-200
            shadow-sm
            appearance-none
            cursor-pointer
            disabled:opacity-70
            font-['Cormorant'] text-lg
          "
        >
          <option value="" className="bg-white">All regions</option>
          {regions.map((r) => (
            <option key={r} value={r} className="bg-white">
              {r}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-amber-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {isLoading && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </motion.div>
    </motion.form>
  );
};

export default SearchBar;