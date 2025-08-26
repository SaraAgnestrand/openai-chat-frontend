import { useEffect, useRef, useState } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import * as s from "./app.css";
import { API_BASE } from "./config";
import { Header } from "./components/Header";
import { Home } from "./components/Home";

type Msg = { role: "user" | "assistant"; content: string };

export default function App() {
  return (
    <HashRouter>
      <div className={s.container}>
        <Header
          onReset={() =>
            window.dispatchEvent(new CustomEvent("nextchat:reset"))
          }
          onExport={() =>
            window.dispatchEvent(new CustomEvent("nextchat:export"))
          }
        />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatView />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

/* ------- Views ------- */
function ChatView() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hej! Hur kan jag hjälpa dig idag?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
    if (s.trim() === "/reset") {
      setMessages([
        { role: "assistant", content: "Nollställd. Vad vill du prata om?" },
      ]);
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

function History() {
  return (
    <div style={{ width: "100%" }}>
      <h2 className={s.header}>Historik</h2>
      <div className={s.msgBot} style={{ maxWidth: "100%" }}>
        Här kommer dina sparade konversationer (implementeras senare).
      </div>
    </div>
  );
}

function Settings() {
  return (
    <div style={{ width: "100%" }}>
      <h2 className={s.header}>Inställningar</h2>
      <div className={s.msgBot} style={{ maxWidth: "100%" }}>
        Modell/temperatur/personlighet och tema (implementeras senare).
      </div>
    </div>
  );
}

function NotFound() {
  return <div className={s.msgBot}>Sidan finns inte.</div>;
}
