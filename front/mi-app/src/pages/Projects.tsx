import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

interface IProject {
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

export default function Projects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/projects", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
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
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("No s'ha pogut eliminar el projecte");
    }
  };

  if (loading) return <p className="p-4">Carregant projectes…</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <div
          key={p._id}
          className="border rounded shadow-sm overflow-hidden bg-white hover:shadow-md transition"
        >
          {p.imageUrl && (
            <div className="relative">
              <img
                src={p.imageUrl}
                alt={p.title}
                className={`w-full h-80 object-cover ${
                  p.status === "draft" ? "grayscale" : ""
                }`}
              />
              {p.status === "draft" && (
                <span className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                  Esborrany
                </span>
              )}
            </div>
          )}
          <div className="p-4 flex flex-col h-full">
            <span className="text-xs uppercase text-gray-500">{p.category}</span>
            <h2 className="text-xl font-bold mt-1">{p.title}</h2>
            {p.subtitle && (
              <p className="text-gray-700 text-sm mt-1">{p.subtitle}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Per {p.author} —{" "}
              {new Date(p.createdAt).toLocaleDateString("ca-ES")}
            </p>

            {/* BOTONS */}
            <div className="flex flex-wrap gap-2 pt-3">
              <button
                onClick={() => setSelectedProject(p)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
              >
                Veure més
              </button>

              {(user?.role === "admin" || user?.role === "editor") && (
                <>
                  <button
                    onClick={() => navigate(`/editorPost?id=${p._id}`)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
                  >
                    Editar
                  </button>

                  {user?.role === "admin" && (
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                    >
                      Esborrar
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* MODAL / POPUP */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-3xl w-full overflow-hidden animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imatge principal */}
            {selectedProject.imageUrl && (
              <img
                src={selectedProject.imageUrl}
                alt={selectedProject.title}
                className="w-full h-96 object-cover"
              />
            )}

            <div className="p-6 overflow-y-auto max-h-[80vh]">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {selectedProject.title}
              </h2>
              {selectedProject.subtitle && (
                <p className="text-gray-600 mb-3">
                  {selectedProject.subtitle}
                </p>
              )}

              <div className="text-sm text-gray-500 mb-2">
                <span className="uppercase">{selectedProject.category}</span>{" "}
                •{" "}
                {new Date(selectedProject.createdAt).toLocaleDateString(
                  "ca-ES"
                )}{" "}
                • Per {selectedProject.author}
              </div>

              {/* Contingut TipTap */}
              <div
                className="prose max-w-none mt-4"
                dangerouslySetInnerHTML={{
                  __html: selectedProject.content,
                }}
              />

              <div className="mt-6 text-right">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                >
                  Tancar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
