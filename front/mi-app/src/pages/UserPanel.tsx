import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { fetchWithValidation } from "../utils/fetchWithValidation";
import Spinner from "../components/Spinner";
import type { UserResponse } from "../types/api";

export default function UserPanel() {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // 🔍 Detecta canvis en relació a l’usuari actual
  useEffect(() => {
    const changed =
      name !== user?.name ||
      email !== user?.email ||
      currentPassword.length > 0 ||
      newPassword.length > 0;
    setIsModified(changed);
  }, [name, email, currentPassword, newPassword, user]);

  // 🧩 Validació en temps real de la nova contrasenya
  useEffect(() => {
    if (newPassword && newPassword.length < 6) {
      setPasswordError("La contrasenya ha de tenir almenys 6 caràcters.");
    } else {
      setPasswordError("");
    }
  }, [newPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (!isModified) throw new Error("No hi ha canvis per desar.");
      if (passwordError) throw new Error(passwordError);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Falta el token d'autenticació");

      const data = await fetchWithValidation<UserResponse>(
        "http://localhost:3000/user/me",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, email, currentPassword, newPassword }),
        }
      );

      const updatedUser = {
        ...user!,
        name: data.name,
        email: data.email,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage("✅ Dades actualitzades correctament!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      if (err instanceof Error) setMessage(`❌ ${err.message}`);
      else setMessage("❌ Error desconegut actualitzant dades");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Panell d'usuari
      </h1>

      {message && (
        <p
          className={`mb-4 text-center text-sm ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom"
            className="border rounded p-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correu electrònic
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correu"
            className="border rounded p-2 w-full"
            autoComplete="username"
          />
        </div>

        <hr className="my-4" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contrasenya actual
          </label>
          <input
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Només necessària si vols canviar-la"
            className="border rounded p-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nova contrasenya
          </label>
          <input
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nova contrasenya"
            className="border rounded p-2 w-full"
          />
          {passwordError && (
            <p className="text-xs text-red-500 mt-1">{passwordError}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !isModified || !!passwordError}
          className={`flex items-center justify-center gap-2 w-full ${
            loading || !isModified || !!passwordError
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white px-4 py-2 rounded transition`}
        >
          {loading ? (
            <>
              <Spinner /> <span>Desant canvis...</span>
            </>
          ) : (
            "Desar canvis"
          )}
        </button>
      </form>
    </div>
  );
}
