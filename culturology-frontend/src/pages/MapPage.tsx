import { useEffect, useState } from "react";
import MapWrapper from "@/components/MapWrapper";
import { getMapPoints } from "@/api";

const MapPage = () => {
  const [points, setPoints] = useState<any[]>([]);
  useEffect(() => {
    (async () => setPoints(await getMapPoints()))();
  }, []);

  return (
    <div className="h-[70vh] w-full rounded-lg border shadow">
      <MapWrapper points={points} />
    </div>
  );
};
export default MapPage;

