import { useState, useEffect } from "react";

export function useFetch<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(url, options);

        if (!res.ok) {
          throw new Error(`Error de connexió: ${res.status}`);
        }

        const json: T = await res.json();
        if (isMounted) setData(json);
      } catch (err) {
        if (isMounted && err instanceof Error) {
          setError(err.message);
        } else if (isMounted) {
          setError("Error desconegut");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [url, options]);

  return { data, loading, error };
}
