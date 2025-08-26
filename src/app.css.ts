// src/app.css.ts
import { style } from "@vanilla-extract/css";

const MAX_WIDTH = "860px";
/* ---------- Modern topbar ---------- */
export const topbar = style({
  position: "fixed", // Gör att den ligger fast högst upp
  top: 0,
  left: 0,
  width: "100%",
  zIndex: 20,
  background: "rgba(255,255,255,0.9)",
  backdropFilter: "blur(8px)",
  borderBottom: "1px solid #e5e7eb",
  boxSizing: "border-box",
  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
});

export const topbarInner = style({
  margin: "0 auto",
  maxWidth: MAX_WIDTH,
  padding: "10px 16px",

  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const brand = style({
  fontWeight: 700,
  fontSize: "38px",
  background: "linear-gradient(90deg, #93c5fd, #1e40af)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});

export const nav = style({
  display: "flex",
  gap: "8px",
  marginLeft: "300px",
  flex: 1,
  paddingRight: "30px",
});

export const navItem = style({
  padding: "6px 10px",
  borderRadius: "9999px",
  color: "#334155",
  fontSize: "14px",
  textDecoration: "none",
  selectors: { "&:hover": { background: "#eef2f7" } },
});

export const active = style({
  background: "#e6f0fa",
  color: "#1e3a8a",
  fontWeight: 600,
});

export const actions = style({
  marginLeft: "auto",
  display: "flex",
  alignItems: "center",
});

export const menuButton = style({
  background: "#2c3c8b",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: "14px",
  selectors: { "&:hover": { opacity: 0.95 } },
});

export const dropdown = style({
  position: "absolute",
  top: "110%",
  right: 0,
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  minWidth: "180px",
  overflow: "hidden",
  zIndex: 30,
});

export const dropdownButton = style({
  background: "transparent",
  border: "none",
  textAlign: "left",
  padding: "10px 12px",
  fontSize: "14px",
  cursor: "pointer",
  selectors: {
    "&:hover": { background: "#f3f4f6" },
  },
});

/* ---------- App layout ---------- */
export const container = style({
  margin: "0 auto",
  maxWidth: MAX_WIDTH,
  padding: "24px",
  paddingTop: "120px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  fontFamily: "Inter, system-ui, Arial, sans-serif",
  alignItems: "center",
});

export const header = style({
  fontSize: "32px",
  fontWeight: 600,
  textAlign: "center",
  background: "linear-gradient(90deg, #93c5fd, #1e40af)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  letterSpacing: "0.5px",
  marginBottom: "12px",
  fontFamily: "'Inter', sans-serif",
});

/* ---------- Chat box ---------- */
export const chatBox = style({
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "16px 24px",
  height: "60vh",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  boxSizing: "border-box",
  background: "linear-gradient(180deg,#fff,#fbfdff)",
});

/* ---------- Messages ---------- */
export const msgUser = style({
  alignSelf: "flex-end",
  background: "#dbeafe",
  padding: "10px 14px",
  borderRadius: "12px 12px 0 12px",
  maxWidth: "75%",
  textAlign: "left",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  marginBottom: "12px",
  lineHeight: 1.55,
});

export const msgBot = style({
  alignSelf: "flex-start",
  background: "#f3f4f6",
  padding: "10px 14px",
  borderRadius: "12px 12px 12px 0",
  maxWidth: "75%",
  textAlign: "left",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  marginBottom: "12px",
  lineHeight: 1.55,
});

/* ---------- Composer (input + button) ---------- */
export const inputRow = style({
  display: "flex",
  gap: "8px",
  width: "100%",
  marginTop: "8px",
  position: "sticky",
  bottom: 0,
  background: "transparent",
  paddingTop: "8px",
});

export const input = style({
  flex: 1,
  padding: "14px 16px",
  fontSize: "16px",
  height: "52px",
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  lineHeight: "1.4",
  boxSizing: "border-box",
  outline: "none",
  selectors: {
    "&:focus": {
      borderColor: "#93c5fd",
      boxShadow: "0 0 0 2px rgba(147,197,253,0.5)",
    },
  },
});

export const button = style({
  padding: "12px 16px",
  border: "none",
  borderRadius: "10px",
  background: "#2c3c8bff",
  color: "#fff",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: 500,
  transition: "transform 0.2s ease",
  selectors: {
    "&:hover": { transform: "scale(1.05)" },
    "&:disabled": { opacity: 0.7, cursor: "not-allowed" },
  },
});

/* ---------- Typing indicator ---------- */
export const typing = style({
  fontSize: "12px",
  color: "#6b7280",
});
