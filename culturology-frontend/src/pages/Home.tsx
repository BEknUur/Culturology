import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Home() {
  const [activeSection, setActiveSection] = useState(0);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSection((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 }
  };

  const sections = [
    {
      title: "Discover Ancient Cultures",
      description: "Explore the sacred traditions and forgotten wisdom of civilizations past",
      symbol: "𓃭",
      color: "from-amber-500 to-amber-600"
    },
    {
      title: "Unlock Sacred Knowledge",
      description: "Journey through time with our interactive cultural archives",
      symbol: "𓃗",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Preserve Lost Traditions",
      description: "Help us safeguard humanity's diverse heritage for future generations",
      symbol: "𓃒",
      color: "from-blue-500 to-blue-600"
    }
  ];

  return (
    <div 
      className="relative min-h-screen overflow-hidden font-['Cormorant']"
      ref={ref}
    >
      
      <div 
        className="absolute inset-0 bg-gradient-to-b from-amber-50 to-amber-100"
        style={{
          backgroundImage: "url('/assets/parchment-texture.png')",
          backgroundBlendMode: "overlay"
        }}
      />

      
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        {[...Array(12)].map((_, i) => (
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
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: Math.random() * 40 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {['𓃭', '𓃗', '𓃒', '𓃀', '𓂀', '𓃔', '𓃱', '𓃯'][i % 8]}
          </motion.div>
        ))}
      </div>

      
      <motion.div
        className="relative z-10 container mx-auto px-4 py-24"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        
        <motion.div className="text-center mb-20" variants={itemVariants}>
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            whileHover={{ scale: 1.02 }}
          >
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-800">
              Sacred Archives
            </span>
            <span className="block text-3xl md:text-4xl font-light text-amber-700 mt-4">
              of Ancient Wisdom
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-amber-800/90 max-w-3xl mx-auto leading-relaxed italic"
            variants={itemVariants}
          >
            "Where the whispers of ancestors meet the curiosity of modern seekers"
          </motion.p>
        </motion.div>

        
        <div className="relative h-96 mb-20 overflow-hidden rounded-xl bg-white/30 backdrop-blur-sm border-2 border-amber-200 shadow-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              className={`absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br ${sections[activeSection].color} text-white`}
              variants={featureVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.8 }}
            >
              <span className="text-8xl mb-6">{sections[activeSection].symbol}</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{sections[activeSection].title}</h2>
              <p className="text-xl max-w-2xl mx-auto">{sections[activeSection].description}</p>
            </motion.div>
          </AnimatePresence>
          
          
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setActiveSection(i)}
                className={`w-3 h-3 rounded-full transition-all ${i === activeSection ? 'bg-white w-6' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>

        
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-20"
          variants={containerVariants}
        >
          {[
            {
              title: "Cultural Explorer",
              description: "Journey through interactive maps of ancient civilizations",
              icon: "𓁹",
              link: "/cultures"
            },
            {
              title: "Sacred Visions",
              description: "Discover rare artifacts and digital reconstructions",
              icon: "𓃭",
              link: "/media"
            },
            {
              title: "Wisdom Keeper",
              description: "Learn about our mission to preserve cultural heritage",
              icon: "𓃗",
              link: "/about"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="bg-white/30 backdrop-blur-sm p-8 rounded-xl border-2 border-amber-200 hover:border-amber-300 shadow-lg hover:shadow-xl transition-all"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <div className="text-5xl text-amber-700 mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-amber-800 mb-2">{feature.title}</h3>
              <p className="text-amber-800/90 mb-6">{feature.description}</p>
              <Link
                to={feature.link}
                className="inline-flex items-center text-amber-700 hover:text-amber-900 font-medium group"
              >
                Begin journey
                <svg 
                  className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        
        <motion.div 
          className="text-center"
          variants={itemVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-amber-800 mb-6">Ready to Begin Your Journey?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/cultures"
              className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-bold hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl"
            >
              Explore Cultures
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 border-2 border-amber-600 text-amber-700 rounded-lg font-bold hover:bg-amber-50 transition-all shadow hover:shadow-md"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </motion.div>

      
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
    </div>
  );
}