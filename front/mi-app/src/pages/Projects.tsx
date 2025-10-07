import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProjects } from "../hooks/useProjects";
import Spinner from "../components/Spinner";
import type { Project } from "../types/api";

export default function Projects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const {
    filtered,
    filters,
    setFilters,
    loading,
    error,
    deleteProject,
    projects,
  } = useProjects(searchParams.get("category") || "");

  const uniqueAuthors = Array.from(new Set(projects.map((p) => p.author)));
  const categories = ["Paper", "Digital", "Editorial"];

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="w-10 h-10" color="border-green-600" />
      </div>
    );

  if (error) return <p className="p-4 text-red-500 dark:text-red-400">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 transition-colors duration-300 text-gray-800 dark:text-gray-100">
      {/* 🔍 FILTRES */}
      <div className="mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm transition-colors duration-300">
        <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200">
          Filtra projectes
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input
            type="text"
            placeholder="Cerca per títol o subtítol..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 rounded w-full text-gray-900 dark:text-gray-100"
          />

          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 rounded w-full text-gray-900 dark:text-gray-100"
          >
            <option value="">Totes les categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={filters.author}
            onChange={(e) => setFilters({ ...filters, author: e.target.value })}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 rounded w-full text-gray-900 dark:text-gray-100"
          >
            <option value="">Tots els autors</option>
            {uniqueAuthors.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          <div className="relative">
            <label className="absolute text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1 left-2 -top-2">
              Des de
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 rounded w-full text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="relative">
            <label className="absolute text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1 left-2 -top-2">
              Fins a
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 rounded w-full text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="text-right mt-3">
          <button
            onClick={() =>
              setFilters({
                search: "",
                category: "",
                author: "",
                dateFrom: "",
                dateTo: "",
              })
            }
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            Netejar filtres
          </button>
        </div>

        {searchParams.get("category") && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Mostrant projectes de la categoria{" "}
            <strong>{searchParams.get("category")}</strong>
          </p>
        )}
      </div>

      {/* 🗂️ LLISTA PROJECTES */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div
            key={p._id}
            className="border border-gray-300 dark:border-gray-700 rounded shadow-sm overflow-hidden bg-white dark:bg-gray-900 hover:shadow-md transition"
          >
            {p.imageUrl && (
              <div className="relative">
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className={`w-full h-56 object-cover ${
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
              <span className="text-xs uppercase text-gray-500 dark:text-gray-400">
                {p.category}
              </span>
              <h2 className="text-xl font-bold mt-1 font-serif">{p.title}</h2>
              {p.subtitle && (
                <p className="text-green-700 dark:text-green-400 text-sm mt-1">
                  {p.subtitle}
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Per {p.author} — {new Date(p.createdAt).toLocaleDateString("ca-ES")}
              </p>

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
                        onClick={() => deleteProject(p._id)}
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

      {/* 🪟 MODAL PROJECTE */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-xl max-w-3xl w-full overflow-hidden animate-fadeIn"
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
              <h2 className="text-2xl font-bold mb-1">{selectedProject.title}</h2>
              {selectedProject.subtitle && (
                <p className="text-gray-600 dark:text-gray-400 mb-3 font-serif">
                  {selectedProject.subtitle}
                </p>
              )}

              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span className="uppercase">{selectedProject.category}</span> •{" "}
                {new Date(selectedProject.createdAt).toLocaleDateString("ca-ES")} •{" "}
                Per {selectedProject.author}
              </div>

              <div
                className="prose dark:prose-invert max-w-none mt-4 prose-p:mb-4 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: selectedProject.content
                    .replace(
                      /<p><br class="ProseMirror-trailingBreak"><\/p>/g,
                      "<p class='empty-line'>&nbsp;</p>"
                    )
                    .replace(/<p><br><\/p>/g, "<p class='empty-line'>&nbsp;</p>"),
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
