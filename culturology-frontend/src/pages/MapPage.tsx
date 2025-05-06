import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";

import { getCultures } from "@/api";
import type { Culture } from "@/types/culture";

const LoadingSpinner = () => (
  <motion.div 
    className="flex flex-col items-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
    <motion.p 
      className="mt-4 text-lg text-amber-800 font-medium"
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
    >
      Mapping cultural traditions...
    </motion.p>
  </motion.div>
);

const MapPage: React.FC = () => {
  const { isLoaded, isSignedIn } = useUser();
  const chartRef = useRef<am5.Root | null>(null);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const [highlightedCountries, setHighlightedCountries] = useState<string[]>([]);
  const [countryToCultures, setCountryToCultures] = useState<Record<string, { name: string; count: number }[]>>({});
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    setIsLoading(true);
    getCultures()
      .then((data: Culture[]) => {
        const map: Record<string, { name: string; count: number }[]> = {};
        data.forEach((c) => {
          const countryName = c.location?.split(",")[0].trim();
          if (!countryName) return;

          if (!map[countryName]) map[countryName] = [];
          const existingCulture = map[countryName].find(item => item.name === c.name);
          if (existingCulture) {
            existingCulture.count += 1;
          } else {
            map[countryName].push({ name: c.name, count: 1 });
          }
        });

        setHighlightedCountries(Object.keys(map));
        setCountryToCultures(map);
        setIsLoading(false);
      })
      .catch((error) => {
         console.error("Failed to load cultures:", error);
         setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (chartRef.current) {
      chartRef.current.dispose();
      chartRef.current = null;
    }

    const root = am5.Root.new("chartdiv");
    chartRef.current = root;

    root.setThemes([
      am5themes_Animated.new(root),
      am5themes_Dark.new(root)
    ]);

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoMercator(),
        panX: "rotateX",
        panY: "translateY",
        wheelY: "zoom",
        wheelSensitivity: 0.7,
        homeZoomLevel: 1,
        homeGeoPoint: { longitude: 20, latitude: 30 }
      })
    );

    chart.set("zoomControl", am5map.ZoomControl.new(root, {}));

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow as any,
        exclude: ["AQ"],
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      fill: am5.color(0x1e293b),
      stroke: am5.color(0x475569),
      strokeWidth: 0.5,
      tooltipText: "{name}",
      interactive: true,
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(0xb45309),
      stroke: am5.color(0xd97706),
      strokeWidth: 1,
    });

    polygonSeries.mapPolygons.template.states.create("active", {
      fill: am5.color(0xd97706),
    });

    polygonSeries.mapPolygons.template.adapters.add("fill", (fill, target) => {
      const countryName = (target.dataItem?.dataContext as { name?: string })?.name;

      if (countryName && highlightedCountries.includes(countryName)) {
        const culturesCount = countryToCultures[countryName]?.reduce((sum, c) => sum + c.count, 0) || 0;
        const intensity = Math.min(0.3 + (culturesCount / 10) * 0.7, 1);

        const baseR = 217;
        const baseG = 119;
        const baseB = 6;

        const finalR = Math.round(baseR * intensity);
        const finalG = Math.round(baseG * intensity);
        const finalB = Math.round(baseB * intensity);

        const hexColor = (finalR << 16) | (finalG << 8) | finalB;
        return am5.color(hexColor);
      }
      return fill;
    });

    polygonSeries.mapPolygons.template.adapters.add(
      "tooltipText",
      (text, target) => {
        const countryName = (target.dataItem?.dataContext as { name?: string })?.name;

        if (countryName && countryToCultures[countryName]) {
          const cultures = countryToCultures[countryName];
          const total = cultures.reduce((sum, c) => sum + c.count, 0);

          let tooltip = `[bold]${countryName}[/]\n`;
          tooltip += `[fontSize: 12px]Total traditions: ${total}[/]\n----\n`;
          tooltip += cultures.map(c =>
            `• ${c.name}${c.count > 1 ? ` (x${c.count})` : ''}`
          ).join("\n");

          return tooltip;
        }
        return text;
      }
    );

    polygonSeries.mapPolygons.template.events.on("click", (ev) => {
      const countryName = (ev.target.dataItem?.dataContext as { name?: string })?.name;
      setSelectedCountry(countryName || null);
    });

    chart.appear(1000, 100);

    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
    };
  }, [isLoading, highlightedCountries, countryToCultures]);

  if (!isLoaded) {
     return (
       <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex justify-center items-center">
         <LoadingSpinner />
       </div>
     );
  }

  if (!isSignedIn) return <Navigate to="/signin" replace />;

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 pt-24 pb-12 overflow-hidden font-['Cormorant']"
      ref={ref}
      style={{
        backgroundImage: "url('/assets/parchment-texture.png')",
        backgroundBlendMode: "overlay"
      }}
    >
      {/* Decorative elements */}
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

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold tracking-tight"
            variants={itemVariants}
          >
            <span className="block text-amber-900">Cultural Atlas</span>
            <span className="relative inline-block mt-2">
              <span className="text-amber-700">of World Traditions</span>
              <motion.span
                className="absolute bottom-0 left-0 w-full h-1 bg-amber-600"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-stone-700 max-w-3xl mx-auto leading-relaxed italic mt-6"
            variants={itemVariants}
          >
            "Explore the tapestry of human heritage across continents and civilizations."
          </motion.p>
        </motion.div>

        {/* Map Container */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200/70 shadow-xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-amber-600/50 rounded-tl-xl"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-amber-600/50 rounded-tr-xl"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-amber-600/50 rounded-bl-xl"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-amber-600/50 rounded-br-xl"></div>

          {isLoading ? (
            <div className="flex justify-center items-center h-[70vh] min-h-[500px]">
              <LoadingSpinner />
            </div>
          ) : (
            <div
              id="chartdiv"
              className="w-full h-[70vh] min-h-[500px]"
            />
          )}
        </motion.div>

        {/* Country Details Panel */}
        <AnimatePresence>
          {selectedCountry && countryToCultures[selectedCountry] && (
            <motion.div
              className="mt-12 bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200/70 shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <motion.h2 
                      className="text-3xl md:text-4xl font-bold text-amber-800"
                      whileHover={{ x: 5 }}
                    >
                      {selectedCountry}
                    </motion.h2>
                    <p className="text-stone-700">
                      {countryToCultures[selectedCountry]?.reduce((sum, c) => sum + c.count, 0)} documented traditions
                    </p>
                  </div>
                  <motion.button
                    onClick={() => setSelectedCountry(null)}
                    className="text-amber-700 hover:text-amber-900 p-2 rounded-full hover:bg-amber-100/50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {countryToCultures[selectedCountry]?.sort((a, b) => b.count - a.count).map((culture, index) => (
                    <motion.div
                      key={culture.name}
                      className="relative bg-white hover:bg-amber-50/70 p-5 rounded-lg border border-amber-200/50 shadow-sm hover:shadow-md transition-all"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ 
                        y: -5,
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                      }}
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-amber-600 rounded-l"></div>
                      <div className="relative pl-3">
                        <h3 className="font-semibold text-amber-900">
                          {culture.name}
                        </h3>
                        {culture.count > 1 && (
                          <motion.div 
                            className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
                            whileHover={{ scale: 1.05 }}
                          >
                            {culture.count} entries
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        <AnimatePresence>
          {selectedCountry && !countryToCultures[selectedCountry] && (
            <motion.div
              className="mt-12 bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200/70 shadow-xl p-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-stone-700 text-lg">No specific cultural data found for {selectedCountry}.</p>
              <motion.button 
                onClick={() => setSelectedCountry(null)}
                className="mt-4 text-amber-700 hover:text-amber-900 font-semibold px-4 py-2 rounded-lg hover:bg-amber-100/50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Return to Map
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating decorative elements */}
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

export default MapPage;