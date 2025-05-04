import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import worldTopo from "world-atlas/countries-110m.json";
import { feature } from "topojson-client";
import type { FeatureCollection } from "geojson";

export interface CountryClick {
  isoA3: string;
  name: string;
}

interface MapWrapperProps {
  onCountryClick: (data: CountryClick) => void;
}

export default function MapWrapper({ onCountryClick }: MapWrapperProps) {
  const [countriesGeo, setCountriesGeo] = useState<FeatureCollection>();

  useEffect(() => {
    
    const geo = feature(
      worldTopo as any,
      (worldTopo as any).objects.countries
    ) as FeatureCollection;
    setCountriesGeo(geo);
  }, []);

  
  const onEachCountry = (country: any, layer: any) => {
    const props = country.properties;
    const isoA3 = props.ISO_A3 as string;
    const name = props.NAME as string;
    layer.on({
      click: () => onCountryClick({ isoA3: isoA3.toLowerCase(), name }),
      mouseover: () => layer.setStyle({ weight: 2, fillOpacity: 0.7 }),
      mouseout: () => layer.setStyle({ weight: 1, fillOpacity: 0.5 }),
    });
  };

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "100%", width: "100%" }}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OSM">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {countriesGeo && (
        <GeoJSON
          data={countriesGeo}
          style={{
            fillColor: "#5a8ed1",
            color: "#ffffff",
            weight: 1,
            fillOpacity: 0.5,
          }}
          onEachFeature={onEachCountry}
        />
      )}
    </MapContainer>
  );
}
