import { useState } from "react";
import { useAuth } from "../context/useAuth";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDropzone } from "react-dropzone";

export default function EditorPost() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [author, setAuthor] = useState(user?.name || "");
  const [message, setMessage] = useState("");

  // Imagen de portada
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (accepted) => setImageFile(accepted[0]),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = "";
    if (imageFile) {
      // En este ejemplo la guardamos en base64; en producción usa S3/Cloudinary.
      const base64 = await toBase64(imageFile);
      imageUrl = base64 as string;
    }

    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, imageUrl, author }),
    });

    if (res.ok) {
      setMessage("Projecte creat correctament!");
      setTitle("");
      setContent("");
      setImageFile(null);
    } else {
      setMessage("Error creant el projecte");
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

        {/* Selección de autor (simple, usa input o dropdown si hay varios usuarios) */}
        <input
          type="text"
          placeholder="Autor"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="border p-2 w-full"
        />

        <div {...getRootProps()} className="border-dashed border-2 p-4 text-center cursor-pointer">
          <input {...getInputProps()} />
          {imageFile ? (
            <p>Imatge seleccionada: {imageFile.name}</p>
          ) : (
            <p>Arrossega o fes clic per pujar imatge de portada</p>
          )}
        </div>

        <ReactQuill value={content} onChange={setContent} className="bg-white" />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
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
