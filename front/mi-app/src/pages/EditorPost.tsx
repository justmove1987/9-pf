// front/mi-app/src/pages/EditorPost.tsx
import { useCallback, useMemo, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useDropzone } from "react-dropzone";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { ImageBlock } from "../extensions/ImageBlock"; // ✅ extensió pròpia

export default function EditorPost() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState<"Paper" | "Digital" | "Editorial">(
    "Paper"
  );
  const [author, setAuthor] = useState(user?.name || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [content, setContent] = useState("<p>Escriu el teu contingut aquí...</p>");

  // ---- Portada ----
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (accepted) => setImageFile(accepted[0]),
  });

  // ---- Pujada d’imatges ----
  const uploadFile = useCallback(async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("file", file);
    const token = localStorage.getItem("token") || "";
    const res = await fetch("http://localhost:3000/uploads", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    if (!res.ok) throw new Error("Error pujant imatge");
    const data = await res.json();
    return data.url as string;
  }, []);

  // ---- Editor TipTap ----
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ underline: false, link: false }),
      Link.configure({ openOnClick: true, autolink: true }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Escriu el teu contingut aquí..." }),
      ImageBlock, // ✅ substitueix Image natiu
    ],
    content,
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  // ---- Barra d'eines ----
  const toolbar = useMemo(() => {
    if (!editor) return null;

    return (
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
            if (!editor) return;
            if (editor.isActive("link")) editor.chain().focus().unsetLink().run();
            else {
              const url = window.prompt("Introdueix una URL");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }
          }}
        >
          Enllaç
        </button>

        {/* Inserir imatge amb ImageBlock */}
        <button
          type="button"
          onClick={async () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = async () => {
              const file = input.files?.[0];
              if (!file) return;
              const url = await uploadFile(file);
              // @ts-expect-error comanda custom
              editor.chain().focus().setImageBlock({ src: url, width: "50%", align: "center" }).run();
            };
            input.click();
          }}
        >
          Imatge
        </button>

        {/* Control amplada */}
        <select
          onChange={(e) => {
            editor.chain().focus().updateImageBlock({ width: e.target.value }).run();
          }}
          defaultValue="100%"
        >
          <option value="25%">25%</option>
          <option value="50%">50%</option>
          <option value="75%">75%</option>
          <option value="100%">100%</option>
        </select>

        {/* Control alineació */}
        <button
          type="button"
          onClick={() => editor.chain().focus().updateImageBlock({ float: "left" }).run()}
        >
          Esquerra
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().updateImageBlock({ float: "none" }).run()}
        >
          Centre
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().updateImageBlock({ float: "right" }).run()}
        >
          Dreta
        </button>
      </div>
    );
  }, [editor, uploadFile]);

  // ---- Submit ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = "";
    if (imageFile) imageUrl = await uploadFile(imageFile);

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, subtitle, category, author, content, imageUrl }),
      });
      if (!res.ok) throw new Error("Error creant el projecte");

      setMessage("✅ Projecte creat correctament!");
      setTitle("");
      setSubtitle("");
      setCategory("Paper");
      setAuthor(user?.name || "");
      setImageFile(null);
      setContent("<p></p>");
      editor?.commands.setContent("<p></p>");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error creant el projecte");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Nou Projecte</h1>
      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="border p-2 w-full" placeholder="Títol" value={title}
          onChange={(e) => setTitle(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Subtítol / Extracte" value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)} />
        <select className="border p-2 w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value as "Paper"|"Digital"|"Editorial")}
        >
          <option value="Paper">Paper</option>
          <option value="Digital">Digital</option>
          <option value="Editorial">Editorial</option>
        </select>
        <input className="border p-2 w-full" placeholder="Autor" value={author}
          onChange={(e) => setAuthor(e.target.value)} />

        <div {...getRootProps()} className="border-dashed border-2 p-4 text-center cursor-pointer">
          <input {...getInputProps()} />
          {imageFile ? <p>Imatge seleccionada: {imageFile.name}</p> : <p>Arrossega o fes clic per pujar imatge de portada</p>}
        </div>

        <div className="bg-white rounded border p-2">
          {toolbar}
          <EditorContent editor={editor} className="min-h-48 prose max-w-none" />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Publicar Projecte
        </button>
      </form>
    </div>
  );
}
