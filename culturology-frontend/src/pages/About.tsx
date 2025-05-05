import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const About: React.FC = () => {
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
    hidden: { y: 20, opacity: 0 },
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

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 6,
        stiffness: 100
      }
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 text-stone-900 pt-24 pb-12 overflow-hidden font-['Cormorant']"
      ref={ref}
      style={{
        backgroundImage: "url('/assets/parchment-texture.png')",
        backgroundBlendMode: "overlay"
      }}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl text-amber-800/20"
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
            {['𓃭', '𓃗', '𓃒', '𓃀', '𓂀', '𓃔', '𓃱', '𓃯'][i % 8]}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 space-y-12 relative z-10">
        <motion.div
          className="text-center space-y-6"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold tracking-tight"
            variants={itemVariants}
          >
            <span className="block text-amber-900">Sacred Wisdom</span>
            <span className="relative inline-block mt-2">
              <span className="text-amber-700">of Ancient Cultures</span>
              <motion.span
                className="absolute bottom-0 left-0 w-full h-1 bg-amber-600"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-stone-700 max-w-3xl mx-auto leading-relaxed italic"
            variants={itemVariants}
          >
            "Across the silk roads and pyramid steps, we carry forward the whispers of ancestors through digital eternity."
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div 
            className="bg-white/30 backdrop-blur-sm p-8 rounded-xl border border-amber-200/50 shadow-lg"
            initial="hidden"
            animate={controls}
            variants={containerVariants}
          >
            <motion.h2 
              className="text-3xl font-bold text-amber-800 mb-6"
              variants={itemVariants}
            >
              The Oracle Speaks
            </motion.h2>
            
            <motion.div className="space-y-4" variants={containerVariants}>
              <motion.p className="text-lg" variants={itemVariants}>
                In the Han Dynasty, scholars preserved knowledge on bamboo slips. Today, we encode cultural DNA in digital form.
              </motion.p>
              
              <motion.p className="text-lg" variants={itemVariants}>
                The Terracotta Army stands guard over Qin's legacy, while our algorithms protect the integrity of oral histories from Polynesia to the Steppes.
              </motion.p>
              
              <motion.p className="text-lg italic" variants={itemVariants}>
                "As Confucius taught: 'Study the past if you would define the future.'"
              </motion.p>
            </motion.div>
          </motion.div>

          <motion.div 
            className="bg-white/30 backdrop-blur-sm p-8 rounded-xl border border-amber-200/50 shadow-lg text-center"
            initial="hidden"
            animate={controls}
            variants={containerVariants}
          >
            <motion.div 
              className="mx-auto h-40 w-40 overflow-hidden rounded-full border-4 border-amber-600 shadow-lg hover:shadow-amber-600/30 transition-all duration-300 hover:scale-105 relative mb-6"
              variants={imageVariants}
              whileHover={{ rotate: 5 }}
            >
              <div className="absolute inset-0 bg-amber-900/10 rounded-full"></div>
              <img
                src="/assets/me.jpeg"    
                className="h-full w-full object-cover"
                alt="Beknur U."
              />
            </motion.div>
            
            <motion.h2 
              className="text-3xl font-bold text-amber-800 mb-2"
              variants={itemVariants}
            >
              Beknur Ualikhanuly
            </motion.h2>
            
            <motion.p 
              className="text-lg text-stone-700 mb-4"
              variants={itemVariants}
            >
              Digital Storykeeper & Cultural Architect
            </motion.p>
            
            <motion.div
              className="flex justify-center space-x-6 pt-4"
              variants={itemVariants}
            >
              {[
                { href: "https://t.me/bergty", icon: "𓃭", label: "Oracle" },
                { href: "https://www.linkedin.com/in/beknur-ualikhanuly-039704245/", icon: "𓃗", label: "Wisdom" },
                { href: "https://github.com/BEknUur", icon: "𓃒", label: "Code" }
              ].map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  className="text-2xl text-amber-700 hover:text-amber-900 transition-colors relative group"
                  whileHover={{ y: -5 }}
                  aria-label={item.label}
                >
                  <span className="block group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.label}
                  </span>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <motion.div 
          className="bg-white/30 backdrop-blur-sm p-8 rounded-xl border border-amber-200/50 shadow-lg mt-12"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <motion.h2 
            className="text-3xl font-bold text-amber-800 mb-6 text-center"
            variants={itemVariants}
          >
            The Three Eternal Truths
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Harmony",
                content: "As the Yellow River flows, we balance technology with tradition, creating digital spaces that honor ancestral ways.",
                symbol: "☯"
              },
              {
                title: "Remembrance",
                content: "From the Great Wall to Silicon Valley, we etch stories in the digital stone of tomorrow.",
                symbol: "𓁹"
              },
              {
                title: "Connection",
                content: "Bridging 56 ethnic traditions with AI, we weave a tapestry of shared human heritage.",
                symbol: "∞"
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="text-center p-4"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="text-5xl mb-4 text-amber-700">{item.symbol}</div>
                <h3 className="text-2xl font-bold text-amber-800 mb-2">{item.title}</h3>
                <p className="text-stone-700">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-amber-300/30 rounded-full"
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
};

export default About;