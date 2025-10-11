// src/utils/fetchWithValidation.ts

export async function fetchWithValidation<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  // 🧠 Detecta si és una URL relativa i afegeix la base segons entorn
  const API_BASE =
    import.meta.env.VITE_API_BASE ||
    (window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://alene-supermental-bettina.ngrok-free.dev"); // 👈 posa aquí la teva URL Ngrok actual

  const fullUrl = url.startsWith("http") ? url : `${API_BASE}${url}`;

  // 🔒 Afegeix capçalera per saltar el warning d’Ngrok
  const headers = {
    "ngrok-skip-browser-warning": "true",
    ...(options.headers || {}),
  };

  const res = await fetch(fullUrl, { ...options, headers });

  const text = await res.text();

  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // resposta sense JSON
  }

  if (!res.ok) {
    const message =
      (typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof (data as { message: string }).message === "string" &&
        (data as { message: string }).message) ||
      `Error ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}
