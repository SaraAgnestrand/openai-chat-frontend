import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import * as s from "../app.css";
import { listSessions, deleteSession } from "../lib/storage";
import type { SessionMeta } from "../lib/types";
import { FiExternalLink, FiTrash2 } from "react-icons/fi";

export default function History() {
  const [items, setItems] = useState<SessionMeta[]>([]);
  const refresh = () => setItems(listSessions());
  useEffect(() => {
    refresh();
  }, []);

  function onDelete(id: string) {
    if (confirm("Radera den här konversationen?")) {
      deleteSession(id);
      refresh();
    }
  }

  return (
    <div style={{ width: "100%" }}>
      <h2 className={s.header}>Historik</h2>

      {!items.length && (
        <div className={s.msgBot} style={{ maxWidth: "100%" }}>
          Inga sparade konversationer ännu. Skriv <code>/save</code> i chatten
          för att spara.
        </div>
      )}

      <div className={s.historyList}>
        {items.map((it) => (
          <div key={it.id} className={s.historyItem}>
            <div>
              <NavLink
                to={`/chat?id=${encodeURIComponent(it.id)}`}
                className={s.historyTitleLink}
              >
                {it.title}
              </NavLink>
              <div className={s.historyMeta}>
                Skapad {new Date(it.createdAt).toLocaleString()} • Uppdaterad{" "}
                {new Date(it.updatedAt).toLocaleString()}
              </div>
            </div>

            <div className={s.historyActions}>
              <NavLink
                to={`/chat?id=${encodeURIComponent(it.id)}`}
                className={s.actionGhost}
                aria-label="Öppna konversation"
              >
                <FiExternalLink className={s.iconSm} />
                Öppna
              </NavLink>
              <button
                className={s.actionGhostDanger}
                onClick={() => onDelete(it.id)}
                aria-label="Radera konversation"
              >
                <FiTrash2 className={s.iconSm} />
                Radera
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
