import { Routes, Route, } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Peoples from "../pages/Peoples";
import PeopleDetail from "../pages/PeopleDetail";
import NotFound from "../pages/NotFound";
import MapPage from "../pages/MapPage";

export default function Router() {
  return (
    <Routes>
      {/* Корневой маршрут - проверка аутентификации */}
      <Route path="/" element={
        <>
          {/* Если пользователь авторизован - показываем MainLayout */}
          <SignedIn>
            <MainLayout />
          </SignedIn>
          {/* Если пользователь НЕ авторизован - редирект на форму входа */}
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      }>
        {/* Дочерние маршруты (загрузятся только для авторизованных) */}
        <Route index element={<Home />} />
        <Route path="peoples" element={<Peoples />} />
        <Route path="peoples/:id" element={<PeopleDetail />} />
        <Route path="map" element={<MapPage />} />
        <Route path="profile" element={
          <div className="p-4">
            <h1 className="text-2xl font-bold">Profile Page</h1>
            <p>This is a protected route. You need to be logged in to view this.</p>
          </div>
        } />
        <Route path="dashboard" element={
          <div className="p-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p>Welcome to your dashboard. This is a protected route.</p>
          </div>
        } />
      </Route>

      {/* Ловим все остальные маршруты */}
      <Route path="*" element={
        <>
          <SignedIn>
            <NotFound />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      } />
    </Routes>
  );
}