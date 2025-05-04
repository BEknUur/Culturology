import { useState } from "react";
import { chatWithAI } from "@/api";
const Chatbot = ({ slug }: { slug: string }) => {
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setInput("");
    const reply = await chatWithAI(slug, userMsg);
    setMessages((m) => [...m, { role: "bot", text: reply }]);
  };

  return (
    <div className="space-y-2 rounded border p-4">
      <h2 className="text-xl font-semibold">Ask a local</h2>
      <div className="h-52 overflow-y-auto rounded bg-gray-100 p-2 dark:bg-gray-800">
        {messages.map((m, i) => (
          <p
            key={i}
            className={`mb-2 ${m.role === "bot" ? "text-primary-500" : "text-gray-800 dark:text-white"}`}
          >
            <strong>{m.role === "bot" ? "AI" : "You"}:</strong> {m.text}
          </p>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about this culture…"
          className="flex-1 rounded border px-3 py-2"
        />
        <button
          onClick={send}
          className="rounded bg-primary-500 px-4 text-white hover:bg-primary-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};
export default Chatbot;