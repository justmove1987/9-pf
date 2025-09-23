import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";

type Project = {
  _id: string;
  title: string;
  author: string;
  description: string;
  imageUrl?: string;
  url?: string;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Ejemplo de fetch a tu backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:3000/projects");
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

      {/* Botón o enlace para crear un nuevo proyecto */}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
        onClick={() => alert("Abrir formulario para crear proyecto")}
      >
        Nuevo proyecto
      </button>

      {/* Lista de proyectos */}
      {projects.length === 0 ? (
        <p>No hay proyectos aún.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div
              key={p._id}
              className="border rounded-lg shadow p-4 bg-white dark:bg-gray-800"
            >
              {p.imageUrl && (
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}
              <h2 className="text-xl font-semibold">{p.title}</h2>
              <p className="text-sm text-gray-600">Autor: {p.author}</p>
              <p className="mt-2 text-gray-700">{p.description}</p>
              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline mt-2 block"
                >
                  Ver proyecto
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
