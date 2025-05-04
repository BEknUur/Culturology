import { Link } from "react-router-dom";
import { Culture } from "@/types";

const CultureCard = ({ culture }: { culture: Culture }) => {
  const cover = culture.gallery[0]?.url ?? "/placeholder.jpg";
  
  return (
    <Link
      to={`/cultures/${culture.slug}`}
      className="
        group 
        relative
        overflow-hidden
        rounded-xl
        border-4 border-amber-500/80
        shadow-lg
        transition-all duration-300
        hover:shadow-2xl
        hover:border-amber-400
        transform hover:scale-105
        bg-gradient-to-b from-amber-800/90 to-stone-900
      "
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={cover}
          alt={culture.name}
          className="
            h-full 
            w-full 
            object-cover 
            transition-transform duration-500
            group-hover:scale-110
            group-hover:brightness-110
          "
        />
       
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent opacity-70"></div>
      </div>
      
      <div className="p-5 relative z-10">
        <h3 className="text-xl font-bold text-amber-300 mb-1 group-hover:text-amber-200 transition-colors">
          {culture.name}
        </h3>
        {culture.region && (
          <p className="text-sm text-amber-100/70 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
            {culture.region}
          </p>
        )}
        
        
        <div className="
          absolute
          bottom-4
          right-4
          w-8
          h-8
          flex
          items-center
          justify-center
          rounded-full
          bg-amber-600
          text-amber-100
          opacity-80
          group-hover:opacity-100
          group-hover:bg-amber-500
          transition-all
          duration-300
        ">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      
      
      <div className="absolute top-0 left-0 w-12 h-12 overflow-hidden">
        <div className="absolute transform rotate-45 bg-amber-500 text-stone-900 font-bold py-1 left-[-35px] top-[12px] w-[100px] text-center text-xs">
          {culture.language || "Culture"}
        </div>
      </div>
    </Link>
  );
};

export default CultureCard;