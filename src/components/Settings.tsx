// src/components/Settings.tsx
import { useEffect, useState } from "react";
import * as s from "../app.css";
import { loadConfig, saveConfig, type AppConfig } from "../lib/appConfig";

export default function Settings() {
  const [cfg, setCfg] = useState<AppConfig>(loadConfig());

  // Sätt tema-attributet direkt när sidan öppnas/ändras
  useEffect(() => {
    document.documentElement.dataset.theme = cfg.theme;
  }, [cfg.theme]);

  function update<K extends keyof AppConfig>(k: K, v: AppConfig[K]) {
    setCfg((prev) => ({ ...prev, [k]: v }));
  }

  function onSave() {
    saveConfig(cfg);
    alert("Inställningar sparade.");
  }

  return (
    <div style={{ width: "100%" }}>
      <h2 className={s.header}>Inställningar</h2>

      {/* Modell */}
      <div className={s.msgBot} style={{ maxWidth: "100%" }}>
        <label>
          Modell:&nbsp;
          <select
            value={cfg.model}
            onChange={(e) => update("model", e.target.value)}
          >
            <option value="gpt-4o-mini">gpt-4o-mini</option>
            <option value="gpt-4o">gpt-4o</option>
            <option value="gpt-4.1">gpt-4.1</option>
          </select>
        </label>
      </div>

      {/* Temperatur */}
      <div className={s.msgBot} style={{ maxWidth: "100%", marginTop: 12 }}>
        <label>
          Temperatur: {cfg.temperature.toFixed(2)}&nbsp;
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={cfg.temperature}
            onChange={(e) => update("temperature", Number(e.target.value))}
          />
        </label>
      </div>

      {/* Personlighet */}
      <div className={s.msgBot} style={{ maxWidth: "100%", marginTop: 12 }}>
        <label>
          Personlighet:&nbsp;
          <select
            value={cfg.personality}
            onChange={(e) =>
              update("personality", e.target.value as AppConfig["personality"])
            }
          >
            <option value="vänlig">Vänlig</option>
            <option value="pedagogisk">Pedagogisk</option>
            <option value="strikt">Strikt</option>
            <option value="kortfattad">Kortfattad</option>
          </select>
        </label>
        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
          {/* Liten hint till användaren */}
          Du kan även skriva en egen systemprompt nedan.
        </div>
      </div>

      {/* Egen systemprompt */}
      <div className={s.msgBot} style={{ maxWidth: "100%", marginTop: 12 }}>
        <label>
          Egen systemprompt (valfritt):
          <textarea
            style={{ width: "100%", height: 120, marginTop: 8 }}
            value={cfg.customSystem}
            onChange={(e) => update("customSystem", e.target.value)}
            placeholder="Skriv din egen systemprompt…"
          />
        </label>
      </div>

      {/* Tema */}
      <div className={s.msgBot} style={{ maxWidth: "100%", marginTop: 12 }}>
        <label>
          Tema:&nbsp;
          <select
            value={cfg.theme}
            onChange={(e) =>
              update("theme", e.target.value as AppConfig["theme"])
            }
          >
            <option value="light">Ljust</option>
            <option value="dark">Mörkt</option>
          </select>
        </label>
      </div>

      {/* Spara */}
      <div style={{ marginTop: 12 }}>
        <button className={s.button} onClick={onSave}>
          Spara
        </button>
      </div>
    </div>
  );
}
