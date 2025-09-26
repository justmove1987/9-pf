import { useEffect, useState } from "react";

type Project = {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: string;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/projects")
      .then((res) => res.json())
      .then(setProjects)
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 grid gap-6 md:grid-cols-2">
      {projects.map((p) => (
        <div key={p._id} className="border rounded p-4 shadow">
          {p.imageUrl && (
            <img
              src={p.imageUrl}
              alt={p.title}
              className="w-full h-48 object-cover rounded mb-3"
            />
          )}
          <h2 className="text-xl font-bold mb-2">{p.title}</h2>
          <p className="text-sm text-gray-600 mb-2">Autor: {p.author}</p>
          {/* El contenido es HTML */}
          <div dangerouslySetInnerHTML={{ __html: p.content }} />
        </div>
      ))}
    </div>
  );
}
