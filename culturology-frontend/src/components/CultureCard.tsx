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
          border-2 border-amber-200/50
          bg-white/20
          backdrop-blur-sm
          shadow-lg
          transition-all 
          duration-300
          hover:shadow-xl 
          hover:border-amber-300/70
          hover:bg-white/30
        "
        style={{
          backgroundImage: "url('/assets/parchment-texture.png')",
          backgroundBlendMode: "overlay"
        }}
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
          <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 via-transparent to-transparent"></div>
          
          
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-400/70"></div>
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-400/70"></div>
        </div>
        
        
        <div className="p-5 relative z-10">
          
          <motion.h3 
            className="text-2xl font-bold text-amber-800 mb-2 group-hover:text-amber-900 transition-colors font-['Cormorant']"
            layoutId={`title-${culture.id}`}
          >
            {culture.name}
            <motion.div 
              className="h-0.5 bg-amber-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-1"
              layoutId={`underline-${culture.id}`}
            />
          </motion.h3>

          
          {culture.region && (
            <motion.p 
              className="text-sm text-amber-700/90 flex items-center mb-3"
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
              className="absolute top-4 right-4 bg-amber-600/90 text-amber-100 px-3 py-1 rounded-full text-xs font-medium shadow-md"
              whileHover={{ scale: 1.05 }}
            >
              {culture.language}
            </motion.div>
          )}
          
          
          <p className="text-amber-800/90 text-sm line-clamp-2 mb-6">
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
              bg-amber-600/80
              text-amber-100
              group-hover:bg-amber-500
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
              className="absolute inset-0 bg-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
            />
          </motion.div>
        </div>

        
        <motion.div
          className="absolute top-2 right-2 text-amber-800/20 text-xl"
          animate={{ 
            rotate: [0, 15, -15, 0],
            y: [0, -3, 3, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {'𓃭'}
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default CultureCard;