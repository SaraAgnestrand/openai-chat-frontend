import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3001", // valfritt för att slippa CORS under utveckling
    },
  },
});
