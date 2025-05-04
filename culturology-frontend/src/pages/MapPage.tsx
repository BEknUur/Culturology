// src/pages/MapPage.tsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import MapWrapper from "@/components/MapWrapper";
import { getMapPoints } from "@/api";

const MapPage = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [points, setPoints] = useState<any[]>([]);

  // 1) Ждём загрузки статуса Clerk
  if (!isLoaded) return null;
  // 2) Если пользователь не залогинен — редирект на SignIn
  if (!isSignedIn) return <Navigate to="/signin" replace />;

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
