import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Cultures from "@/pages/Cultures";
import CultureDetail from "@/pages/CultureDetail";
import MapPage from "@/pages/MapPage";
import SignInPage from "@/pages/SignIn";
import SignUpPage from "@/pages/SignUp";
import QuizPage from "@/pages/QuizPage";
import ChatbotPanel from "@/components/ChatbotPanel";
import { ChatBubbleLeftRightIcon, XMarkIcon } from "@heroicons/react/24/outline";

function AppWrapper() {
  const { isLoaded, isSignedIn } = useUser();
  const [chatOpen, setChatOpen] = useState(false);
  const location = useLocation();

  const slug =
    location.pathname.startsWith("/cultures/")
      ? location.pathname.split("/")[2]
      : "";

  return (
    <>
      <Navbar />

      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/cultures" element={<Cultures />} />
          <Route path="/cultures/:slug" element={<CultureDetail />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/quizzes/:slug" element={<QuizPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>

      <Footer />
      {isLoaded && isSignedIn && (
        <button
          onClick={() => setChatOpen((o) => !o)}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-amber-600 shadow-lg hover:bg-amber-500 transition-colors"
        >
          
        </button>
      )}
      {isLoaded && isSignedIn && chatOpen && (
        <ChatbotPanel slug={slug} />
      )}
    </>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 to-stone-900 text-amber-100">
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </div>
  );
}
