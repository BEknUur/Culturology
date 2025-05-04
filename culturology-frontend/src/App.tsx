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
 
    <div className="min-h-screen bg-gradient-to-b from-amber-900 to-stone-900 text-amber-100">
      <BrowserRouter>
        <Navbar />
       
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            <Route path="/cultures" element={<Cultures />} />
            <Route path="/cultures/:slug" element={<CultureDetail />} />
            <Route path="/map" element={<MapPage />} />

            <Route path="*" element={<Home />} />
          </Routes>
        
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
