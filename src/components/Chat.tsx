// src/components/Chat.tsx
import { useEffect, useRef, useState } from "react";
import * as s from "../app.css";
import { API_BASE } from "../config";
import { loadConfig, systemFrom } from "../lib/appConfig";
import { FiCopy } from "react-icons/fi";

const SIM_THRESHOLD = 0.6;

type Msg = { role: "user" | "assistant"; content: string };

type RagHit = {
  content: string;
  score: number;
  meta?: { docId?: string; path?: string };
};

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hej! Hur kan jag hjälpa dig idag?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef(messages);
  const [lastRagHits, setLastRagHits] = useState<RagHit[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!taRef.current) return;
    taRef.current.style.height = "auto";
    taRef.current.style.height = `${taRef.current.scrollHeight}px`;
  }, [input]);

  async function fetchRagHits(question: string, topK: number) {
    const res = await fetch(`${API_BASE}/api/rag/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: question, topK }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.hits ?? []) as RagHit[];
  }

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

    setLastRagHits([]);

    const next: Msg[] = [
      ...messagesRef.current,
      { role: "user", content: input.trim() },
    ];
    setMessages(next);
    setInput("");
    setLoading(true);

    const cfg = loadConfig();
    const baseMessages = next;

    let finalMessages = baseMessages;
    let ragHits: RagHit[] = [];

    if (cfg.useRag) {
      const lastUser = baseMessages[baseMessages.length - 1];
      if (lastUser?.role === "user") {
        ragHits = await fetchRagHits(
          lastUser.content,
          Number(cfg.ragTopK ?? 4)
        );

        const context = ragHits.map((h) => h.content).join("\n---\n");

        const bestDist = ragHits.length
          ? Math.min(...ragHits.map((h) => h.score))
          : 1;
        const bestSim = Math.max(0, 1 - bestDist); // 0..1
        const okContext = Boolean(context) && bestSim >= SIM_THRESHOLD;

        if (okContext) {
          const injected =
            `Använd endast nedanstående kontext när du svarar. ` +
            `Om svaret saknas i kontexten, säg att du inte vet.\n` +
            `KONTEKST:\n${context}\n\nFRÅGA:\n${lastUser.content}`;

          finalMessages = [
            ...baseMessages.slice(0, -1),
            { role: "user", content: injected },
          ];
          setLastRagHits(ragHits);
        } else {
          setLastRagHits([]);
        }
      }
    }

    const payload = {
      messages: finalMessages,
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
        {
          role: "assistant",
          content: "Nätverksfel eller API-fel. Är API:t igång?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  async function copyMessage(content: string, idx: number) {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1200);
    } catch {}
  }

  return (
    <>
      <div className={s.chatBox}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user" ? s.msgUser : `${s.msgBot} ${s.bubbleHasAction}`
            }
          >
            {m.content}
            {m.role === "assistant" && (
              <button
                className={s.copyBtn}
                onClick={() => copyMessage(m.content, i)}
              >
                <FiCopy />
              </button>
            )}
            {lastRagHits.length > 0 && (
              <div className={s.msgBot}>
                <strong>Källor:</strong>
                <ul style={{ marginTop: 6 }}>
                  {lastRagHits.map((h, i) => (
                    <li key={i}>
                      {h.meta?.docId ?? "okänd fil"}{" "}
                      <small>
                        (likhet {((1 - h.score) * 100).toFixed(0)}%)
                      </small>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        {loading && <div className={s.typing}>Assistenten skriver…</div>}
        <div ref={chatEndRef} />
      </div>

      <div className={s.inputRow}>
        <textarea
          ref={taRef}
          className={s.textarea}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Skriv ett meddelande (Shift+Enter = ny rad)…"
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
