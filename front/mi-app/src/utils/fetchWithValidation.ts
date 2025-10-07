export async function fetchWithValidation<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, options);
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
