import { style } from "@vanilla-extract/css";

export const container = style({
  margin: "0 auto",
  maxWidth: "720px",
  padding: "24px",
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
  background: "#fff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
});

export const msgUser = style({
  alignSelf: "flex-end",
  background: "#dbeafe",
  padding: "10px 14px",
  borderRadius: "12px 12px 0 12px",
  maxWidth: "75%",
  textAlign: "left",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  marginBottom: "8px",
});

export const msgBot = style({
  alignSelf: "flex-start",
  background: "#f3f4f6",
  padding: "10px 14px",
  borderRadius: "12px 12px 12px 0",
  maxWidth: "75%",
  textAlign: "left",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  marginBottom: "8px",
});

export const inputRow = style({
  display: "flex",
  gap: "8px",
  width: "100%",
  marginTop: "8px",
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
      boxShadow: "0 0 0 2px rgba(147, 197, 253, 0.5)",
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
  ":hover": {
    transform: "scale(1.05)",
  },
  ":disabled": {
    opacity: 0.7,
    cursor: "not-allowed",
  },
});

export const typing = style({
  fontSize: "12px",
  color: "#6b7280",
});
