import { Link } from "react-router-dom";
import { People } from "../../types/People";

export default function PeopleCard({ people }: { people: People }) {
  return (
    <Link
      to={`/peoples/${people.id}`}
      className="rounded-xl shadow hover:shadow-lg transition block"
    >
      <img
        src={people.cover}
        className="h-56 w-full object-cover rounded-t-xl"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{people.name}</h3>
        <p className="text-sm text-slate-600 line-clamp-2">{people.tagline}</p>
      </div>
    </Link>
  );
}
