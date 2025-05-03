import { Link } from "react-router-dom";

const bg =
  "https://images.unsplash.com/photo-1508675801603-73e3c5bd9d9b?auto=format&fit=crop&w=1920&q=80";

export default function Home() {
  return (
    <section
      className="h-[calc(100vh-72px)] w-full flex flex-col items-center justify-center text-center text-white"
      style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}
    >
      <div className="backdrop-brightness-[.45] absolute inset-0" />
      <div className="relative z-10 space-y-6 max-w-3xl px-6">
        <h1 className="text-5xl font-extrabold drop-shadow">
          Discover Hidden Cultures
        </h1>
        <p className="text-xl drop-shadow">
          Travel the world from your screen — meet indigenous peoples and learn
          their unique traditions, languages and stories.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            to="/peoples"
            className="px-6 py-3 rounded-full bg-white/90 text-slate-800 font-medium hover:bg-white"
          >
            Explore Peoples
          </Link>
          <Link
            to="/map"
            className="px-6 py-3 rounded-full border border-white/70 hover:bg-white/10"
          >
            Interactive Map
          </Link>
        </div>
      </div>
    </section>
  );
}
