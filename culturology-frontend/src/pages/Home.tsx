import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false
  });

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const circleVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        damping: 6,
        stiffness: 100
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden" ref={ref}>
      
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-amber-900 to-stone-900"
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <motion.div
          className="absolute top-20 left-16 h-40 w-40 rounded-full border-4 border-amber-300"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 50 }}
        />
        <motion.div
          className="absolute bottom-32 right-12 h-60 w-60 rounded-full border-4 border-amber-300"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 50 }}
        />
      </div>

      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-400/20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 10 + 2}px`,
              height: `${Math.random() * 10 + 2}px`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        
        <motion.div
          className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-amber-600 p-4"
          variants={circleVariants}
          whileHover={{ scale: 1.05, rotate: 5 }}
        >
          <div className="h-full w-full rounded-full bg-stone-800 p-3">
            <motion.div
              className="h-full w-full rounded-full bg-amber-400"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>

        
        <motion.h1
          className="mb-6 font-serif text-5xl font-bold text-amber-100 md:text-6xl lg:text-7xl"
          variants={itemVariants}
        >
          Discover the World's{" "}
          <span className="relative inline-block">
            <span className="text-amber-400">Hidden Cultures</span>
            <motion.span
              className="absolute bottom-0 left-0 w-full h-1 bg-amber-500"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </span>
        </motion.h1>

        
        <motion.p
          className="mb-12 max-w-2xl text-lg leading-relaxed text-amber-100/90 md:text-xl"
          variants={itemVariants}
        >
          Explore traditions, stories, and languages of indigenous peoples across the globe.
          Immerse yourself in their authentic world through interactive experiences.
        </motion.p>

       
        <motion.div
          className="flex flex-col gap-4 md:flex-row"
          variants={itemVariants}
        >
          <Link
            to="/cultures"
            className="group relative inline-block overflow-hidden rounded-lg bg-gradient-to-r from-amber-700 to-amber-600 px-8 py-4 text-lg font-semibold text-amber-100 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <span className="relative z-10">Explore Cultures</span>
            <motion.span
              className="absolute inset-0 translate-y-full bg-amber-800"
              initial={{ translateY: "100%" }}
              whileHover={{ translateY: 0 }}
              transition={{ duration: 0.3 }}
            />
          </Link>

          <Link
            to="/media"
            className="group relative inline-block overflow-hidden rounded-lg border border-amber-500 px-8 py-4 text-lg font-semibold text-amber-100 shadow hover:shadow-xl transition-all duration-300"
          >
            <span className="relative z-10">View Media</span>
            <motion.span
              className="absolute inset-0 -translate-x-full bg-stone-800"
              initial={{ translateX: "-100%" }}
              whileHover={{ translateX: 0 }}
              transition={{ duration: 0.3 }}
            />
          </Link>
        </motion.div>

        
        <motion.div
          className="mt-24 flex items-center gap-4"
          variants={itemVariants}
          animate={{
            y: [0, 10, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          
        </motion.div>
      </motion.div>
    </div>
  );
}