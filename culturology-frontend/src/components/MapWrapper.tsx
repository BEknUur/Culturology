import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import L from "leaflet";


delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Point {
  slug: string;
  name: string;
  lat: number;
  lng: number;
}

const MapWrapper = ({ points }: { points: Point[] }) => {
  // Leaflet must run in browser; safeguard for SSR tests
  if (typeof window === "undefined") return null;

  return (
    <MapContainer center={[20, 0]} zoom={2} className="h-full w-full rounded">
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.map((p) => (
        <Marker key={p.slug} position={[p.lat, p.lng]}>
          <Popup>
            <Link to={`/cultures/${p.slug}`} className="text-primary-500 underline">
              {p.name}
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
export default MapWrapper;