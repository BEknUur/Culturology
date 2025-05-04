import React, { useState } from "react";
import MapWrapper, { CountryClick } from "@/components/MapWrapper";
import { getCulturesByRegion } from "@/api";

export default function MapPage() {
  const [selected, setSelected] = useState<CountryClick | null>(null);
  const [cultures, setCultures] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCountryClick = async ({ isoA3, name }: CountryClick) => {
    setSelected({ isoA3, name });
    setLoading(true);
   
    try {
      const data = await getCulturesByRegion(name);
      setCultures(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex max-w-6xl mx-auto h-[80vh] my-8">
      <div className="flex-1">
        <MapWrapper onCountryClick={handleCountryClick} />
      </div>
      <aside className="w-80 p-4 overflow-auto border-l">
        {selected ? (
          <>
            <h2 className="text-xl font-bold">{selected.name}</h2>
            {loading ? (
              <p>Загрузка культур…</p>
            ) : cultures.length > 0 ? (
              <ul className="space-y-2">
                {cultures.map((c) => (
                  <li key={c.id} className="p-2 bg-gray-100 rounded">
                    <strong>{c.name}</strong>
                    <p>{c.about.slice(0, 60)}…</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Культур не найдено.</p>
            )}
          </>
        ) : (
          <p>Кликните на страну на карте</p>
        )}
      </aside>
    </div>
  );
}
