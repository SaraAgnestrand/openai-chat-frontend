import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiRotateCcw, FiDownload } from "react-icons/fi";
import * as s from "../app.css";

type HeaderProps = { onReset: () => void; onExport: () => void };

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
            Hem
          </NavLink>
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `${s.navItem} ${isActive ? s.active : ""}`
            }
          >
            Chatt
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `${s.navItem} ${isActive ? s.active : ""}`
            }
          >
            Historik
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `${s.navItem} ${isActive ? s.active : ""}`
            }
          >
            Inställningar
          </NavLink>
        </nav>

        <div className={s.actions} style={{ position: "relative" }}>
          <button
            className={s.menuButton}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label="Snabbåtgärder"
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>

          {open && (
            <div className={s.dropdown} role="menu" aria-label="Snabbåtgärder">
              <button
                className={s.dropdownItem}
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onReset();
                }}
              >
                <FiRotateCcw className={s.dropdownIcon} />
                <span>Nollställ</span>
              </button>
              <button
                className={s.dropdownItem}
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onExport();
                }}
              >
                <FiDownload className={s.dropdownIcon} />
                <span>Exportera</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
