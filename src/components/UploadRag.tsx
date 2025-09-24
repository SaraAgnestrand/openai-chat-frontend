// src/components/UploadRag.tsx
import { useRef, useState } from "react";
import { API_BASE } from "../config";
import { FiUploadCloud } from "react-icons/fi";
import * as s from "../app.css";

type Props = {
  onIndexed?: (res: { chunks: number; files: string[] }) => void;
  onClose?: () => void;
  variant?: "button" | "menu";
  label?: string;
};

export default function UploadRag({
  onIndexed,
  onClose,
  variant = "button",
  label,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setBusy(true);
    try {
      const form = new FormData();
      for (const f of files) form.append("files", f);

      const res = await fetch(`${API_BASE}/api/rag/index`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const chunks = Number.isFinite(data?.chunks) ? data.chunks : 0;
      const filesNames = Array.isArray(data?.files) ? data.files : [];
      onIndexed?.({ chunks, files: filesNames });
    } catch (err) {
      console.error("Indexering misslyckades:", err);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
      onClose?.();
    }
  }

  const isMenu = variant === "menu";
  const text =
    label ??
    (isMenu
      ? busy
        ? "Indexerar…"
        : "Lägg till kunskap"
      : busy
      ? "Indexerar…"
      : "Lägg till kunskap");

  return (
    <>
      {isMenu ? (
        <button
          className={s.dropdownItem}
          role="menuitem"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          aria-label="Lägg till kunskap"
        >
          <FiUploadCloud className={s.dropdownIcon} />
          <span>{text}</span>
        </button>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="button-secondary"
          aria-label="Lägg upp dokument för indexering"
        >
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <FiUploadCloud />
            {text}
          </span>
        </button>
      )}

      {/* Filväljare */}
      <input
        ref={inputRef}
        type="file"
        accept=".md,.txt,.pdf"
        multiple
        onChange={onPick}
        style={{ display: "none" }}
      />
    </>
  );
}
