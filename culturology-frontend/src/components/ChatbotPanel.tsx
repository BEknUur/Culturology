import React, { useState, useRef, useEffect } from "react";
import { chatWithCulture, chatGeneral } from "@/api";
import { Send, Loader2, Minimize2, Maximize2, MessageCircle } from "lucide-react";

// Add animation keyframes
const fadeInAnimation = {
  "@keyframes fadeIn": {
    "0%": { opacity: 0 },
    "100%": { opacity: 1 }
  },
  "@keyframes slideInRight": {
    "0%": { transform: "translateX(20px)", opacity: 0 },
    "100%": { transform: "translateX(0)", opacity: 1 }
  },
  "@keyframes slideInLeft": {
    "0%": { transform: "translateX(-20px)", opacity: 0 },
    "100%": { transform: "translateX(0)", opacity: 1 }
  }
};

interface Message {
  from: "user" | "ai";
  text: string;
}

interface ChatbotPanelProps {
  slug?: string;
}

const ChatbotPanel: React.FC<ChatbotPanelProps> = ({ slug = "" }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Auto resize textarea based on content
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);
  
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const question = input.trim();

    setMessages((msgs) => [...msgs, { from: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const answer = slug
        ? await chatWithCulture(slug, question)
        : await chatGeneral(question);

      setMessages((msgs) => [...msgs, { from: "ai", text: answer }]);
    } catch (err: any) {
      setMessages((msgs) => [
        ...msgs,
        {
          from: "ai",
          text: "Ошибка при запросе к ИИ: " + (err.message ?? String(err)),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {isMinimized ? (
        <button 
          onClick={toggleMinimize}
          className="fixed bottom-4 right-4 w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full shadow-xl flex items-center justify-center z-50 hover:from-amber-400 hover:to-amber-600 transition-all duration-300 border-2 border-amber-300/20"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          {messages.length > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {messages.filter(m => m.from === "ai").length}
            </div>
          )}
        </button>
      ) : (
        <div className="fixed bottom-4 right-4 w-96 max-h-[70vh] bg-gradient-to-b from-stone-900 to-stone-950 backdrop-blur-md rounded-2xl border border-amber-500/30 shadow-2xl flex flex-col overflow-hidden z-50">
          <div className="bg-gradient-to-r from-amber-600 to-amber-500 px-4 py-3 text-amber-50 font-semibold flex items-center justify-between relative">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_70%)]"></div>
            <span className="text-lg flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400 shadow-sm shadow-green-300/50 animate-pulse"></div>
              {slug ? `Chat about "${slug}"` : "Culturology AI"}
            </span>
            <button 
              onClick={toggleMinimize} 
              className="text-amber-100 hover:text-white transition-colors"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-900/70 backdrop-blur-md">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center text-amber-400/60 italic p-10 space-y-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-700/20 flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-amber-500/60" />
                </div>
                <p>Ask me anything about culturology...</p>
              </div>
            )}
            
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${
                  m.from === "user" ? "justify-end" : "justify-start"
                } animate-fadeIn`}
              >
                <div
                  className={`rounded-2xl px-4 py-2 max-w-[80%] shadow-lg ${
                    m.from === "user"
                      ? "bg-gradient-to-br from-amber-500 to-amber-700 text-amber-50 rounded-tr-none animate-slideInRight"
                      : "bg-gradient-to-br from-stone-800 to-stone-900 text-stone-100 rounded-tl-none border border-stone-700/50 animate-slideInLeft"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          
          <div className="p-3 border-t border-amber-700/30 bg-gradient-to-b from-stone-900 to-stone-950 flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question…"
              className="flex-1 rounded-xl bg-stone-800 text-amber-100 placeholder-amber-400/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/40 max-h-24 min-h-10 resize-none border border-stone-700/50"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="p-2.5 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl text-amber-50 hover:from-amber-400 hover:to-amber-600 disabled:opacity-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 flex items-center justify-center shadow-md"
            >
              {loading ? 
                <Loader2 className="h-5 w-5 animate-spin" /> : 
                <Send className="h-5 w-5" />
              }
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotPanel;