import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const [year] = useState(new Date().getFullYear());
  
  return (
    <footer 
      className="relative border-t border-amber-200/50 bg-amber-50/90 py-12 text-amber-800 backdrop-blur-sm font-['Cormorant']"
      style={{
        backgroundImage: "url('/assets/parchment-texture.png')",
        backgroundBlendMode: "overlay"
      }}
    >
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-5xl text-amber-800/20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontFamily: "'Noto Sans Symbols', sans-serif"
            }}
            animate={{
              rotate: [0, 360],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: Math.random() * 40 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {['𓃭', '𓃗', '𓃒', '𓃀', '𓂀'][i % 5]}
          </motion.div>
        ))}
      </div>

      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-amber-300/20 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              rotate: [0, 360]
            }}
            transition={{
              duration: Math.random() * 30 + 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-4">
          
          <div className="md:col-span-2">
            <motion.div 
              className="mb-6 flex items-center"
              whileHover={{ scale: 1.01 }}
            >
              <div className="mr-3 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-amber-600 shadow-md border-2 border-amber-700">
                <div className="h-6 w-6 rounded-full bg-amber-100 p-1">
                  <div className="h-full w-full rounded-full bg-amber-300/80"></div>
                </div>
              </div>
              <span className="font-['Cormorant'] text-2xl font-bold text-amber-900">Sacred Wisdom</span>
            </motion.div>
            
            <motion.p 
              className="mb-6 max-w-md text-lg leading-relaxed text-amber-800/90 italic"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              "Preserving the whispers of ancestors through digital eternity."
            </motion.p>
            
            <div className="flex space-x-6">
              {[
                { href: "https://t.me/bergty", icon: "𓃭", label: "Oracle" },
                { href: "https://www.linkedin.com/in/beknur-ualikhanuly-039704245/", icon: "𓃗", label: "Wisdom" },
                { href: "https://github.com/BEknUur", icon: "𓃒", label: "Code" }
              ].map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  className="text-3xl text-amber-700 hover:text-amber-900 transition-colors relative group"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  aria-label={item.label}
                >
                  <span className="block group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-amber-200">
                    {item.label}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
          
         
          <div>
            <motion.h3 
              className="mb-6 text-2xl font-bold text-amber-900 border-b border-amber-200 pb-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Scrolls of Path
            </motion.h3>
            <ul className="space-y-3 text-lg">
              {[
                { to: "/", label: "Home" },
                { to: "/cultures", label: "Ancient Cultures" },
                { to: "/map", label: "Silk Road Map" },
                { to: "/media", label: "Sacred Texts" },
                { to: "/about", label: "The Oracle" }
              ].map((link, index) => (
                <motion.li 
                  key={link.to}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ x: 5 }}
                >
                  <Link 
                    to={link.to} 
                    className="text-amber-800 hover:text-amber-600 transition-colors flex items-center"
                  >
                    <span className="mr-2 text-amber-600 text-lg">→</span>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
          
         
          <div>
            <motion.h3 
              className="mb-6 text-2xl font-bold text-amber-900 border-b border-amber-200 pb-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Carved Tablets
            </motion.h3>
            <ul className="space-y-4 text-lg">
              <motion.li 
                className="flex items-start"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ x: 3 }}
              >
                <span className="mr-3 text-amber-600 text-xl">𓃔</span>
                <span className="text-amber-800">ualihanulybeknur@gmail.com</span>
              </motion.li>
              
              <motion.li 
                className="flex items-start"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ x: 3 }}
              >
                <span className="mr-3 text-amber-600 text-xl">𓃱</span>
                <span className="text-amber-800">Islam Karimova 70, Almaty</span>
              </motion.li>

              <motion.li 
                className="flex items-start"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ x: 3 }}
              >
                <span className="mr-3 text-amber-600 text-xl">𓃯</span>
                <span className="text-amber-800">Kazakhstan</span>
              </motion.li>
            </ul>
          </div>
        </div>
        
        
        <motion.div 
          className="flex flex-col items-center border-t border-amber-200/50 pt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="mb-4 flex space-x-6 text-sm">
            {[
              { to: "/privacy", label: "Seal of Privacy" },
              { to: "/terms", label: "Stone Tablets" },
              { to: "/sitemap", label: "Ancient Map" }
            ].map((link, index) => (
              <motion.div 
                key={link.to}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  to={link.to} 
                  className="text-amber-700 hover:text-amber-600 transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>
          
          <motion.p 
            className="text-sm text-amber-700/80 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            "In the year {year} of the Common Era, this knowledge was preserved."
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;