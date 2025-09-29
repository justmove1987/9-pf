import { useCallback, useMemo, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useDropzone } from "react-dropzone";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

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
      StarterKit,
      Underline,
      Link.configure({ openOnClick: true, autolink: true }),
      Image.configure({ inline: false, allowBase64: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Escriu el teu contingut aquí..." }),
    ],
    content,
    editorProps: {
      handleDrop: (_view, event) => {
        (async () => {
          const files = event.dataTransfer?.files;
          if (!files?.length) return;
          const image = Array.from(files).find(f => f.type.startsWith("image/"));
          if (!image) return;
          event.preventDefault();
          const url = await uploadFile(image);
          editor?.chain().focus().setImage({ src: url }).run();
        })();
        return true;
      },
      handlePaste: (_view, event) => {
        // ✅ Només interceptem si hi ha imatge, sinó deixem enganxar text
        const items = event.clipboardData?.items;
        if (!items) return false;
        const fileItem = Array.from(items).find(
          it => it.kind === "file" && it.type.startsWith("image/")
        );
        if (!fileItem) return false;
        event.preventDefault();
        const file = fileItem.getAsFile();
        if (!file) return false;
        (async () => {
          const url = await uploadFile(file);
          editor?.chain().focus().setImage({ src: url }).run();
        })();
        return true;
      },
    },
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  // ---- Barra d'eines ----
  const toolbar = useMemo(
    () => (
      <div className="flex flex-wrap gap-2 mb-2 text-sm">
        <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()}>B</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()}>I</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleUnderline().run()}>U</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}>• Llista</button>
        <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()}>1. Llista</button>
        <select
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v === 0) editor?.chain().focus().setParagraph().run();
            else editor?.chain().focus().toggleHeading({ level: v as 1|2|3 }).run();
          }}
          defaultValue={0}
        >
          <option value={0}>Paràgraf</option>
          <option value={1}>H1</option>
          <option value={2}>H2</option>
          <option value={3}>H3</option>
        </select>
        <button type="button" onClick={() => editor?.chain().focus().setTextAlign("left").run()}>↤</button>
        <button type="button" onClick={() => editor?.chain().focus().setTextAlign("center").run()}>↔</button>
        <button type="button" onClick={() => editor?.chain().focus().setTextAlign("right").run()}>↦</button>
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
        <button
          type="button"
          onClick={() => {
            if (!editor) return;
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = async () => {
              const file = input.files?.[0];
              if (!file) return;
              const url = await uploadFile(file);
              editor.chain().focus().setImage({ src: url }).run();
            };
            input.click();
          }}
        >
          Imatge
        </button>
      </div>
    ),
    [editor, uploadFile]
  );

  // ---- Submit ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = "";
    if (imageFile) imageUrl = (await toBase64(imageFile)) as string;

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

function toBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
}
