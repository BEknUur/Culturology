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
          text: "⚠️ Error: " + (err.message || "Failed to get response"),
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
    <div className="fixed bottom-24 right-6 w-80 max-h-[70vh] bg-white border border-gray-200 rounded-xl shadow-xl flex flex-col overflow-hidden z-[1000]">
     
      <div className="bg-amber-600 px-4 py-3 text-white font-semibold rounded-t-xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16h6M12 4c-4.418 0-8 1.79-8 4v8c0 2.21 3.582 4 8 4s8-1.79 8-4V8c0-2.21-3.582-4-8-4z" />
          </svg>
          Chat with {slug || "AI"}
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          ✕
        </button>
      </div>

      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-4 py-2 rounded-lg ${m.from === "user" ? "bg-amber-500 text-white" : "bg-white text-gray-800 border border-gray-200"}`}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type your question..."
            rows={1}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPanel;