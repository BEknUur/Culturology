import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import Home from "@/pages/Home";
import Cultures from "@/pages/Cultures";
import CultureDetail from "@/pages/CultureDetail";
import MapPage from "@/pages/MapPage";
import SignInPage from "@/pages/SignIn";
import SignUpPage from "@/pages/SignUp";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)] px-4 py-6">
        <Routes>
          {/* Публичные */}
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Остальные страницы сами редиректят, если не залогинены */}
          <Route path="/cultures" element={<Cultures />} />
          <Route path="/cultures/:slug" element={<CultureDetail />} />
          <Route path="/map" element={<MapPage />} />

          {/* Всё, что не описано выше — на главную */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
