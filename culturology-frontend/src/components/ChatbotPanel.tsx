
import { useState } from "react";
import Chatbot from "./Chatbot";
import QuizComponent from "./Quiz";
import { Quiz } from "@/types";

interface ChatbotPanelProps {
  slug: string;
  quizzes: Quiz[];
  
}

const tabs = ["Chat", "Quizzes", "About"] as const;
type Tab = (typeof tabs)[number];

export default function ChatbotPanel({ slug, quizzes,  }: ChatbotPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Chat");

  return (
    <div className="fixed bottom-4 right-4 w-80 max-h-[70vh] bg-white shadow-lg rounded-lg flex flex-col overflow-hidden">
      {/* Header with tabs */}
      <div className="flex border-b bg-primary-500 text-white">
        {tabs.map((t) => (
          <button
            key={t}
            className={`flex-1 py-2 text-center ${
              activeTab === t ? "bg-primary-700" : "bg-primary-500/75"
            }`}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "Chat" && <Chatbot slug={slug} />}
        {activeTab === "Quizzes" && (
          quizzes.length > 0 ? (
            <div className="p-2">
              <QuizComponent quizzes={quizzes} />
            </div>
          ) : (
            <p className="p-4 text-center text-gray-500">No quizzes available.</p>
          )
        )}
       
      </div>
    </div>
  );
}
