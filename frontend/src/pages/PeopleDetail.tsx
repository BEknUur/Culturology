import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "../api/useApi";
import { People } from "../types/People";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

export default function PeopleDetail() {
  const { id } = useParams();
  const api = useApi();

  const { data: person, isLoading } = useQuery<People>({
    queryKey: ["people", id],
    queryFn: () => api(`/mock/people-${id}.json`),
    enabled: !!id,
  });

  if (isLoading) return <p>Loading…</p>;
  if (!person) return <p>Not found</p>;

  return (
    <article className="max-w-4xl mx-auto">
      {/* hero‑изображение */}
      <img
        src={person.cover}
        className="w-full h-72 object-cover rounded-xl mb-8"
      />

      {/* описание */}
      <h1 className="text-3xl font-bold mb-4">{person.name}</h1>
      <p className="mb-6 text-slate-700">{person.description}</p>

      {/* галерея (показываем, только если есть картинки) */}
      {person.images?.length > 0 && (
        <PhotoProvider>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {person.images.map((src: string) => (
              <PhotoView key={src} src={src}>
                <img
                  src={src}
                  className="w-full h-48 object-cover rounded-lg cursor-zoom-in"
                />
              </PhotoView>
            ))}
          </div>
        </PhotoProvider>
      )}

      {/* факты */}
      <h2 className="text-xl font-semibold mb-2">Facts</h2>
      <ul className="list-disc list-inside space-y-1 text-slate-700">
        {person.facts.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </article>
  );
}
