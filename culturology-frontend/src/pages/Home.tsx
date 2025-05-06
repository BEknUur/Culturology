import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [activeCulture, setActiveCulture] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const controls = useAnimation();
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { amount: 0.5 });

  const cultures = [
    {
      id: 'kazakh',
      name: 'Kazakh Eagle Hunters',
      description: 'Explore the ancient bond between humans and golden eagles in Mongolia\'s Altai Mountains',
      image: '/assets/kazakh.webp',
      colorLight: 'var(--color-amber-100)',
      colorDark: 'var(--color-amber-800)',
      region: 'Central Asia',
      symbol: '🦅'
    },
    {
      id: 'himba',
      name: 'Himba People',
      description: 'Discover the ochre-covered beauty and matriarchal traditions of Namibia\'s desert dwellers',
      image: '/assets/himba.webp',
      colorLight: 'var(--color-red-100)',
      colorDark: 'var(--color-red-800)',
      region: 'Southern Africa',
      symbol: '🧴'
    },
    {
      id: 'tsaatan',
      name: 'Tsaatan Reindeer Herders',
      description: 'Journey with the last reindeer herders of Mongolia\'s taiga forests',
      image: '/assets/tsaatan.webp',
      colorLight: 'var(--color-blue-100)',
      colorDark: 'var(--color-blue-800)',
      region: 'Northern Asia',
      symbol: '🦌'
    }
  ];

  useEffect(() => {
    if (isHovering) return;

    const interval = setInterval(() => {
      setActiveCulture(prev => (prev + 1) % cultures.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isHovering]);

  const features = [
    {
      title: 'Living Archives',
      description: 'Interactive timelines with historical context',
      icon: '📜',
      path: '/archives'
    },
    {
      title: 'Sacred Geometry',
      description: 'Decode ancient patterns and symbols',
      icon: '🔺',
      path: '/symbols'
    },
    {
      title: 'Oral Traditions',
      description: 'First-hand stories from elders',
      icon: '👂',
      path: '/stories'
    },
    {
      title: 'Cultural Atlas',
      description: 'Geospatial exploration tool',
      icon: '🗺️',
      path: '/atlas'
    }
  ];

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const slideUp = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1],
        delay: 0.1
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 text-amber-900 antialiased overflow-x-hidden">
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/paper-fibers.webp)',
          backgroundSize: '800px',
          opacity: 0.06,
          mixBlendMode: 'multiply'
        }}
      />
      <section 
        ref={heroRef}
        className="relative h-screen max-h-[1200px] min-h-[600px] overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={cultures[activeCulture].id}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeIn}
            className="absolute inset-0"
          >
            <div className="absolute inset-0">
              <img
                src={cultures[activeCulture].image}
                alt={cultures[activeCulture].name}
                className="w-full h-full object-cover object-center"
                loading="eager"
                fetchPriority="high"
              />
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, ${cultures[activeCulture].colorDark}cc 10%, transparent 50%)`
                }}
              />
            </div>
            <div className="relative h-full flex items-end pb-24">
              <div className="container px-6 mx-auto">
                <motion.div 
                  className="max-w-2xl"
                  variants={staggerContainer}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                >
                  <motion.div variants={slideUp} className="text-5xl mb-4">
                    {cultures[activeCulture].symbol}
                  </motion.div>
                  <motion.h1 
                    variants={slideUp}
                    className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight"
                  >
                    {cultures[activeCulture].name}
                  </motion.h1>
                  <motion.p 
                    variants={slideUp}
                    className="text-xl md:text-2xl text-amber-100 mb-8 max-w-lg"
                  >
                    {cultures[activeCulture].description}
                  </motion.p>
                  <motion.div variants={slideUp} className="flex flex-wrap gap-3">
                    <Link
                      to={`/cultures/${cultures[activeCulture].id}`}
                      className="px-6 py-3 bg-white text-amber-900 rounded-full font-medium hover:bg-amber-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-amber-800"
                    >
                      Explore Culture
                    </Link>
                    <Link
                      to="/cultures"
                      className="px-6 py-3 border border-white text-white rounded-full font-medium hover:bg-white/10 transition-colors duration-200"
                    >
                      View All Cultures
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
          {cultures.map((culture, index) => (
            <button
              key={culture.id}
              onClick={() => setActiveCulture(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${index === activeCulture ? 'w-8 bg-white' : 'w-3 bg-white/40'}`}
              aria-label={`View ${culture.name}`}
            />
          ))}
        </div>
      </section>
      <section className="py-24 bg-amber-800 text-white">
        <div className="container px-6 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={slideUp} className="text-amber-300 mb-6 text-4xl">✧</motion.div>
            <motion.h2 variants={slideUp} className="text-3xl md:text-4xl font-bold mb-6">Preserving Intangible Heritage</motion.h2>
            <motion.p variants={slideUp} className="text-xl md:text-2xl mb-8 leading-relaxed">
              We partner with indigenous communities to document endangered traditions using ethical, consent-based methods that prioritize cultural sovereignty.
            </motion.p>
            <motion.div variants={slideUp}>
              <Link
                to="/methodology"
                className="inline-flex items-center px-6 py-3 border-2 border-amber-300 text-amber-300 rounded-full font-medium hover:bg-amber-300/10 transition-colors group"
              >
                Our Methodology
                <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <section className="py-24 bg-white">
        <div className="container px-6 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <motion.h2 variants={slideUp} className="text-3xl md:text-4xl font-bold mb-4">Multidimensional Exploration</motion.h2>
            <motion.p variants={slideUp} className="text-xl text-amber-800/90">Experience cultures through multiple lenses and perspectives</motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={slideUp}
                whileHover={{ y: -8 }}
                className="group relative bg-amber-50 rounded-xl p-8 border border-amber-200 hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-amber-800/90 mb-6">{feature.description}</p>
                <Link
                  to={feature.path}
                  className="inline-flex items-center text-amber-600 hover:text-amber-800 font-medium"
                >
                  Explore
                  <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}