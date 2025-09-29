import { useRef, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useDropzone } from "react-dropzone";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ErrorBoundary from "../components/ErrorBoundary";

export default function EditorPost() {
  const { user } = useAuth();
  const quillRef = useRef<ReactQuill | null>(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState(user?.name || "");
  const [imageFile, setImageFile] = useState<File | null>(null); // portada
  const [message, setMessage] = useState("");
  const [content, setContent] = useState("<p>Escriu el teu contingut aquí...</p>");

  // Imatge de portada (no té res a veure amb l’editor)
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (accepted) => setImageFile(accepted[0]),
  });

  // 🔁 CONFIG de la barra d’eines de Quill
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: { image: handleImageUpload },
    },
  };

  // 3a) OPCIÓ RÀPIDA: Base64
  // No cal fer res: React-Quill permet enganxar/drag-drop d’imatges
  // i les incrusta com data:base64 dins del HTML.

  // 3b) OPCIÓ MILLOR: pujar al backend i inserir la URL
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleImageUpload(this: any) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const form = new FormData();
      form.append("file", file);

      const token = localStorage.getItem("token") || "";
      const res = await fetch("http://localhost:3000/uploads", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // opcional si protegies l’endpoint
        body: form,
      });

      if (!res.ok) return alert("Error pujant imatge");

      const data = await res.json(); // { url: "http://localhost:3000/uploads/xxx.jpg" }
      const quill = quillRef.current?.getEditor();
      const range = quill?.getSelection(true);
      if (quill && range) {
        quill.insertEmbed(range.index, "image", data.url, "user");
        quill.setSelection(range.index + 1, 0);
      }
    };
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // portada (la teva lògica actual)
    let imageUrl = "";
    if (imageFile) {
      const base64 = await toBase64(imageFile);
      imageUrl = base64 as string;
    }

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, author, content, imageUrl }),
      });

      if (!res.ok) throw new Error("Error creant el projecte");

      setMessage("✅ Projecte creat correctament!");
      setTitle("");
      setAuthor(user?.name || "");
      setImageFile(null);
      setContent("");
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
        <input
          type="text"
          placeholder="Títol"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          type="text"
          placeholder="Autor"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="border p-2 w-full"
        />

        {/* Portada */}
        <div
          {...getRootProps()}
          className="border-dashed border-2 p-4 text-center cursor-pointer"
        >
          <input {...getInputProps()} />
          {imageFile ? (
            <p>Imatge seleccionada: {imageFile.name}</p>
          ) : (
            <p>Arrossega o fes clic per pujar imatge de portada</p>
          )}
        </div>

        {/* Editor React-Quill */}
        <div className="bg-white rounded border p-2">
          <ErrorBoundary>
            <ReactQuill
              ref={quillRef}
              value={content}
              onChange={setContent}
              modules={modules}
            />
          </ErrorBoundary>
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
