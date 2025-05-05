import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Culture } from "@/types";

const CultureCard = ({ culture }: { culture: Culture }) => {
  const cover = culture.gallery[0]?.url ?? "/placeholder.jpg";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <Link
        to={`/cultures/${culture.slug}`}
        className="
          group 
          relative
          block
          overflow-hidden
          rounded-xl
          border-2 border-amber-500/50
          shadow-lg
          transition-all duration-300
          hover:shadow-xl hover:shadow-amber-500/20
          hover:border-amber-400
          bg-gradient-to-b from-amber-800/50 to-stone-900
          h-full
        "
      >
        {/* Image with overlay */}
        <div className="relative h-56 overflow-hidden">
          <motion.img
            src={cover}
            alt={culture.name}
            className="h-full w-full object-cover"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="p-5 relative z-10">
          <h3 className="text-xl font-bold text-amber-300 mb-2 group-hover:text-amber-200 transition-colors">
            {culture.name}
          </h3>
          {culture.region && (
            <p className="text-sm text-amber-100/80 flex items-center">
              <svg className="w-3 h-3 mr-2 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {culture.region}
            </p>
          )}
          
          
          {culture.language && (
            <div className="absolute top-3 right-3">
              <div className="relative overflow-hidden h-8 w-24">
                <div className="
                  absolute transform rotate-45 bg-amber-500 text-stone-900 
                  font-bold py-1 right-[-35px] top-[5px] w-[110px] 
                  text-center text-xs tracking-wide
                ">
                  {culture.language}
                </div>
              </div>
            </div>
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
            bg-amber-600/80
            text-amber-100
            group-hover:bg-amber-500
            transition-all
            duration-300
            group-hover:translate-x-1
          ">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CultureCard;