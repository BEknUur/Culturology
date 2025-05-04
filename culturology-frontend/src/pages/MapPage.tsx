import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import { getCultures } from "@/api";

const MapPage: React.FC = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [countries, setCountries] = useState<string[]>([]);

  
  useEffect(() => {
    getCultures().then((data) => {
      const locs = Array.from(
        new Set(
          data
            .map((c) => c.location?.split(",")[0].trim() || "")
            .filter((l) => !!l)
        )
      );
      setCountries(locs);
    });
  }, []);

  
  useEffect(() => {
    if (countries.length === 0) return;

    const root = am5.Root.new("chartdiv");
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoMercator(),
        panX: "rotateX",
        panY: "translateY",
        wheelY: "zoom",
      })
    );

    
    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow as any,
        exclude: ["AQ"],      
      })
    );

    
    polygonSeries.mapPolygons.template.setAll({
      fill: am5.color(0xcccccc),
      stroke: am5.color(0x666666),
      tooltipText: "{name}",
      interactive: true,
    });

    
    polygonSeries.mapPolygons.template.adapters.add(
      "fill",
      (fill, target) => {
        const name = (target.dataItem?.dataContext as { name?: string })?.name;
        if (name && countries.includes(name)) {
          return am5.color(0x3366ff);
        }
        return fill;
      }
    );

    chart.appear(1000, 100);
    return () => {
      root.dispose();
    };
  }, [countries]);

  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/signin" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 to-stone-900 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-amber-100 mb-6 text-center">
          Culture Map
        </h1>
        <div
          id="chartdiv"
          style={{ width: "100%", height: "600px", borderRadius: "12px" }}
        />
      </div>
    </div>
  );
};

export default MapPage;
