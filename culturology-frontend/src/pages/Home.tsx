import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-b from-amber-900 to-stone-900"
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      />

      
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-20 left-16 h-40 w-40 rounded-full border-4 border-amber-300" />
        <div className="absolute bottom-32 right-12 h-60 w-60 rounded-full border-4 border-amber-300" />
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-amber-600 p-4">
          <div className="h-full w-full rounded-full bg-stone-800 p-3">
            <div className="h-full w-full rounded-full bg-amber-400" />
          </div>
        </div>

        <h1 className="mb-6 font-serif text-5xl font-bold text-amber-100 md:text-6xl lg:text-7xl">
          Discover the World's <span className="text-amber-400">Hidden Cultures</span>
        </h1>
        <p className="mb-12 max-w-2xl text-lg leading-relaxed text-amber-100/90 md:text-xl">
          Explore traditions, stories, and languages of indigenous peoples across the globe.
          Immerse yourself in their authentic world through interactive experiences.
        </p>

        <div className="flex flex-col gap-4 md:flex-row">
          <Link
            to="/cultures"
            className="group relative inline-block overflow-hidden rounded-lg bg-gradient-to-r from-amber-700 to-amber-600 px-8 py-4 text-lg font-semibold text-amber-100 shadow-lg transition-shadow hover:shadow-2xl"
          >
            <span className="relative z-10">Explore Cultures</span>
            <span className="absolute inset-0 translate-y-full bg-amber-800 transition-transform group-hover:translate-y-0" />
          </Link>

          <Link
            to="/media"
            className="group relative inline-block overflow-hidden rounded-lg border border-amber-500 px-8 py-4 text-lg font-semibold text-amber-100 shadow transition-shadow hover:shadow-xl"
          >
            <span className="relative z-10">View Media</span>
            <span className="absolute inset-0 -translate-x-full bg-stone-800 transition-transform group-hover:translate-x-0" />
          </Link>
        </div>

        <div className="mt-24 flex items-center gap-4">
          <div className="h-0.5 w-12 bg-amber-500"></div>
          <span className="font-serif text-lg text-amber-300">Scroll to discover</span>
          <div className="h-0.5 w-12 bg-amber-500"></div>
        </div>
      </div>
    </div>
  );
}