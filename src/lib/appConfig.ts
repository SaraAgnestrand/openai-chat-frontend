// src/lib/appConfig.ts
export type AppConfig = {
  model: string;
  temperature: number;
  personality: "vänlig" | "pedagogisk" | "strikt" | "kortfattad";
  customSystem: string;
  theme: "light" | "dark";
  useRag?: boolean;
  ragTopK?: number;
};

const KEY = "nextchat:config";

export const DEFAULT_CFG: AppConfig = {
  model: "gpt-4o-mini",
  temperature: 0.7,
  personality: "vänlig",
  customSystem: "",
  theme: "light",
  useRag: true,
  ragTopK: 4,
};

export function loadConfig(): AppConfig {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    return { ...DEFAULT_CFG, ...(raw || {}) };
  } catch {
    return DEFAULT_CFG;
  }
}

export function saveConfig(cfg: AppConfig) {
  localStorage.setItem(KEY, JSON.stringify(cfg));
  document.documentElement.dataset.theme = cfg.theme;
}

export function systemFrom(cfg: AppConfig) {
  const presets: Record<AppConfig["personality"], string> = {
    vänlig: "Du är varm och hjälpsam. Svara kort och konkret på svenska.",
    pedagogisk: "Var pedagogisk, förklara stegvis och ge exempel.",
    strikt: "Var strikt och faktabaserad. Be om mer data vid oklarhet.",
    kortfattad: "Svara mycket kort. Använd punktlistor när möjligt.",
  };
  return (
    (cfg.customSystem && cfg.customSystem.trim()) || presets[cfg.personality]
  );
}
