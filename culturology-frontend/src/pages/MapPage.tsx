import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
    <motion.p 
      className="mt-3 text-amber-100/90"
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
    >
      Loading cultural data...
    </motion.p>
  </motion.div>
);


const MapPage: React.FC = () => {
  const { isLoaded, isSignedIn } = useUser();
  const chartRef = useRef<am5.Root | null>(null);

  
  const [highlightedCountries, setHighlightedCountries] = useState<string[]>([]);
  const [countryToCultures, setCountryToCultures] = useState<Record<string, { name: string; count: number }[]>>({});
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  
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
       <div className="min-h-screen bg-gradient-to-br from-stone-900 to-amber-900/50 flex justify-center items-center">
         <LoadingSpinner />
       </div>
     );
  }

  
  if (!isSignedIn) return <Navigate to="/signin" replace />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-stone-900 to-amber-900/30">
      
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <motion.div
          className="absolute top-20 left-16 h-40 w-40 rounded-full border-4 border-amber-300"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-32 right-12 h-60 w-60 rounded-full border-4 border-amber-300"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
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

      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16">
       
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600 mb-4"
            whileHover={{ scale: 1.02 }}
          >
            Cultural World Map
          </motion.h1>
          <motion.p 
            className="text-lg text-amber-100/90 max-w-2xl mx-auto"
            animate={{
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
          >
            Explore cultural traditions across the globe. Click on countries to discover their heritage.
          </motion.p>
        </motion.div>

        
        <motion.div 
          className="relative bg-stone-800/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-amber-900/50 shadow-xl"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-amber-400/50 rounded-tl-2xl"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-amber-400/50 rounded-tr-2xl"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-amber-400/50 rounded-bl-2xl"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-amber-400/50 rounded-br-2xl"></div>

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

       
        <AnimatePresence>
          {selectedCountry && countryToCultures[selectedCountry] && (
            <motion.div
              className="mt-8 bg-stone-800/80 backdrop-blur-lg rounded-2xl p-6 border border-amber-900/50 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <motion.h2 
                    className="text-2xl md:text-3xl font-bold text-amber-300"
                    whileHover={{ x: 5 }}
                  >
                    {selectedCountry}
                  </motion.h2>
                  <p className="text-amber-100/90">
                    {countryToCultures[selectedCountry]?.reduce((sum, c) => sum + c.count, 0)} cultural traditions
                  </p>
                </div>
                <motion.button
                  onClick={() => setSelectedCountry(null)}
                  className="text-amber-100/70 hover:text-amber-300 p-2 rounded-full hover:bg-stone-700/50"
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
                    className="relative bg-stone-700/50 hover:bg-stone-700/70 p-5 rounded-xl border border-amber-900/30"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      y: -5,
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)"
                    }}
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-amber-600"></div>
                    <div className="relative pl-3">
                      <h3 className="font-semibold text-amber-100">
                        {culture.name}
                      </h3>
                      {culture.count > 1 && (
                        <motion.div 
                          className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-900/50 text-amber-200"
                          whileHover={{ scale: 1.05 }}
                        >
                          {culture.count} entries
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

       
        <AnimatePresence>
          {selectedCountry && !countryToCultures[selectedCountry] && (
            <motion.div
              className="mt-8 bg-stone-800/80 backdrop-blur-lg rounded-2xl p-8 border border-amber-900/50 shadow-xl text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-amber-100/90">No specific cultural data found for {selectedCountry}.</p>
              <motion.button 
                onClick={() => setSelectedCountry(null)}
                className="mt-4 text-amber-400 hover:text-amber-300 font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MapPage;