// front/mi-app/src/pages/EditorPost.tsx
import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useDropzone } from "react-dropzone";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { ImageBlock } from "../extensions/ImageBlock";

interface BlockProps {
  id: string;
  onRemove: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
}

function EditorBlock({ id, onRemove, onUpdate }: BlockProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ underline: false, link: false }),
      Link.configure({ openOnClick: true, autolink: true }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Escriu el teu contingut aquí..." }),
      ImageBlock,
    ],
    content: "<p>Escriu el teu contingut aquí...</p>",
    onUpdate({ editor }) {
      onUpdate(id, editor.getHTML());
    },
  });

  const toolbar = editor && (
    <div className="flex flex-wrap gap-2 mb-2 text-sm">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>• Llista</button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. Llista</button>

      <select
        onChange={(e) => {
          const v = Number(e.target.value);
          if (v === 0) editor.chain().focus().setParagraph().run();
          else editor.chain().focus().toggleHeading({ level: v as 1 | 2 | 3 }).run();
        }}
        defaultValue={0}
      >
        <option value={0}>Paràgraf</option>
        <option value={1}>H1</option>
        <option value={2}>H2</option>
        <option value={3}>H3</option>
      </select>

      <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()}>↤</button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()}>↔</button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()}>↦</button>

      <button
        type="button"
        onClick={() => {
          if (editor.isActive("link")) editor.chain().focus().unsetLink().run();
          else {
            const url = window.prompt("Introdueix una URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }
        }}
      >
        Enllaç
      </button>

      {/* Inserir imatge */}
      <button
        type="button"
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;
            const form = new FormData();
            form.append("file", file);
            const res = await fetch("http://localhost:3000/uploads", { method: "POST", body: form });
            const data = await res.json();
            editor.chain().focus().setImageBlock({ src: data.url, width: "50%", float: "none" }).run();
          };
          input.click();
        }}
      >
        Imatge
      </button>

      {/* Amplada */}
      <select
        onChange={(e) => editor.chain().focus().updateImageBlock({ width: e.target.value }).run()}
        defaultValue="100%"
      >
        <option value="25%">25%</option>
        <option value="50%">50%</option>
        <option value="75%">75%</option>
        <option value="100%">100%</option>
      </select>

      {/* Alineació */}
      <button type="button" onClick={() => editor.chain().focus().updateImageBlock({ float: "left" }).run()}>Esquerra</button>
      <button type="button" onClick={() => editor.chain().focus().updateImageBlock({ float: "none" }).run()}>Centre</button>
      <button type="button" onClick={() => editor.chain().focus().updateImageBlock({ float: "right" }).run()}>Dreta</button>
    </div>
  );

  return (
    <div className="bg-white rounded border p-2 mb-4 w-full">
      {toolbar}
      {editor && (
        <EditorContent
          editor={editor}
          className="prose max-w-none w-full [&_img]:max-w-full [&_img]:h-auto [&_img]:my-2 [&_img]:rounded [&_img]:shadow-sm clearfix"
        />
      )}
      <button
        type="button"
        onClick={() => onRemove(id)}
        className="mt-2 text-red-600 hover:underline"
      >
        🗑️ Esborrar bloc
      </button>
    </div>
  );
}

export default function EditorPost() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState<"Paper" | "Digital" | "Editorial">("Paper");
  const [author, setAuthor] = useState(user?.name || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [blocks, setBlocks] = useState<{ id: string; content: string }[]>([]);

  // Portada
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (accepted) => setImageFile(accepted[0]),
  });

  const addBlock = () => setBlocks((prev) => [...prev, { id: crypto.randomUUID(), content: "" }]);
  const removeBlock = (id: string) => setBlocks((prev) => prev.filter((b) => b.id !== id));
  const updateBlock = (id: string, content: string) =>
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content } : b)));

  // 🔹 Submit (publicar o esborrany)
  const handleSubmit = async (status: "published" | "draft") => {
    const content = blocks.map((b) => b.content).join("<hr/>");
    let imageUrl = "";

    if (imageFile) {
      const form = new FormData();
      form.append("file", imageFile);
      const res = await fetch("http://localhost:3000/uploads", { method: "POST", body: form });
      const data = await res.json();
      imageUrl = data.url;
    }

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, subtitle, category, author, content, imageUrl, status }),
      });
      if (!res.ok) throw new Error("Error guardant el projecte");

      setMessage(status === "published" ? "✅ Projecte publicat!" : "💾 Esborrany guardat!");
      setTitle("");
      setSubtitle("");
      setCategory("Paper");
      setAuthor(user?.name || "");
      setImageFile(null);
      setBlocks([]);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error guardant el projecte");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Nou Projecte</h1>
      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <input className="border p-2 w-full" placeholder="Títol" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Subtítol / Extracte" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        <select className="border p-2 w-full" value={category} onChange={(e) => setCategory(e.target.value as "Paper" | "Digital" | "Editorial")}>
          <option value="Paper">Paper</option>
          <option value="Digital">Digital</option>
          <option value="Editorial">Editorial</option>
        </select>
        <input className="border p-2 w-full" placeholder="Autor" value={author} onChange={(e) => setAuthor(e.target.value)} />

        {/* Portada */}
        <div {...getRootProps()} className="border-dashed border-2 p-4 text-center cursor-pointer">
          <input {...getInputProps()} />
          {imageFile ? <p>Imatge seleccionada: {imageFile.name}</p> : <p>Arrossega o fes clic per pujar imatge de portada</p>}
        </div>

        {/* Blocs */}
        {blocks.map((b) => (
          <EditorBlock key={b.id} id={b.id} onRemove={removeBlock} onUpdate={updateBlock} />
        ))}

        <button type="button" onClick={addBlock} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
          ➕ Afegir bloc
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleSubmit("draft")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            💾 Guardar esborrany
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("published")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            🚀 Publicar Projecte
          </button>
        </div>
      </form>
    </div>
  );
}
