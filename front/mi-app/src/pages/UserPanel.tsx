import { useState } from "react";
import { useAuth } from "../context/useAuth";

export default function UserPanel() {
  const { user, setUser } = useAuth();

  // ✅ Inicialitza amb les dades actuals del context
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");   // ← es veurà si el context porta email
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Falta el token");

      const res = await fetch("http://localhost:3000/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          currentPassword,
          newPassword,
        }),
      });

      if (!res.ok) throw new Error("Error actualitzant l’usuari");

      const data = await res.json();

      // ✅ Actualitza el context i el localStorage amb les dades retornades
      const updatedUser = {
        ...user!,
        name: data.name,
        email: data.email,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage("Dades actualitzades correctament!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setMessage("Error actualitzant dades");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Panell d'usuari</h1>

      {message && (
        <p className="mb-4 text-center text-sm text-green-600">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom"
          className="border p-2 w-full"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correu"
          className="border p-2 w-full"
        />

        <hr className="my-4" />

        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Contrasenya actual (per canviar-la)"
          className="border p-2 w-full"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Nova contrasenya"
          className="border p-2 w-full"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Desar canvis
        </button>
      </form>
    </div>
  );
}
