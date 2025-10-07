import { useState, useEffect } from "react";
import type { Project } from "../types/api"; // 👈 reutilitzem el tipus oficial

export function useProjects(initialCategory = "") {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    category: initialCategory,
    author: "",
    dateFrom: "",
    dateTo: "",
  });

  // Carrega inicial de projectes
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/projects", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data: Project[] = await res.json();
        setProjects(data);
        setFiltered(data);
      } catch {
        setError("Error carregant projectes");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filtratge reactiu
  useEffect(() => {
    let results = [...projects];
    const { search, category, author, dateFrom, dateTo } = filters;

    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle?.toLowerCase().includes(q)
      );
    }

    if (category) results = results.filter((p) => p.category === category);
    if (author) results = results.filter((p) => p.author === author);

    if (dateFrom || dateTo) {
      const from = dateFrom ? new Date(dateFrom) : new Date("1900-01-01");
      const to = dateTo ? new Date(dateTo) : new Date("9999-12-31");
      results = results.filter((p) => {
        const d = new Date(p.createdAt);
        return d >= from && d <= to;
      });
    }

    setFiltered(results);
  }, [filters, projects]);

  // Eliminar projecte
  const deleteProject = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error eliminant projecte");

      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch {
      setError("No s'ha pogut eliminar el projecte");
    }
  };

  return { projects, filtered, filters, setFilters, loading, error, deleteProject };
}
