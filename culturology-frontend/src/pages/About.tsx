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
      className="min-h-screen bg-gradient-to-b from-amber-900 to-stone-900 text-amber-100 pt-24 pb-12 overflow-hidden"
      ref={ref}
    >
      <div className="container mx-auto px-4 space-y-12">
        
        <motion.div
          className="text-center space-y-6"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-serif font-bold"
            variants={itemVariants}
          >
            About&nbsp;
            <span className="text-amber-400 relative inline-block">
              Culturology
              <motion.span
                className="absolute bottom-0 left-0 w-full h-1 bg-amber-500"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-amber-100/80 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            This site was created with love—so anyone can explore the cultures and traditions of the world without leaving home.
          </motion.p>
        </motion.div>

        
        <motion.div 
          className="max-w-md mx-auto text-center space-y-8"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <motion.div 
            className="mx-auto h-40 w-40 overflow-hidden rounded-full border-4 border-amber-500 shadow-lg hover:shadow-amber-500/30 transition-all duration-300 hover:scale-105"
            variants={imageVariants}
            whileHover={{ rotate: 5 }}
          >
            <img
              src="/assets/me.jpeg"    
              className="h-full w-full object-cover"
              alt="Beknur U."
            />
          </motion.div>
          
          <motion.h2 
            className="text-3xl font-semibold text-amber-200 bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Бекнур У.
          </motion.h2>
          
          <motion.p 
            className="text-amber-100/80 leading-relaxed"
            variants={itemVariants}
          >
            Hey! I'm Beknur, a full-stack dev.
            Built this project—stories, traditions, and an AI assistant to explore cultures. Wanna get into an incubator for a grant 'cause this shit is fire, and I put my soul into it. That's it.
          </motion.p>
          
          <motion.p 
            className="text-amber-100/80 leading-relaxed italic"
            variants={itemVariants}
          >
            Thanks for stopping by! I hope Culturology brings you new knowledge and warm feelings.
          </motion.p>
          
          <motion.div
            className="flex justify-center space-x-4 pt-4"
            variants={itemVariants}
          >
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                className="h-2 w-2 bg-amber-400 rounded-full"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: item * 0.3
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
      
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-amber-800/30 rounded-full"
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