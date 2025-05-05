import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { getCultures } from "@/api";
import type { Culture } from "@/types/culture";

const LoadingSpinner = () => (
  <motion.div 
    className="flex flex-col items-center justify-center h-full"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
    />
    <motion.p 
      className="mt-4 text-xl text-amber-800 font-['Cormorant'] italic"
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      Consulting the ancient scrolls...
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
          if (existingCulture) existingCulture.count += 1;
          else map[countryName].push({ name: c.name, count: 1 });
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
    root.setThemes([am5themes_Animated.new(root)]);

    // Custom ancient theme colors
    root.interfaceColors.set("background", am5.color(0xF5F5DC));
    root.interfaceColors.set("text", am5.color(0x5C4033));

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
      fill: am5.color(0xE6D5B8),
      stroke: am5.color(0xC4A484),
      strokeWidth: 0.5,
      tooltipText: "{name}",
      interactive: true,
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(0xB88A57),
      stroke: am5.color(0x8B5A2B),
      strokeWidth: 1,
    });

    polygonSeries.mapPolygons.template.states.create("active", {
      fill: am5.color(0x8B5A2B),
    });

    polygonSeries.mapPolygons.template.adapters.add("fill", (fill, target) => {
      const countryName = (target.dataItem?.dataContext as { name?: string })?.name;
      if (countryName && highlightedCountries.includes(countryName)) {
        const culturesCount = countryToCultures[countryName]?.reduce((sum, c) => sum + c.count, 0) || 0;
        const intensity = Math.min(0.3 + (culturesCount / 10) * 0.7, 1);
        const baseR = 139, baseG = 69, baseB = 19; // SaddleBrown
        const finalR = Math.round(baseR * intensity);
        const finalG = Math.round(baseG * intensity);
        const finalB = Math.round(baseB * intensity);
        const hexColor = (finalR << 16) | (finalG << 8) | finalB;
        return am5.color(hexColor);
      }
      return fill;
    });

    polygonSeries.mapPolygons.template.adapters.add("tooltipText", (text, target) => {
      const countryName = (target.dataItem?.dataContext as { name?: string })?.name;
      if (countryName && countryToCultures[countryName]) {
        const cultures = countryToCultures[countryName];
        const total = cultures.reduce((sum, c) => sum + c.count, 0);
        let tooltip = `[bold font-size: 18px]${countryName}[/]\n`;
        tooltip += `[font-size: 14px]Sacred traditions: [bold]${total}[/][/]\n[stroke: #8B5A2B]━━━━━━━━━━[/]\n`;
        tooltip += cultures.map(c => `[bullet] ${c.name}${c.count > 1 ? ` (×[bold]${c.count}[/])` : ''}`).join("\n");
        return tooltip;
      }
      return text;
    });

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

  if (!isLoaded) return (
    <div className="min-h-screen bg-[#F5F5DC] flex justify-center items-center">
      <LoadingSpinner />
    </div>
  );
  if (!isSignedIn) return <Navigate to="/signin" replace />;

  return (
    <div className="relative min-h-screen bg-[#F5F5DC] overflow-hidden font-['Cormorant']"
      style={{
        backgroundImage: "url('/assets/parchment-texture.png')",
        backgroundBlendMode: "overlay"
      }}
    >
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        {[...Array(8)].map((_, i) => (
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
            {['𓃭', '𓃗', '𓃒', '𓃀', '𓂀', '𓃔', '𓃱', '𓃯'][i % 8]}
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

      
      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16">
        
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-amber-900 mb-6"
            whileHover={{ scale: 1.02 }}
          >
            <span className="block">Ancient Cultural</span>
            <span className="relative inline-block mt-2">
              <span>World Map</span>
              <motion.span
                className="absolute bottom-0 left-0 w-full h-1 bg-amber-600"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-amber-800/90 max-w-2xl mx-auto leading-relaxed italic"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            "Explore the sacred traditions of ancient civilizations across the world"
          </motion.p>
        </motion.div>

        {/* Map container */}
        <motion.div 
          className="relative bg-white/30 backdrop-blur-sm rounded-xl overflow-hidden border-2 border-amber-200 shadow-lg"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-amber-500 rounded-tl-xl"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-amber-500 rounded-tr-xl"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-amber-500 rounded-bl-xl"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-amber-500 rounded-br-xl"></div>

          {isLoading ? (
            <div className="flex justify-center items-center h-[70vh] min-h-[500px]">
              <LoadingSpinner />
            </div>
          ) : (
            <div id="chartdiv" className="w-full h-[70vh] min-h-[500px]" />
          )}
        </motion.div>

        {/* Selected country details */}
        <AnimatePresence>
          {selectedCountry && countryToCultures[selectedCountry] && (
            <motion.div
              className="mt-12 bg-white/30 backdrop-blur-sm rounded-xl p-8 border-2 border-amber-200 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <motion.h2 
                    className="text-3xl md:text-4xl font-bold text-amber-900"
                    whileHover={{ x: 5 }}
                  >
                    {selectedCountry}
                  </motion.h2>
                  <p className="text-lg text-amber-800/90 italic">
                    {countryToCultures[selectedCountry]?.reduce((sum, c) => sum + c.count, 0)} sacred traditions
                  </p>
                </div>
                <motion.button
                  onClick={() => setSelectedCountry(null)}
                  className="text-amber-700 hover:text-amber-900 p-2 rounded-full hover:bg-amber-100 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {countryToCultures[selectedCountry]?.sort((a, b) => b.count - a.count).map((culture, index) => (
                  <motion.div
                    key={culture.name}
                    className="relative bg-white/50 hover:bg-white/70 p-6 rounded-lg border border-amber-200 transition-all overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, boxShadow: "0 10px 20px -5px rgba(139, 69, 19, 0.2)" }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-600"></div>
                    <div className="relative">
                      <h3 className="text-xl font-semibold text-amber-900 mb-2">{culture.name}</h3>
                      {culture.count > 1 && (
                        <motion.div 
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200"
                          whileHover={{ scale: 1.05 }}
                        >
                          {culture.count} records
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No data message */}
        <AnimatePresence>
          {selectedCountry && !countryToCultures[selectedCountry] && (
            <motion.div
              className="mt-12 bg-white/30 backdrop-blur-sm rounded-xl p-8 border-2 border-amber-200 shadow-lg text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-xl text-amber-800/90 italic">No sacred traditions recorded for {selectedCountry} in our ancient scrolls.</p>
              <motion.button 
                onClick={() => setSelectedCountry(null)}
                className="mt-6 px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Return to Map
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MapPage;