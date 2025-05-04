import { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import { getCultureBySlug, getQuizByCulture } from "@/api";
import { Culture, Quiz } from "@/types";
import Gallery from "@/components/Gallery";

const tabs = ["About", "Traditions", "Lifestyle"] as const;
const CultureDetail = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [culture, setCulture] = useState<Culture | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("About");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/signin" replace />;

  useEffect(() => {
    const loadCultureData = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getCultureBySlug(slug);
        setCulture(data);
        const quizData = await getQuizByCulture(data.id);
        setQuizzes(quizData);
      } catch (err: any) {
        setError(err.message ?? "Ошибка при загрузке данных о культуре");
      } finally {
        setLoading(false);
      }
    };
    loadCultureData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-900 to-stone-900 pt-24 pb-12">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center py-12">
            <div className="inline-block h-12 w-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mb-4" />
            <p className="text-amber-100">Загрузка информации о культуре...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !culture) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-900 to-stone-900 pt-24 pb-12">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center py-12 bg-stone-900/60 backdrop-blur-sm rounded-xl p-8 border border-red-900/30">
            <p className="text-red-400 mb-4">{error || "Культура не найдена"}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-amber-700 text-amber-100 rounded-lg hover:bg-amber-600 transition-colors shadow-md"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabContent =
    activeTab === "About"
      ? culture.about
      : activeTab === "Traditions"
      ? culture.traditions
      : culture.lifestyle;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 to-stone-900 pt-24 pb-12">
      <div className="container mx-auto max-w-4xl px-4 space-y-8">
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-amber-100">
            <span className="text-amber-400">{culture.name}</span>
          </h1>
          {culture.region && (
            <p className="mt-2 text-lg text-amber-100/80">
              {culture.region} •{" "}
              {culture.population?.toLocaleString() || "Unknown population"}
            </p>
          )}
        </div>

        
        <div className="rounded-2xl overflow-hidden border-4 border-amber-500 shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
          <Gallery images={culture.gallery} />
        </div>

        
        <div className="mt-6 flex border-b-4 border-amber-500/50">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative mr-4 px-6 py-3 text-lg font-bold ${
                activeTab === tab
                  ? "text-amber-300 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:bg-amber-400 after:rounded-t"
                  : "text-amber-100/70 hover:text-amber-200 transition-colors"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        
        <div className="bg-gradient-to-r from-amber-900/40 to-stone-800/40 rounded-xl p-6 shadow-lg border border-amber-700/30">
          <div
            className="prose prose-lg max-w-none text-amber-100 prose-headings:text-amber-300 prose-a:text-amber-400 prose-strong:text-amber-200"
            dangerouslySetInnerHTML={{ __html: tabContent ?? "" }}
          />
        </div>

        
        <div className="text-center pt-6">
          <button
            onClick={() =>
              navigate(`/quizzes/${culture.slug}`, {
                state: { id: culture.id },
              })
            }
            className="rounded-lg bg-amber-600 px-8 py-3 font-serif text-white shadow hover:bg-amber-500 transition"
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default CultureDetail;
