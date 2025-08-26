import { useState } from "react";
import { NavLink } from "react-router-dom";
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
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${s.navItem} ${isActive ? s.active : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `${s.navItem} ${isActive ? s.active : ""}`
            }
          >
            Chat
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `${s.navItem} ${isActive ? s.active : ""}`
            }
          >
            History
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `${s.navItem} ${isActive ? s.active : ""}`
            }
          >
            Settings
          </NavLink>
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
