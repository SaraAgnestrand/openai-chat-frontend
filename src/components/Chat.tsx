// src/components/Chat.tsx
import { useEffect, useRef, useState } from "react";
import * as s from "../app.css";
import { API_BASE } from "../config";
import { loadConfig, systemFrom } from "../lib/appConfig";
import { FiCopy } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import { createSession, updateSession, getSession } from "../lib/storage";

const MIN_SIM_TO_SHOW = 0.03;

type RagHit = {
  content: string;
  score: number;
  meta?: {
    docId?: string;
    path?: string;
    page?: number;
    start?: number;
    end?: number;
  };
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
  const messagesRef = useRef<Msg[]>(messages);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    const id = searchParams.get("id");

    if (!id) {
      setSessionId(null);
      sessionIdRef.current = null;
      return;
    }

    const s = getSession(id);
    if (s && Array.isArray(s.messages)) {
      setSessionId(id);
      sessionIdRef.current = id;
      setMessages(s.messages as Msg[]);
    }
  }, [searchParams]);

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
    const m = text.match(/(?<![\w.-])([\w.-]+\.(?:md|txt|pdf))(?![\w-])/i);
    return m ? m[1] : undefined;
  }

  function persist(messagesToSave: Msg[], title?: string) {
    const idNow = sessionIdRef.current;

    if (!idNow) {
      const meta = createSession(messagesToSave, title);
      if (meta) {
        sessionIdRef.current = meta.id;
        setSessionId(meta.id);
      }
    } else {
      updateSession(idNow, messagesToSave, title);
    }
  }

  function cleanQueryForRag(q: string) {
    q = q.replace(
      /(?:\bi\s+)?(?<![\w.-])([\w.-]+\.(?:md|txt|pdf))(?![\w-])[,;:!?)]*/gi,
      ""
    );
    q = q.replace(/\([^)]*\)/g, "");
    return q.replace(/\s{2,}/g, " ").trim();
  }

  async function fetchRagHits(question: string, topK: number) {
    const docId = detectDocId(question);
    const qClean = cleanQueryForRag(question);

    const isWeak = qClean.length < 8;
    const qForDoc = isWeak ? "översikt innehåll sammanfattning" : qClean;

    const MIN_SIM_TO_KEEP = 0.05;

    const qDoc = docId
      ? fetch(`${API_BASE}/api/rag/query`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ q: qForDoc, topK, docId }),
        })
          .then((r) => (r.ok ? r.json() : { hits: [] }))
          .catch(() => ({ hits: [] }))
      : Promise.resolve({ hits: [] });

    const qGlobal = fetch(`${API_BASE}/api/rag/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: qClean, topK }),
    })
      .then((r) => (r.ok ? r.json() : { hits: [] }))
      .catch(() => ({ hits: [] }));

    const [d1, d2] = await Promise.all([qDoc, qGlobal]);
    const raw: RagHit[] = ([] as RagHit[]).concat(
      d1?.hits ?? [],
      d2?.hits ?? []
    );

    console.debug("RAG raw", {
      askedDoc: docId,
      rawCount: raw.length,
      hits: raw.map((h) => ({
        doc: h.meta?.docId,
        sim: +(1 - h.score).toFixed(3),
      })),
    });

    const cleaned = raw.filter(
      (h) => Math.max(0, 1 - (h.score ?? 1)) >= MIN_SIM_TO_KEEP
    );
    const arr = cleaned.length ? cleaned : raw;

    const byDoc = new Map<string, RagHit>();
    for (const h of arr) {
      const key = h.meta?.docId ?? "okänd fil";
      const best = byDoc.get(key);
      if (!best || h.score < best.score) byDoc.set(key, h);
    }

    const merged = Array.from(byDoc.values())
      .sort((a, b) => a.score - b.score)
      .slice(0, topK);
    console.debug(
      "RAG merged (return)",
      merged.map((h) => ({
        doc: h.meta?.docId,
        sim: +(1 - h.score).toFixed(3),
      }))
    );
    return merged;
  }
  function handleCommand(s: string) {
    const cmd = s.trim().toLowerCase();

    if (cmd === "/reset") {
      setMessages([
        { role: "assistant", content: "Nollställd. Vad vill du prata om?" },
      ]);
      setInput("");
      setSessionId(null);
      sessionIdRef.current = null;
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

    const userText = input.trim();

    const next: Msg[] = [
      ...messagesRef.current,
      { role: "user", content: userText },
    ];
    setMessages(next);
    setInput("");
    setLoading(true);

    const maybeTitle =
      messagesRef.current.length === 1 ? userText.slice(0, 60) : undefined;
    persist(next, maybeTitle);

    const cfg = loadConfig();
    const baseMessages = next;

    let finalMessages = baseMessages;
    let ragHits: RagHit[] = [];
    let okContext = false;

    if (cfg.useRag) {
      const lastUser = baseMessages[baseMessages.length - 1];
      if (lastUser?.role === "user") {
        const askedDoc = detectDocId(lastUser.content);

        ragHits = await fetchRagHits(
          lastUser.content,
          Number(cfg.ragTopK ?? 8)
        );

        const dists = ragHits.map((h) => h.score);
        const bestDist = dists.length ? Math.min(...dists) : Infinity;
        const bestSim = Math.max(0, 1 - bestDist);
        const hasDocIdHit =
          !!askedDoc &&
          ragHits.some(
            (h) =>
              (h.meta?.docId || "").toLowerCase() === askedDoc.toLowerCase()
          );

        const SIM_THRESHOLD = 0.22;
        const MIN_DIST_OK = 1.35;

        okContext =
          Boolean(ragHits.length) &&
          (hasDocIdHit || bestSim >= SIM_THRESHOLD || bestDist <= MIN_DIST_OK);

        console.debug("RAG after gating", {
          askedDoc,
          hits: ragHits.map((h) => ({
            doc: h.meta?.docId,
            sim: Number((1 - h.score).toFixed(3)),
          })),
          bestDist,
          bestSim: Number(bestSim.toFixed(3)),
          hasDocIdHit,
          okContext,
        });

        if (okContext) {
          const context = ragHits.map((h) => h.content).join("\n---\n");
          const injected =
            `Använd i första hand nedanstående kontext. ` +
            `Om svaret saknas, säg det tydligt.\n` +
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

      const asstMsg: Msg = {
        role: "assistant",
        content: data?.reply?.content || "Tyvärr, något gick fel.",
        sources: ragHits.length ? ragHits : undefined,
      };

      const withAssistant = [...next, asstMsg];
      setMessages(withAssistant);
      persist(withAssistant);
    } catch {
      const errMsg: Msg = {
        role: "assistant",
        content: "Nätverksfel eller API-fel. Är API:t igång?",
      };
      setMessages((prev) => [...prev, errMsg]);
      persist([...next, errMsg]);
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
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: 8,
          gap: 12,
        }}
      ></div>
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
                      for (const h of m.sources!) {
                        const key = h.meta?.docId ?? "okänd fil";
                        const best = byDoc.get(key);
                        if (!best || h.score < best.score) byDoc.set(key, h);
                      }

                      let hitsToShow = Array.from(byDoc.entries())
                        .map(([docId, h]) => ({ docId, h }))
                        .filter(({ h }) => 1 - h.score >= MIN_SIM_TO_SHOW)
                        .sort((a, b) => a.h.score - b.h.score)
                        .slice(0, 5);

                      if (!hitsToShow.length) {
                        hitsToShow = Array.from(byDoc.entries())
                          .map(([docId, h]) => ({ docId, h }))
                          .sort((a, b) => a.h.score - b.h.score)
                          .slice(0, 1);
                      }

                      return (
                        <div style={{ marginTop: 8 }}>
                          <strong>Källor:</strong>
                          <ul style={{ marginTop: 6 }}>
                            {hitsToShow.map(({ docId, h }, idx) => (
                              <li key={idx}>
                                {docId}{" "}
                                <small>
                                  {typeof h.meta?.page === "number"
                                    ? `(sid ${h.meta.page}, likhet ${simPct(
                                        h.score
                                      ).toFixed(0)}%)`
                                    : `(likhet ${simPct(h.score).toFixed(0)}%)`}
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
