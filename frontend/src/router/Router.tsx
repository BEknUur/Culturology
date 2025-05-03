import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Peoples from "../pages/Peoples";
import PeopleDetail from "../pages/PeopleDetail";
import NotFound from "../pages/NotFound";
import MapPage from "../pages/MapPage";


export default function Router() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="peoples" element={<Peoples />} />
        <Route path="peoples/:id" element={<PeopleDetail />} />
        <Route path="map" element={<MapPage />} />
        <Route path="*" element={<NotFound />} />
        
      </Route>

      {/* пример приватного роута */}
      <Route
        path="profile"
        element={
          <>
            <SignedIn>{/* <Profile /> */}</SignedIn>
            <SignedOut>
              <Navigate to="/" replace />
            </SignedOut>
          </>
        }
      />
    </Routes>
  );
}
