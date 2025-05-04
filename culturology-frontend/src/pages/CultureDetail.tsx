// src/pages/CultureDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import { getCultureBySlug, getQuizByCulture } from "@/api";
import { Culture, Quiz } from "@/types";
import Gallery from "@/components/Gallery";
import ChatbotPanel from "@/components/ChatbotPanel";

const tabs = ["About", "Traditions", "Lifestyle"] as const;

const CultureDetail = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { slug } = useParams<{ slug: string }>();
  const [culture, setCulture] = useState<Culture | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("About");

  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/signin" replace />;

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const data = await getCultureBySlug(slug);
      setCulture(data);
      const q = await getQuizByCulture(data.id);
      setQuizzes(q);
    })();
  }, [slug]);

  if (!culture) return <p>Loading…</p>;

  const tabContent =
    activeTab === "Traditions"
      ? culture.traditions
      : activeTab === "Lifestyle"
      ? culture.lifestyle
      : culture.about;

  return (
    <article className="mx-auto max-w-4xl space-y-8 pb-32">
      <h1 className="text-3xl font-bold">{culture.name}</h1>

      <Gallery images={culture.gallery} />

      {/* Tabs */}
      <div className="mt-6 border-b">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`mr-4 border-b-2 px-2 pb-2 text-lg font-medium ${
              activeTab === t
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        className="prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: tabContent?? "" }}
      />

      {/* Unified Chat & Quiz Panel */}
      <ChatbotPanel
        slug={culture.slug}
        quizzes={quizzes}
        about={culture.about?? ""}
      />
    </article>
  );
};

export default CultureDetail;
