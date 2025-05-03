import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "../api/useApi";
import PeopleCard from "../components/shared/PeopleCard";
import { People } from "../types/People";

export default function Peoples() {
  const [query, setQuery] = useState("");
  const api = useApi();

  const { data: peoples = [], isLoading } = useQuery<People[]>({
    queryKey: ["peoples"],
    queryFn: () => api("/mock/peoples.json"),
  });

  const filtered = peoples.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <input
        type="text"
        placeholder="Search…"
        className="mb-6 w-full max-w-md rounded border px-4 py-2"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {isLoading && <p>Loading…</p>}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <PeopleCard key={p.id} people={p} />
        ))}
      </div>
    </>
  );
}
