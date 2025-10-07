import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { useDropzone } from "react-dropzone";
import { useSearchParams, useNavigate } from "react-router-dom";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { ImageBlock } from "../extensions/ImageBlock";
import { useUsers } from "../hooks/useUsers";
import { uploadFile } from "../hooks/useFileUpload";

interface BlockProps {
  id: string;
  onRemove: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
  initialContent?: string;
}

/* -----------------------------------------------------------
   🧩 Subcomponent: Bloc TipTap amb barra d'eines
----------------------------------------------------------- */
function EditorBlock({ id, onRemove, onUpdate, initialContent }: BlockProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ underline: false, link: false }),
      Link.configure({ openOnClick: true, autolink: true }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Escriu el teu contingut aquí..." }),
      ImageBlock,
    ],
    content: initialContent || "<p>Escriu el teu contingut aquí...</p>",
    onUpdate({ editor }) {
      onUpdate(id, editor.getHTML());
    },
  });

  const toolbar = editor && (
    <div className="flex flex-wrap gap-2 mb-2 text-sm text-gray-700 dark:text-gray-200">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className="hover:text-blue-600">B</button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className="hover:text-blue-600">I</button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="hover:text-blue-600">U</button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>• Llista</button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. Llista</button>

      <select
        onChange={(e) => {
          const v = Number(e.target.value);
          if (v === 0) editor.chain().focus().setParagraph().run();
          else editor.chain().focus().toggleHeading({ level: v as 1 | 2 | 3 }).run();
        }}
        defaultValue={0}
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1"
      >
        <option value={0}>Paràgraf</option>
        <option value={1}>H1</option>
        <option value={2}>H2</option>
        <option value={3}>H3</option>
      </select>

      <button onClick={() => editor.chain().focus().setTextAlign("left").run()}>↤</button>
      <button onClick={() => editor.chain().focus().setTextAlign("center").run()}>↔</button>
      <button onClick={() => editor.chain().focus().setTextAlign("right").run()}>↦</button>

      <button
        onClick={() => {
          if (editor.isActive("link")) editor.chain().focus().unsetLink().run();
          else {
            const url = window.prompt("Introdueix una URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }
        }}
      >
        🔗 Enllaç
      </button>

      {/* Inserir imatge */}
      <button
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;
            const url = await uploadFile(file);
            editor.chain().focus().setImageBlock({ src: url, width: "50%", float: "none" }).run();
          };
          input.click();
        }}
      >
        🖼️ Imatge
      </button>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700 p-3 mb-4 transition-colors">
      {toolbar}
      {editor && (
        <EditorContent
          editor={editor}
          className="prose dark:prose-invert max-w-none w-full [&_img]:max-w-full [&_img]:rounded [&_img]:shadow-sm"
        />
      )}
      <button
        type="button"
        onClick={() => onRemove(id)}
        className="mt-2 text-red-600 dark:text-red-400 hover:underline text-sm"
      >
        🗑️ Esborrar bloc
      </button>
    </div>
  );
}

/* -----------------------------------------------------------
   ✏️ Component principal EditorPost
----------------------------------------------------------- */
export default function EditorPost() {
  const { user } = useAuth();
  const { users, loading: usersLoading } = useUsers();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState<"Paper" | "Digital" | "Editorial">("Paper");
  const [author, setAuthor] = useState(user?.name || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [blocks, setBlocks] = useState<{ id: string; content: string }[]>([]);

  // ✅ Carregar projecte si hi ha ID
  useEffect(() => {
    if (!projectId) return;
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTitle(data.title);
        setSubtitle(data.subtitle || "");
        setCategory(data.category || "Paper");
        setAuthor(data.author || user?.name || "");
        setImageUrl(data.imageUrl || "");
        setBlocks(
          data.content
            ? data.content.split("<hr/>").map((c: string) => ({
                id: crypto.randomUUID(),
                content: c,
              }))
            : []
        );
      } catch (err) {
        console.error("Error carregant projecte:", err);
      }
    })();
  }, [projectId, user?.name]);

  // Dropzone portada
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (accepted) => setImageFile(accepted[0]),
  });

  const addBlock = () => setBlocks((prev) => [...prev, { id: crypto.randomUUID(), content: "" }]);
  const removeBlock = (id: string) => setBlocks((prev) => prev.filter((b) => b.id !== id));
  const updateBlock = (id: string, content: string) =>
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content } : b)));

  // Guardar / publicar
  const handleSubmit = async (status: "published" | "draft") => {
    const content = blocks
      .map((b) =>
        b.content
          .replace(/<p><br class="ProseMirror-trailingBreak"><\/p>/g, "<br><br>")
          .replace(/<p><br><\/p>/g, "<br><br>")
      )
      .join("<hr/>");

    let finalImageUrl = imageUrl;
    if (imageFile) finalImageUrl = await uploadFile(imageFile);

    const token = localStorage.getItem("token");
    const payload = { title, subtitle, category, author, content, imageUrl: finalImageUrl, status };

    try {
      const url = projectId
        ? `http://localhost:3000/projects/${projectId}`
        : "http://localhost:3000/projects";
      const method = projectId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error guardant el projecte");

      setMessage(status === "published" ? "✅ Projecte publicat!" : "💾 Esborrany guardat!");
      if (status === "published") navigate("/projects");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error guardant el projecte");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-4">
        {projectId ? "✏️ Editar Projecte" : "Nou Projecte"}
      </h1>
      {message && <p className="mb-4 text-green-600 dark:text-green-400">{message}</p>}

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <input
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 w-full rounded"
          placeholder="Títol"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 w-full rounded"
          placeholder="Subtítol / Extracte"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
        <select
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 w-full rounded"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value as "Paper" | "Digital" | "Editorial")
          }
        >
          <option value="Paper">Paper</option>
          <option value="Digital">Digital</option>
          <option value="Editorial">Editorial</option>
        </select>

        {/* 👇 Desplegable d'autors */}
        <select
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 w-full rounded"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          disabled={usersLoading}
        >
          <option value="">Selecciona autor</option>
          {users.map((u) => (
            <option key={u._id} value={u.name}>
              {u.name}
            </option>
          ))}
        </select>

        {/* 🖼️ Portada */}
        <div
          {...getRootProps()}
          className="border-dashed border-2 border-gray-300 dark:border-gray-700 p-4 text-center cursor-pointer rounded bg-gray-50 dark:bg-gray-800 transition-colors"
        >
          <input {...getInputProps()} />
          {imageFile ? (
            <p>Imatge seleccionada: {imageFile.name}</p>
          ) : imageUrl ? (
            <img src={imageUrl} alt="Portada" className="w-full h-48 object-cover rounded" />
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              Arrossega o fes clic per pujar imatge de portada
            </p>
          )}
        </div>

        {/* 🧱 Blocs TipTap */}
        {blocks.map((b) => (
          <EditorBlock
            key={b.id}
            id={b.id}
            onRemove={removeBlock}
            onUpdate={updateBlock}
            initialContent={b.content}
          />
        ))}

        <button
          type="button"
          onClick={addBlock}
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          ➕ Afegir bloc
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleSubmit("draft")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
          >
            💾 Guardar esborrany
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("published")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            🚀 Publicar Projecte
          </button>
        </div>
      </form>
    </div>
  );
}
