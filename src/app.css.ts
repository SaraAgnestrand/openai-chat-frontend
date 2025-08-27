import { style } from "@vanilla-extract/css";
const MAX_WIDTH = "860px";
const COLOR_PRIMARY = "#2c3c8b";
const COLOR_PRIMARY_DARK = "#24337a";
const COLOR_PRIMARY_HOVER = "#31439d";
const ACCENT_HOVER_BG = "#e6f0fa";

export const topbar = style({
  position: "fixed",
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
  background: COLOR_PRIMARY,
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  padding: "8px 12px",
  cursor: "pointer",
  fontSize: "14px",
  selectors: {
    "&:hover": { opacity: 0.95 },
    "&:focus-visible": {
      outline: `2px solid ${ACCENT_HOVER_BG}`,
      outlineOffset: 2,
    },
  },
});

export const dropdown = style({
  position: "absolute",
  top: "110%",
  right: 0,
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  boxShadow: "0 10px 28px rgba(0,0,0,0.10)",
  display: "flex",
  flexDirection: "column",
  minWidth: "120px",
  overflow: "hidden",
  zIndex: 30,
  padding: 6,
});

export const dropdownItem = style({
  background: "transparent",
  border: "none",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px 12px",
  fontSize: "14px",
  color: "#334155",
  cursor: "pointer",
  borderRadius: "8px",
  textAlign: "left",
  width: "100%",
  selectors: {
    "&:hover": { background: ACCENT_HOVER_BG, color: COLOR_PRIMARY_DARK },
    "&:active": { transform: "translateY(1px)" },
    "&:focus-visible": {
      outline: `2px solid ${COLOR_PRIMARY}`,
      outlineOffset: 2,
    },
    "& + &": { marginTop: 4 },
  },
});
export const dropdownIcon = style({
  fontSize: "16px",
  color: COLOR_PRIMARY,
  flexShrink: 0,
});

export const dropdownIconLight = style({
  color: "#fff",
});

export const dropdownItemAccent = style([
  dropdownItem,
  {
    background: COLOR_PRIMARY,
    color: "#fff",
  },
]);

export const iconButton = style({
  width: 44,
  height: 44,
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
  background: "#fff",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
  marginLeft: 8,
  selectors: {
    "&:hover": { background: ACCENT_HOVER_BG },
    "&:focus-visible": {
      outline: `2px solid ${COLOR_PRIMARY}`,
      outlineOffset: 2,
    },
  },
});

export const iconGlyph = style({
  fontSize: "18px",
  color: COLOR_PRIMARY,
});

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
  height: "52px",
  padding: "0 18px",
  border: "none",
  borderRadius: "10px",
  background: COLOR_PRIMARY_DARK,
  color: "#fff",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: 600,
  transition: "transform 0.18s ease, background 0.18s ease",
  selectors: {
    "&:hover": {
      transform: "translateY(-1px)",
      background: COLOR_PRIMARY_HOVER,
    },
    "&:active": { transform: "translateY(0)" },
    "&:disabled": { opacity: 0.7, cursor: "not-allowed" },
    "&:focus-visible": {
      outline: `2px solid ${ACCENT_HOVER_BG}`,
      outlineOffset: 2,
    },
  },
});

export const typing = style({
  fontSize: "12px",
  color: "#6b7280",
});
