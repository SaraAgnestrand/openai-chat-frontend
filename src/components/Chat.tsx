import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import * as s from "../app.css";
import { API_BASE } from "../config";
import { loadConfig, systemFrom } from "../lib/appConfig";
import type { Msg } from "../lib/types";
import { getSession, saveSession, updateSession } from "../lib/storage";

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hej! Hur kan jag hjälpa dig idag?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef(messages);
  const [search] = useSearchParams();
  const sessionId = search.get("id");
  const navigate = useNavigate();

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!sessionId) return;
    const s = getSession(sessionId);
    if (s?.messages?.length) setMessages(s.messages);
  }, [sessionId]);

  useEffect(() => {
    function onReset() {
      setMessages([
        { role: "assistant", content: "Nollställd. Vad vill du prata om?" },
      ]);
      setInput("");
    }
    function onExport() {
      const blob = new Blob([JSON.stringify(messagesRef.current, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nextchat-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
    window.addEventListener("nextchat:reset" as any, onReset);
    window.addEventListener("nextchat:export" as any, onExport);
    return () => {
      window.removeEventListener("nextchat:reset" as any, onReset);
      window.removeEventListener("nextchat:export" as any, onExport);
    };
  }, []);

  function handleCommand(s: string) {
    const t = s.trim();

    if (t === "/reset") {
      setMessages([
        { role: "assistant", content: "Nollställd. Vad vill du prata om?" },
      ]);
      setInput("");

      navigate("/chat", { replace: true });
      return true;
    }
    //kan ta bort /save men den får vara kvar tills vidare
    if (t === "/save") {
      if (sessionId) {
        updateSession(sessionId, messagesRef.current);
        alert("Konversation uppdaterad.");
      } else {
        const meta = saveSession(messagesRef.current);
        navigate(`/chat?id=${encodeURIComponent(meta.id)}`, { replace: true });
        alert(`Sparat som: ${meta.title}`);
      }
      setInput("");
      return true;
    }

    return false;
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;
    if (handleCommand(input)) {
      setInput("");
      return;
    }

    const next: Msg[] = [
      ...messagesRef.current,
      { role: "user", content: input.trim() },
    ];
    setMessages(next);
    setInput("");
    setLoading(true);

    let currentId = sessionId;
    const userCount = next.filter((m) => m.role === "user").length;
    if (!currentId && userCount === 1) {
      const meta = saveSession(next);
      currentId = meta.id;
      navigate(`/chat?id=${encodeURIComponent(meta.id)}`, { replace: true });
    } else if (currentId) {
      updateSession(currentId, next);
    }

    const cfg = loadConfig();
    const payload = {
      messages: next,
      model: cfg.model,
      temperature: typeof cfg.temperature === "number" ? cfg.temperature : 0.7,
      system: systemFrom(cfg),
    };

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply = data?.reply?.content || "Tyvärr, något gick fel.";
      const updated = [...next, { role: "assistant", content: reply } as Msg];
      setMessages(updated);

      if (currentId) updateSession(currentId, updated);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Nätverksfel eller API-fel. Är API:t igång?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <>
      <div className={s.chatBox}>
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? s.msgUser : s.msgBot}>
            {m.content}
          </div>
        ))}
        {loading && <div className={s.typing}>Assistenten skriver…</div>}
        <div ref={chatEndRef} />
      </div>

      <div className={s.inputRow}>
        <input
          className={s.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Skriv ett meddelande och tryck Enter…"
        />
        <button
          className={s.button}
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          Skicka
        </button>
      </div>
    </>
  );
}
