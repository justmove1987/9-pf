import { useState, useEffect } from "react";

export interface IProject {
  _id: string;
  title: string;
  subtitle: string;
  category: string;
  content: string;
  imageUrl: string;
  author: string;
  createdAt: string;
  status: "published" | "draft";
}

export function useProjects(initialCategory = "") {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [filtered, setFiltered] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    category: initialCategory,
    author: "",
    dateFrom: "",
    dateTo: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/projects", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setProjects(data);
        setFiltered(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Error carregant projectes");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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

  const deleteProject = async (id: string) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:3000/projects/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setProjects((prev) => prev.filter((p) => p._id !== id));
  };

  return { projects, filtered, filters, setFilters, loading, error, deleteProject };
}
