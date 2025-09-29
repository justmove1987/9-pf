// front/mi-app/src/pages/Projects.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";     // ✅ importem usuari

interface IProject {
  _id: string;
  title: string;
  subtitle: string;
  category: string;
  content: string;
  imageUrl: string;
  author: string;
  createdAt: string;
}

export default function Projects() {
  const { user } = useAuth();                     // ✅ usuari loguejat
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/projects");
        if (!res.ok) throw new Error("Error obtenint projectes");
        const data: IProject[] = await res.json();
        setProjects(data);
      } catch (e) {
        console.error(e);
        setError("No s'han pogut carregar els projectes");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🗑️ Funció per eliminar
  const handleDelete = async (id: string) => {
    if (!window.confirm("Segur que vols eliminar aquest projecte?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error eliminant projecte");
      // Actualitza l’estat local
      setProjects(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("No s'ha pogut eliminar el projecte");
    }
  };

  if (loading) return <p className="p-4">Carregant projectes…</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <div key={p._id} className="border rounded shadow-sm overflow-hidden">
          {p.imageUrl && (
            <img src={p.imageUrl} alt={p.title} className="w-full h-48 object-cover" />
          )}
          <div className="p-4">
            <span className="text-xs uppercase text-gray-500">{p.category}</span>
            <h2 className="text-xl font-bold mt-1">{p.title}</h2>
            {p.subtitle && <p className="text-gray-700 text-sm mt-1">{p.subtitle}</p>}
            <p className="text-xs text-gray-500 mt-2">
              Per {p.author} — {new Date(p.createdAt).toLocaleDateString("ca-ES")}
            </p>

            {/* ✅ Botó eliminar només per admin */}
            {user?.role === "admin" && (
              <button
                onClick={() => handleDelete(p._id)}
                className="mt-3 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
              >
                Eliminar
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
