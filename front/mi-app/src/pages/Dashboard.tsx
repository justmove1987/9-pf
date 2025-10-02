import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";

type Project = {
  _id: string;
  title: string;
  author: string;
  subtitle?: string;
  imageUrl?: string;
  status: "published" | "draft";
  createdAt: string;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/projects", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <div className="p-4">Cargando proyectos...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Panel de {user?.name}</h1>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
        onClick={() => alert("Abrir formulario para crear proyecto")}
      >
        Nuevo proyecto
      </button>

      {projects.length === 0 ? (
        <p>No hay proyectos aún.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div key={p._id} className="border rounded-lg shadow bg-white dark:bg-gray-800 overflow-hidden">
              {p.imageUrl && (
                <div className="relative">
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className={`w-full h-40 object-cover ${p.status === "draft" ? "grayscale" : ""}`}
                  />
                  {p.status === "draft" && (
                    <span className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                      Esborrany
                    </span>
                  )}
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold">{p.title}</h2>
                <p className="text-sm text-gray-600">Autor: {p.author}</p>
                {p.subtitle && <p className="mt-2 text-gray-700">{p.subtitle}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
