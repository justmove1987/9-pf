import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom"; // ✅ afegim useSearchParams

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
  const [searchParams] = useSearchParams(); // ✅ llegim query params

  const [projects, setProjects] = useState<IProject[]>([]);
  const [filtered, setFiltered] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  // 🔍 filtres
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // ✅ Si ve de la Home amb ?category=Digital
  useEffect(() => {
    const catFromUrl = searchParams.get("category");
    if (catFromUrl) setCategory(catFromUrl);
  }, [searchParams]);

  // 🔹 Carregar projectes
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
        setFiltered(data);
      } catch (e) {
        console.error(e);
        setError("No s'han pogut carregar els projectes");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🔸 Aplicar filtres locals
  useEffect(() => {
    let results = [...projects];

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
        const created = new Date(p.createdAt);
        return created >= from && created <= to;
      });
    }

    setFiltered(results);
  }, [search, category, author, dateFrom, dateTo, projects]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Segur que vols eliminar aquest projecte?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
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

  const uniqueAuthors = Array.from(new Set(projects.map((p) => p.author)));
  const categories = ["Paper", "Digital", "Editorial"];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 🔍 FILTRES */}
      <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">
          Filtra projectes
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {/* Buscador */}
          <input
            type="text"
            placeholder="Cerca per títol o subtítol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full"
          />

          {/* Categoria */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Totes les categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Autor */}
          <select
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Tots els autors</option>
            {uniqueAuthors.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          {/* Data des de */}
          <div className="relative">
            <label className="absolute text-xs text-gray-500 bg-gray-100 px-1 left-2 -top-2">
              Des de
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Data fins a */}
          <div className="relative">
            <label className="absolute text-xs text-gray-500 bg-gray-100 px-1 left-2 -top-2">
              Fins a
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        {/* Botó per netejar filtres */}
        <div className="text-right mt-3">
          <button
            onClick={() => {
              setSearch("");
              setCategory("");
              setAuthor("");
              setDateFrom("");
              setDateTo("");
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            Netejar filtres
          </button>
        </div>

        {/* Indicador de filtre aplicat des de la Home */}
        {searchParams.get("category") && (
          <p className="text-sm text-gray-600 mt-2">
            Mostrant projectes de la categoria{" "}
            <strong>{searchParams.get("category")}</strong>
          </p>
        )}
      </div>

      {/* LLISTA DE PROJECTES */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
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
              <span className="text-xs uppercase text-gray-500 ">
                {p.category}
              </span>
              <h2 className="text-xl font-bold mt-1 font-serif">{p.title}</h2>
              {p.subtitle && (
                <p className="text-green-700 text-sm mt-1 ">
                  {p.subtitle}
                </p>
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
      </div>

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
                <p className="text-gray-600 mb-3 font-serif">
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

              <div
                className="prose max-w-none mt-4 prose-p:mb-4 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: selectedProject.content
                    .replace(
                      /<p><br class="ProseMirror-trailingBreak"><\/p>/g,
                      "<p class='empty-line'>&nbsp;</p>"
                    )
                    .replace(
                      /<p><br><\/p>/g,
                      "<p class='empty-line'>&nbsp;</p>"
                    ),
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
