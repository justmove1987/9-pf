import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ⚙️ Config global
export default defineConfig({
  plugins: [react()],

  // 🌍 Servidor de desenvolupament
  server: {
    port: 5173,
    allowedHosts: [
      "alene-supermental-bettina.ngrok-free.dev", // 👈 posa el teu domini exacte aquí
      "*.ngrok-free.dev",                         // i permet qualsevol ngrok també
    ],
    cors: true,
    host: true, // 👈 molt important: permet connexions externes
  },

  // 🧪 Vitest (no ho toquem)
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
});
