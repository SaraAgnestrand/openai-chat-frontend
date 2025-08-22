import { useEffect, useRef, useState } from "react";
import * as s from "./app.css";
import { API_BASE } from "./config";

type Msg = { role: "user" | "assistant"; content: string };

export default function App() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hej! Hur kan jag hjälpa dig idag?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const next: Msg[] = [...messages, { role: "user", content: input.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data?.reply?.content || "Tyvärr, något gick fel.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Nätverksfel. Är API:t igång?" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <div className={s.container}>
      <div className={s.header}>NextChat</div>

      <div className={s.chatBox}>
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? s.msgUser : s.msgBot}>
            {m.content}
          </div>
        ))}
        {loading && <div className={s.typing}>Assistenten skriver…</div>}
        <div ref={chatEndRef} />
      </div>

      {/* Ny input-rad */}
      <div className={s.inputRow}>
        <input
          className={s.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Skriv ett meddelande och tryck Enter…"
        />
        <button className={s.button} onClick={sendMessage} disabled={loading}>
          Skicka
        </button>
      </div>
    </div>
  );
}
