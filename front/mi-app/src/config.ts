// src/config.ts
const ngrokURL = "https://alene-supermental-bettina.ngrok-free.dev";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname.includes("ngrok")
    ? ngrokURL
    : "http://localhost:3000");

console.log("🌐 API_BASE_URL:", API_BASE_URL);
