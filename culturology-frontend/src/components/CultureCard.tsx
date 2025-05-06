import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Culture } from "@/types";

interface CultureCardProps {
  culture: Culture;
  variant?: 'default' | 'detailed' | 'compact';
}

const CultureCard = ({ culture, variant = 'default' }: CultureCardProps) => {
  const cover = culture.gallery[0]?.url ?? "/placeholder.jpg";
  
  if (variant === 'detailed') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative h-full"
      >
        <div
          className="
            group 
            relative
            block
            h-full
            overflow-hidden
            rounded-xl
            border border-stone-300
            bg-white
            shadow-lg
            transition-all 
            duration-300
            hover:shadow-xl 
            hover:border-amber-400
          "
        >
          
          <div className="relative h-64 overflow-hidden">
            <motion.img
              src={cover}
              alt={culture.name}
              className="h-full w-full object-cover"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent"></div>
            
            
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-500/50"></div>
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-500/50"></div>
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-500/50"></div>
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-500/50"></div>
          </div>
          
         
          <div className="p-6 relative z-10">
           
            <motion.h3 
              className="text-2xl font-bold text-stone-800 mb-3 group-hover:text-amber-600 transition-colors"
              layoutId={`title-${culture.id}`}
            >
              {culture.name}
              <motion.div 
                className="h-0.5 bg-amber-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-2"
                layoutId={`underline-${culture.id}`}
              />
            </motion.h3>

            
            <div className="space-y-3 mb-4">
              {culture.region && (
                <motion.p 
                  className="text-sm text-stone-600 flex items-center"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  <svg className="w-4 h-4 mr-2 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {culture.region}
                </motion.p>
              )}
              
              {culture.language && (
                <motion.p 
                  className="text-sm text-stone-600 flex items-center"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  <svg className="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  Language: {culture.language}
                </motion.p>
              )}
            </div>
            
            
            <p className="text-stone-700 text-sm line-clamp-3 mb-6">
              {culture.about}
            </p>
            
            
            <motion.div
              className="
                flex
                items-center
                justify-center
                rounded-lg
                px-4
                py-2
                bg-amber-500
                text-white
                group-hover:bg-amber-600
                transition-all
                duration-500
                overflow-hidden
                relative
                border border-amber-600
              "
              whileHover={{ 
                scale: 1.03,
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Explore Sacred Knowledge
              </span>
              <span className="absolute inset-0 bg-amber-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
        className="group"
      >
        <Link
          to={`/cultures/${culture.slug}`}
          className="
            flex items-center gap-4
            p-3
            rounded-lg
            border border-stone-200
            bg-white
            shadow-sm
            transition-all
            duration-300
            hover:shadow-md
            hover:border-amber-400
          "
        >
          <div className="w-16 h-16 rounded-lg overflow-hidden">
            <img 
              src={cover} 
              alt={culture.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium text-stone-800 group-hover:text-amber-600 transition-colors">
              {culture.name}
            </h3>
            <p className="text-sm text-stone-600">{culture.region}</p>
          </div>
        </Link>
      </motion.div>
    );
  }

  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4 }}
      className="relative h-full"
    >
      <Link
        to={`/cultures/${culture.slug}`}
        className="
          group 
          relative
          block
          h-full
          overflow-hidden
          rounded-xl
          border border-stone-300
          bg-white
          shadow-md
          transition-all 
          duration-300
          hover:shadow-lg 
          hover:border-amber-400
        "
      >
        
        <div className="relative h-56 overflow-hidden">
          <motion.img
            src={cover}
            alt={culture.name}
            className="h-full w-full object-cover"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent"></div>
          
          
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-500/50"></div>
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-500/50"></div>
        </div>
        
        
        <div className="p-5 relative z-10">
          
          <motion.h3 
            className="text-xl font-bold text-stone-800 mb-2 group-hover:text-amber-600 transition-colors"
            layoutId={`title-${culture.id}`}
          >
            {culture.name}
            <motion.div 
              className="h-0.5 bg-amber-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-1"
              layoutId={`underline-${culture.id}`}
            />
          </motion.h3>

          
          {culture.region && (
            <motion.p 
              className="text-sm text-stone-600 flex items-center mb-3"
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
            >
              <svg className="w-4 h-4 mr-2 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {culture.region}
            </motion.p>
          )}
          
          
          {culture.language && (
            <motion.div 
              className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md"
              whileHover={{ scale: 1.05 }}
            >
              {culture.language}
            </motion.div>
          )}
          
          
          <p className="text-stone-700 text-sm line-clamp-2 mb-6">
            {culture.about}
          </p>
          
          
          <motion.div
            className="
              absolute
              bottom-4
              right-4
              w-9
              h-9
              flex
              items-center
              justify-center
              rounded-full
              bg-amber-500
              text-white
              group-hover:bg-amber-600
              transition-all
              duration-500
              overflow-hidden
            "
            whileHover={{ 
              scale: 1.1,
              rotate: 360
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            <motion.div 
              className="absolute inset-0 bg-amber-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
            />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CultureCard;