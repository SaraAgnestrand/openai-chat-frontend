import type { Msg, Session, SessionMeta } from "./types";
const KEY = "nextchat:sessions";

type DB = Record<string, Session>;
const loadDB = (): DB => JSON.parse(localStorage.getItem(KEY) || "{}");
const saveDB = (db: DB) => localStorage.setItem(KEY, JSON.stringify(db));

const newId = () =>
  "s_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 7);
const makeTitle = (msgs: Msg[]) => {
  const first =
    msgs.find((m) => m.role === "user")?.content?.trim() || "Ny konversation";
  const words = first.split(/\s+/).slice(0, 8).join(" ") || "Ny konversation";
  return words.length > 60 ? words.slice(0, 57) + "…" : words;
};

export function listSessions(): SessionMeta[] {
  const db = loadDB();
  return Object.values(db)
    .map(({ id, title, createdAt, updatedAt }) => ({
      id,
      title,
      createdAt,
      updatedAt,
    }))
    .sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1));
}
export const getSession = (id: string): Session | null => loadDB()[id] ?? null;

export function saveSession(messages: Msg[], title?: string): SessionMeta {
  const db = loadDB();
  const id = newId();
  const now = new Date().toISOString();
  const t = title?.trim() || makeTitle(messages);
  db[id] = { id, title: t, createdAt: now, updatedAt: now, messages };
  saveDB(db);
  return { id, title: t, createdAt: now, updatedAt: now };
}

export function updateSession(
  id: string,
  messages: Msg[],
  title?: string
): SessionMeta | null {
  const db = loadDB();
  const cur = db[id];
  if (!cur) return null;
  const now = new Date().toISOString();
  const t = title?.trim() || cur.title || makeTitle(messages);
  db[id] = { ...cur, title: t, updatedAt: now, messages };
  saveDB(db);
  return { id, title: t, createdAt: db[id].createdAt, updatedAt: now };
}

export function deleteSession(id: string): boolean {
  const db = loadDB();
  if (!db[id]) return false;
  delete db[id];
  saveDB(db);
  return true;
}
