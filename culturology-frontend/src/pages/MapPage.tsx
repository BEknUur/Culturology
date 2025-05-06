import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
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
  const [viewMode, setViewMode] = useState<"standard" | "ancient">("ancient");
  const [isExploring, setIsExploring] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const animateBackground = async () => {
      while (true) {
        await controls.start({
          backgroundPosition: ["0% 0%", "100% 100%"],
          transition: { duration: 60, ease: "linear" }
        });
        await controls.start({
          backgroundPosition: ["100% 100%", "0% 0%"],
          transition: { duration: 60, ease: "linear" }
        });
      }
    };
    animateBackground();
  }, [controls]);

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

    
    if (viewMode === "ancient") {
      root.interfaceColors.set("background", am5.color(0xF5F5DC));
      root.interfaceColors.set("text", am5.color(0x5C4033));
    } else {
      root.interfaceColors.set("background", am5.color(0xF8F8F8));
      root.interfaceColors.set("text", am5.color(0x333333));
    }

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoMercator(),
        panX: "rotateX",
        panY: "translateY",
        wheelY: "zoom",
        wheelSensitivity: 0.7,
        homeZoomLevel: 1.5,
        homeGeoPoint: { longitude: 20, latitude: 30 }
      })
    );

    
    const zoomControl = am5map.ZoomControl.new(root, {
      marginBottom: 15,
      marginRight: 15,
      paddingBottom: 10,
      paddingTop: 10,
      paddingLeft: 10,
      paddingRight: 10,
      background: am5.RoundedRectangle.new(root, {
        fill: am5.color(viewMode === "ancient" ? 0x8B5A2B : 0x4682B4),
        fillOpacity: 0.8,
        stroke: am5.color(0xFFFFFF),
        strokeWidth: 1,
        cornerRadiusTL: 5,
        cornerRadiusTR: 5,
        cornerRadiusBL: 5,
        cornerRadiusBR: 5
      })
    });
    chart.set("zoomControl", zoomControl);

    // Add home button
    const homeButton = chart.children.push(am5.Button.new(root, {
      x: am5.percent(100),
      y: am5.percent(100),
      centerX: am5.percent(100),
      centerY: am5.percent(100),
      dx: -60,
      dy: -60,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      background: am5.RoundedRectangle.new(root, {
        fill: am5.color(viewMode === "ancient" ? 0x8B5A2B : 0x4682B4),
        fillOpacity: 0.8,
        stroke: am5.color(0xFFFFFF),
        strokeWidth: 1,
        cornerRadiusTL: 20,
        cornerRadiusTR: 20,
        cornerRadiusBL: 20,
        cornerRadiusBR: 20,
        width: 40,
        height: 40
      }),
      icon: am5.Graphics.new(root, {
        fill: am5.color(0xFFFFFF),
        svgPath: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
      })
    }));
    
    homeButton.events.on("click", () => {
      chart.goHome();
    });

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow as any,
        exclude: ["AQ"],
      })
    );

   
    polygonSeries.mapPolygons.template.setAll({
      fill: viewMode === "ancient" ? am5.color(0xE6D5B8) : am5.color(0xE8E8E8),
      stroke: viewMode === "ancient" ? am5.color(0xC4A484) : am5.color(0xCCCCCC),
      strokeWidth: 0.5,
      tooltipText: "{name}",
      interactive: true,
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: viewMode === "ancient" ? am5.color(0xB88A57) : am5.color(0xADD8E6),
      stroke: viewMode === "ancient" ? am5.color(0x8B5A2B) : am5.color(0x4682B4),
      strokeWidth: 1,
    });

    polygonSeries.mapPolygons.template.states.create("active", {
      fill: viewMode === "ancient" ? am5.color(0x8B5A2B) : am5.color(0x4682B4),
    });

    polygonSeries.mapPolygons.template.adapters.add("fill", (fill, target) => {
      const countryName = (target.dataItem?.dataContext as { name?: string })?.name;
      if (countryName && highlightedCountries.includes(countryName)) {
        const culturesCount = countryToCultures[countryName]?.reduce((sum, c) => sum + c.count, 0) || 0;
        const intensity = Math.min(0.3 + (culturesCount / 10) * 0.7, 1);
        
        if (viewMode === "ancient") {
          const baseR = 139, baseG = 69, baseB = 19; // SaddleBrown
          const finalR = Math.round(baseR * intensity);
          const finalG = Math.round(baseG * intensity);
          const finalB = Math.round(baseB * intensity);
          const hexColor = (finalR << 16) | (finalG << 8) | finalB;
          return am5.color(hexColor);
        } else {
          const hue = 200 - (intensity * 40); 
          const saturation = 80 + (intensity * 20);
          const lightness = 90 - (intensity * 30);
          const hslToHex = (h: number, s: number, l: number) => {
            l /= 100;
            const a = s * Math.min(l, 1 - l) / 100;
            const f = (n: number) => {
              const k = (n + h / 30) % 12;
              const color = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
              return Math.round(255 * color).toString(16).padStart(2, '0');
            };
            return `#${f(0)}${f(8)}${f(4)}`;
          };
          return am5.color(hslToHex(hue, saturation, lightness));
        }
      }
      return fill;
    });

    polygonSeries.mapPolygons.template.adapters.add("tooltipText", (text, target) => {
      const countryName = (target.dataItem?.dataContext as { name?: string })?.name;
      if (countryName && countryToCultures[countryName]) {
        const cultures = countryToCultures[countryName];
        const total = cultures.reduce((sum, c) => sum + c.count, 0);
        let tooltip = `[bold font-size: 18px]${countryName}[/]\n`;
        tooltip += `[font-size: 14px]Sacred traditions: [bold]${total}[/][/]\n[stroke: ${viewMode === "ancient" ? "#8B5A2B" : "#4682B4"}]━━━━━━━━━━[/]\n`;
        tooltip += cultures.map(c => `[bullet] ${c.name}${c.count > 1 ? ` (×[bold]${c.count}[/])` : ''}`).join("\n");
        return tooltip;
      }
      return text;
    });

    polygonSeries.mapPolygons.template.events.on("click", (ev) => {
      const countryName = (ev.target.dataItem?.dataContext as { name?: string })?.name;
      if (countryName) {
        setSelectedCountry(countryName);
       
       
      }
    });

    
    const pointSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {})
    );

    pointSeries.bullets.push(() => {
      const container = am5.Container.new(root, {});
      
      const icon = container.children.push(am5.Graphics.new(root, {
        fill: viewMode === "ancient" ? am5.color(0x8B5A2B) : am5.color(0x4682B4),
        svgPath: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
        scale: 0.7
      }));

      const circle = container.children.push(am5.Circle.new(root, {
        radius: 5,
        fill: am5.color(0xFFFFFF),
        stroke: viewMode === "ancient" ? am5.color(0x8B5A2B) : am5.color(0x4682B4),
        strokeWidth: 2
      }));

      circle.animate({
        key: "radius",
        to: 8,
        duration: 2000,
        easing: am5.ease.out(am5.ease.cubic),
        loops: Infinity
      });
      circle.animate({
        key: "opacity",
        to: 0,
        duration: 2000,
        easing: am5.ease.out(am5.ease.cubic),
        loops: Infinity
      });

      return am5.Bullet.new(root, {
        sprite: container
      });
    });

   
    Object.entries(countryToCultures).forEach(([country, cultures]) => {
      let polygon: am5map.MapPolygon | undefined;
      polygonSeries.mapPolygons.each((item) => {
        if ((item.dataItem?.dataContext as { id?: string })?.id === country) {
          polygon = item;
        }
      });
      if (polygon) {
        const centroid = polygon.visualCentroid();
        if (centroid) {
          cultures.forEach(culture => {
            pointSeries.data.push({
              geometry: { type: "Point", coordinates: [centroid.longitude, centroid.latitude] },
              name: culture.name,
              country: country
            });
          });
        }
      }
    });

    
    chart.appear(1000, 100);
    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
    };
  }, [isLoading, highlightedCountries, countryToCultures, viewMode]);

  const startExploration = () => {
    setIsExploring(true);
    setTimeout(() => {
      if (chartRef.current) {
        const chart = chartRef.current.container.children.getIndex(0) as am5map.MapChart;
        chart.animate({
          key: "rotationX",
          to: 360,
          duration: 30000,
          loops: Infinity,
          easing: am5.ease.linear
        });
      }
    }, 1000);
  };

  const stopExploration = () => {
    setIsExploring(false);
    if (chartRef.current) {
      const chart = chartRef.current.container.children.getIndex(0) as am5map.MapChart;
      chart.goHome();
    }
  };

  return (
    <motion.div 
      className="relative min-h-screen overflow-hidden font-['Cormorant']"
      style={{
        backgroundImage: viewMode === "ancient" ? 
          "url('/assets/parchment-texture.png'), linear-gradient(135deg, #F5F5DC 0%, #E6D5B8 100%)" :
          "url('/assets/subtle-pattern.png'), linear-gradient(135deg, #F8F8F8 0%, #E8E8E8 100%)",
        backgroundBlendMode: "overlay"
      }}
      animate={controls}
    >
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-5xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontFamily: "'Noto Sans Symbols', sans-serif",
              color: viewMode === "ancient" ? "#8B5A2B" : "#4682B4"
            }}
            animate={{
              rotate: [0, 360],
              opacity: [0.1, 0.2, 0.1],
              y: [0, Math.random() * 100 - 50]
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

      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{
              color: viewMode === "ancient" ? "#5C4033" : "#333333"
            }}
            whileHover={{ scale: 1.02 }}
          >
            <span className="block">Ancient Cultural</span>
            <span className="relative inline-block mt-2">
              <span>World Map</span>
              <motion.span
                className="absolute bottom-0 left-0 w-full h-1"
                style={{
                  backgroundColor: viewMode === "ancient" ? "#8B5A2B" : "#4682B4"
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl max-w-2xl mx-auto leading-relaxed italic"
            style={{
              color: viewMode === "ancient" ? "rgba(92, 64, 51, 0.9)" : "rgba(51, 51, 51, 0.9)"
            }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            "Explore the sacred traditions of ancient civilizations across the world"
          </motion.p>
        </motion.div>

        {/* Controls */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={() => setViewMode("standard")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === "standard" ? 
              "bg-blue-500 text-white" : "bg-white text-blue-500 border border-blue-500"}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Standard View
          </motion.button>
          <motion.button
            onClick={() => setViewMode("ancient")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === "ancient" ? 
              "bg-amber-700 text-white" : "bg-white text-amber-700 border border-amber-700"}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ancient Parchment
          </motion.button>
          {isExploring ? (
            <motion.button
              onClick={stopExploration}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Stop Exploration
            </motion.button>
          ) : (
            <motion.button
              onClick={startExploration}
              className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Auto Explore
            </motion.button>
          )}
        </motion.div>

       
        <motion.div 
          className="relative rounded-xl overflow-hidden shadow-2xl border-2"
          style={{
            backgroundColor: viewMode === "ancient" ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(8px)",
            borderColor: viewMode === "ancient" ? "#C4A484" : "#CCCCCC"
          }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          
          <div 
            className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 rounded-tl-xl"
            style={{
              borderColor: viewMode === "ancient" ? "#8B5A2B" : "#4682B4"
            }}
          ></div>
          <div 
            className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 rounded-tr-xl"
            style={{
              borderColor: viewMode === "ancient" ? "#8B5A2B" : "#4682B4"
            }}
          ></div>
          <div 
            className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 rounded-bl-xl"
            style={{
              borderColor: viewMode === "ancient" ? "#8B5A2B" : "#4682B4"
            }}
          ></div>
          <div 
            className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 rounded-br-xl"
            style={{
              borderColor: viewMode === "ancient" ? "#8B5A2B" : "#4682B4"
            }}
          ></div>

          {isLoading ? (
            <div className="flex justify-center items-center h-[70vh] min-h-[500px]">
              <LoadingSpinner />
            </div>
          ) : (
            <div id="chartdiv" className="w-full h-[70vh] min-h-[500px]" />
          )}
        </motion.div>

        
        <AnimatePresence>
          {selectedCountry && countryToCultures[selectedCountry] && (
            <motion.div
              className="mt-12 rounded-xl p-8 shadow-lg border-2 backdrop-blur-sm"
              style={{
                backgroundColor: viewMode === "ancient" ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.5)",
                borderColor: viewMode === "ancient" ? "#C4A484" : "#CCCCCC"
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <motion.h2 
                    className="text-3xl md:text-4xl font-bold"
                    style={{
                      color: viewMode === "ancient" ? "#5C4033" : "#333333"
                    }}
                    whileHover={{ x: 5 }}
                  >
                    {selectedCountry}
                  </motion.h2>
                  <p 
                    className="text-lg italic"
                    style={{
                      color: viewMode === "ancient" ? "rgba(92, 64, 51, 0.9)" : "rgba(51, 51, 51, 0.9)"
                    }}
                  >
                    {countryToCultures[selectedCountry]?.reduce((sum, c) => sum + c.count, 0)} sacred traditions
                  </p>
                </div>
                <motion.button
                  onClick={() => setSelectedCountry(null)}
                  className="p-2 rounded-full hover:bg-opacity-20 transition-all"
                  style={{
                    color: viewMode === "ancient" ? "#8B5A2B" : "#4682B4",
                    backgroundColor: viewMode === "ancient" ? "rgba(139, 69, 19, 0.1)" : "rgba(70, 130, 180, 0.1)"
                  }}
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
                    className="relative p-6 rounded-lg border transition-all overflow-hidden"
                    style={{
                      backgroundColor: viewMode === "ancient" ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.7)",
                      borderColor: viewMode === "ancient" ? "#C4A484" : "#CCCCCC"
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      y: -5, 
                      boxShadow: viewMode === "ancient" ? "0 10px 20px -5px rgba(139, 69, 19, 0.2)" : "0 10px 20px -5px rgba(70, 130, 180, 0.2)"
                    }}
                  >
                    <div 
                      className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r"
                      style={{
                        background: viewMode === "ancient" ? "linear-gradient(to right, #8B5A2B, #A0522D)" : "linear-gradient(to right, #4682B4, #87CEEB)"
                      }}
                    ></div>
                    <div className="relative">
                      <h3 
                        className="text-xl font-semibold mb-2"
                        style={{
                          color: viewMode === "ancient" ? "#5C4033" : "#333333"
                        }}
                      >
                        {culture.name}
                      </h3>
                      {culture.count > 1 && (
                        <motion.div 
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border"
                          style={{
                            backgroundColor: viewMode === "ancient" ? "rgba(139, 69, 19, 0.1)" : "rgba(70, 130, 180, 0.1)",
                            borderColor: viewMode === "ancient" ? "rgba(139, 69, 19, 0.3)" : "rgba(70, 130, 180, 0.3)",
                            color: viewMode === "ancient" ? "#8B5A2B" : "#4682B4"
                          }}
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

       
        <AnimatePresence>
          {selectedCountry && !countryToCultures[selectedCountry] && (
            <motion.div
              className="mt-12 rounded-xl p-8 shadow-lg border-2 backdrop-blur-sm text-center"
              style={{
                backgroundColor: viewMode === "ancient" ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.5)",
                borderColor: viewMode === "ancient" ? "#C4A484" : "#CCCCCC"
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p 
                className="text-xl italic"
                style={{
                  color: viewMode === "ancient" ? "rgba(92, 64, 51, 0.9)" : "rgba(51, 51, 51, 0.9)"
                }}
              >
                No sacred traditions recorded for {selectedCountry} in our ancient scrolls.
              </p>
              <motion.button 
                onClick={() => setSelectedCountry(null)}
                className="mt-6 px-6 py-2 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: viewMode === "ancient" ? "#8B5A2B" : "#4682B4",
                  color: "#FFFFFF"
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Return to Map
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

       
        <motion.footer 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p 
            className="text-sm"
            style={{
              color: viewMode === "ancient" ? "rgba(92, 64, 51, 0.7)" : "rgba(51, 51, 51, 0.7)"
            }}
          >
            Explore the wisdom of ancient civilizations. Click on countries to discover their cultural heritage.
          </p>
        </motion.footer>
      </div>
    </motion.div>
  );
};

export default MapPage;