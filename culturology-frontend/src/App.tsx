import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Cultures from "@/pages/Cultures";
import CultureDetail from "@/pages/CultureDetail";
import MapPage from "@/pages/MapPage";
import SignInPage from "@/pages/SignIn";
import SignUpPage from "@/pages/SignUp";
import Footer from "@/components/Footer";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-gray-50 text-slate-900 dark:bg-gray-900 dark:text-white">
        <Navbar />
        <main className="flex-grow px-4 py-6 md:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cultures" element={<Cultures />} />
            <Route path="/cultures/:slug" element={<CultureDetail />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;