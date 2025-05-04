import { useState } from "react";

const regions = [
  "Africa",
  "Americas",
  "Asia",
  "Europe",
  "Oceania",
  "Arctic",
];

const SearchBar = ({
  onSearch,
  onRegionChange,
}: {
  onSearch: (q: string) => void;
  onRegionChange: (r?: string) => void;
}) => {
  const [q, setQ] = useState("");
  const handle = (val: string) => {
    setQ(val);
    onSearch(val);
  };
  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        value={q}
        onChange={(e) => handle(e.target.value)}
        placeholder="Search…"
        className="flex-1 rounded border px-3 py-2"
      />
      <select
        onChange={(e) =>
          onRegionChange(e.target.value ? e.target.value : undefined)
        }
        className="rounded border px-3 py-2"
      >
        <option value="">All regions</option>
        {regions.map((r) => (
          <option key={r}>{r}</option>
        ))}
      </select>
    </div>
  );
};
export default SearchBar;