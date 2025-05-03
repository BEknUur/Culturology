import { MapContainer, TileLayer, LayersControl, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";

const { BaseLayer } = LayersControl;

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const markers = [
  { id: "kazakh", name: "Kazakh Eagle Hunters", lat: 48.716, lon: 88.715 },
  { id: "hadza",  name: "Hadza People",         lat: -3.301, lon: 35.136 },
];

export default function MapPage() {
  return (
    <div className="h-[calc(100vh-72px)]">
      <MapContainer center={[20, 0]} zoom={2} minZoom={2} className="h-full w-full">
        <LayersControl position="topright">
          {/* Современный • надёжный */}
          <BaseLayer checked name="Modern (OSM)">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
              crossOrigin=""
            />
          </BaseLayer>

          {/* Глобальная историческая подложка OHM */}
          <BaseLayer checked name="Open Historical Map (secure)">
  <TileLayer
    url="https://tiles.openhistoricalmap.org/ohm/{z}/{x}/{y}.png"
    maxZoom={10}
    attribution="© OpenHistoricalMap"
    crossOrigin=""
  />
</BaseLayer>

          {/* Ретро‑стиль Stamen • красиво в качестве «старой карты» */}
          <BaseLayer name="Watercolor (Stamen)">
          <TileLayer
  url="https://api.maptiler.com/tiles/antique/{z}/{x}/{y}.png?key=YOUR_KEY"
  attribution="© MapTiler Antique"
/>
          </BaseLayer>
        </LayersControl>

        {/* Маркеры народов */}
        {markers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lon]} icon={icon}>
            <Popup>
              <h3 className="font-medium">{m.name}</h3>
              <Link to={`/peoples/${m.id}`} className="text-indigo-600 underline">
                Open card
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
