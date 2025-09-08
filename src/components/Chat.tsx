// src/components/Chat.tsx
import { useEffect, useRef, useState } from "react";
import * as s from "../app.css";
import { API_BASE } from "../config";
import { loadConfig, systemFrom } from "../lib/appConfig";
import { FiCopy } from "react-icons/fi";

const SIM_THRESHOLD = 0.3; // "likhet" = 1 - distans, godkänn från ~30% och uppåt
const MIN_DIST_OK = 1.2; // godkänn också om distansen är tillräckligt låg
const MIN_SIM_TO_SHOW = 0.05; // visa ej källrad om likheten < 5%

type RagHit = {
  content: string;
  score: number;
  meta?: { docId?: string; path?: string };
};

type Msg = { role: "user" | "assistant"; content: string; sources?: RagHit[] };

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

  function detectDocId(text: string) {
    const m = text.match(/\b([\w.-]+\.(md|txt|pdf))\b/i);
    return m?.[1];
  }

  async function fetchRagHits(question: string, topK: number) {
    const docId = detectDocId(question);
    const base = { q: question, topK };

    try {
      if (docId) {
        const res1 = await fetch(`${API_BASE}/api/rag/query`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...base, docId }),
        });
        if (res1.ok) {
          const d1 = await res1.json();
          const hits1 = (d1?.hits ?? []) as RagHit[];
          if (hits1.length > 0) return hits1;
        }
      }

      const res2 = await fetch(`${API_BASE}/api/rag/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(base),
      });
      if (!res2.ok) return [];
      const d2 = await res2.json();
      return (d2?.hits ?? []) as RagHit[];
    } catch {
      return [];
    }
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
    let okContext = false;

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
          : Infinity; // ✨
        const bestSim = Math.max(0, 1 - bestDist);

        okContext =
          Boolean(context) &&
          (bestDist <= MIN_DIST_OK || bestSim >= SIM_THRESHOLD);

        if (okContext) {
          const injected =
            `Använd endast nedanstående kontext när du svarar. ` +
            `Om svaret saknas i kontexten, säg att du inte vet.\n` +
            `KONTEKST:\n${context}\n\nFRÅGA:\n${lastUser.content}`;

          finalMessages = [
            ...baseMessages.slice(0, -1),
            { role: "user", content: injected },
          ];
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
          sources: okContext ? ragHits : undefined,
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

  function simPct(score: number) {
    return Math.max(0, Math.min(1, 1 - score)) * 100;
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
              <>
                <button
                  className={s.copyBtn}
                  onClick={() => copyMessage(m.content, i)}
                >
                  <FiCopy />
                </button>

                {m.sources?.length
                  ? (() => {
                      const byDoc = new Map<string, RagHit>();
                      for (const h of m.sources) {
                        const key = h.meta?.docId ?? "okänd fil";
                        const best = byDoc.get(key);
                        if (!best || h.score < best.score) byDoc.set(key, h);
                      }

                      const hitsToShow = Array.from(byDoc.entries())
                        .map(([docId, h]) => ({ docId, h }))
                        .filter(({ h }) => 1 - h.score >= MIN_SIM_TO_SHOW)
                        .sort((a, b) => a.h.score - b.h.score)
                        .slice(0, 5);

                      if (!hitsToShow.length) return null;

                      return (
                        <div style={{ marginTop: 8 }}>
                          <strong>Källor:</strong>
                          <ul style={{ marginTop: 6 }}>
                            {hitsToShow.map(({ docId, h }, idx) => (
                              <li key={idx}>
                                {docId}{" "}
                                <small>
                                  (likhet {simPct(h.score).toFixed(0)}%)
                                </small>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })()
                  : null}
              </>
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
