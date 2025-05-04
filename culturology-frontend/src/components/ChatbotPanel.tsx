// src/components/ChatbotPanel.tsx
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

  // автоскролл вниз при добавлении нового сообщения
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const question = input.trim();
    setMessages(msgs => [...msgs, { from: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const answer = slug
        ? await chatWithCulture(slug, question)
        : await chatGeneral(question);
      setMessages(msgs => [...msgs, { from: "ai", text: answer }]);
    } catch (err: any) {
      setMessages(msgs => [
        ...msgs,
        { from: "ai", text: "Ошибка при запросе к ИИ: " + (err.message ?? err) },
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
    <div className="fixed bottom-24 right-6 w-80 max-h-[70vh] bg-stone-900/90 backdrop-blur-md rounded-xl border border-amber-700 shadow-lg flex flex-col overflow-hidden">
      {/* Шапка с кнопкой закрытия */}
      <div className="flex items-center justify-between bg-amber-700 px-4 py-2 text-amber-100 font-semibold">
        <span>Chat with {slug ? slug : "Culturology AI"}</span>
        <button onClick={onClose} className="text-amber-100 hover:text-white">
          ✕
        </button>
      </div>

      {/* Сообщения */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-lg px-3 py-2 max-w-[70%] ${
                m.from === "user"
                  ? "bg-amber-600 text-amber-100"
                  : "bg-stone-800 text-stone-100"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Поле ввода */}
      <div className="p-2 border-t border-amber-700 flex items-center gap-2">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type your question..."
          className="flex-1 rounded-md bg-stone-800 text-amber-100 placeholder-amber-400 px-2 py-1 focus:outline-none"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="px-3 py-1 bg-amber-600 rounded-md text-amber-100 hover:bg-amber-500 disabled:opacity-50"
        >
          {loading ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatbotPanel;
