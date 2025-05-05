import React, { useState, useRef, useEffect } from "react";
import { chatWithCulture, chatGeneral } from "@/api";

interface Message {
  from: "user" | "ai";
  text: string;
}

interface ChatbotPanelProps {
  slug: string;
  onClose: () => void;
}

const ChatbotPanel: React.FC<ChatbotPanelProps> = ({ slug, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const question = input.trim();
    setMessages((m) => [...m, { from: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const answer = slug
        ? await chatWithCulture(slug, question)
        : await chatGeneral(question);
      setMessages((m) => [...m, { from: "ai", text: answer }]);
    } catch (err: any) {
      setMessages((m) => [
        ...m,
        {
          from: "ai",
          text: "⚠️ Ошибка при запросе к ИИ: " + (err.message || err),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="
        fixed bottom-24 right-6
        w-80 max-h-[70vh]
        backdrop-blur-lg bg-white/5
        border border-amber-500
        rounded-2xl
        shadow-2xl
        flex flex-col overflow-hidden
        ring-1 ring-amber-600/40
      "
    >
    
      <div
        className="
          flex items-center justify-between
          bg-gradient-to-r from-amber-700 to-amber-600
          px-4 py-2
          text-amber-100 font-semibold
          rounded-t-2xl
        "
      >
        <span className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-amber-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16h6M12 4c-4.418 0-8 1.79-8 4v8c0 2.21 3.582 4 8 4s8-1.79 8-4V8c0-2.21-3.582-4-8-4z"
            />
          </svg>
          Chat with {slug || "Culturology AI"}
        </span>
        <button
          onClick={onClose}
          className="
            text-amber-100 hover:text-white
            p-1 rounded-full
            transition-colors
          "
        >
          ✕
        </button>
      </div>

      
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`
                max-w-[70%]
                px-4 py-2
                rounded-2xl
                ${m.from === "user"
                  ? "bg-amber-600 text-white rounded-br-none"
                  : "bg-stone-800 text-stone-100 rounded-bl-none"}
                shadow-lg
                animate-fade-in
              `}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

     
      <div className="px-3 py-2 border-t border-amber-500 flex items-center gap-2 bg-white/10">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type your question..."
          rows={1}
          className="
            flex-1
            bg-stone-800/70 text-amber-100
            placeholder-amber-400
            rounded-xl
            px-3 py-2
            focus:outline-none focus:ring-2 focus:ring-amber-400
            transition-shadow
          "
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="
            bg-amber-500 hover:bg-amber-400
            text-amber-100
            px-4 py-2
            rounded-xl
            font-medium
            transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {loading ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatbotPanel;
