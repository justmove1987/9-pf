import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useDropzone } from "react-dropzone";
import { CKEditor } from '@ckeditor/ckeditor5-react';
// Importa usando el alias definido en tsconfig y como namespace
import ClassicEditor from '@ckeditor-custom/ckeditor'




export default function EditorPost() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState(user?.name || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [content, setContent] = useState("<p>Escriu el teu contingut aquí...</p>");

  // Dropzone para portada
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (accepted) => setImageFile(accepted[0]),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      setMessage("❌ Cal títol i contingut");
      return;
    }

    // --- Usar FormData ---
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("content", content);
    if (imageFile) formData.append("cover", imageFile); // campo 'cover' debe coincidir con el backend

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/projects", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
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

        {/* Imagen de portada */}
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

        {/* CKEditor */}
        <div className="border p-2 bg-white rounded">
       <CKEditor
          editor={ClassicEditor}
          data={content}
          config={{
            simpleUpload: {
              uploadUrl: 'http://localhost:3000/upload',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`
              }
            }
          }}
          onChange={(_, editor) => setContent(editor.getData())}
        />







        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Publicar Projecte
        </button>
      </form>
    </div>
  );
}
