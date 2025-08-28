export type Role = "user" | "assistant";
export type Msg = { role: Role; content: string };

export type SessionMeta = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type Session = SessionMeta & { messages: Msg[] };
