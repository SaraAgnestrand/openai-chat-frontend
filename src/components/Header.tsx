import { useState } from "react";
import * as s from "../app.css";

type HeaderProps = {
  onReset: () => void;
  onExport: () => void;
};

export function Header({ onReset, onExport }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className={s.topbar}>
      <div className={s.topbarInner}>
        <div className={s.brand}>NextChat</div>

        <nav className={s.nav}>
          <a className={`${s.navItem} ${s.active}`} href="#">
            Home
          </a>
          <a className={s.navItem} href="#">
            Chat
          </a>
          <a className={s.navItem} href="#">
            History
          </a>
          <a className={s.navItem} href="#">
            Settings
          </a>
        </nav>

        <div className={s.actions}>
          <button
            className={s.menuButton}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>

          {open && (
            <div className={s.dropdown}>
              <button
                onClick={() => {
                  setOpen(false);
                  onReset();
                }}
              >
                🔄 Reset
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  onExport();
                }}
              >
                ⬇️ Exportera
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
