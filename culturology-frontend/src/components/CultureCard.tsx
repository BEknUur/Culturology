import { Link } from "react-router-dom";
import { Culture } from "@/types";

const CultureCard = ({ culture }: { culture: Culture }) => {
  const cover = culture.gallery[0]?.url ?? "/placeholder.jpg";
  return (
    <Link
      to={`/cultures/${culture.slug}`}
      className="group rounded-lg border shadow hover:shadow-lg"
    >
      <img
        src={cover}
        alt={culture.name}
        className="h-40 w-full rounded-t-lg object-cover transition group-hover:scale-105"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{culture.name}</h3>
        {culture.region && (
          <p className="text-sm text-gray-500">{culture.region}</p>
        )}
      </div>
    </Link>
  );
};
export default CultureCard;