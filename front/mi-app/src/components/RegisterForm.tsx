import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { fetchWithValidation } from "../utils/fetchWithValidation";
import Spinner from "../components/Spinner";
import type { RegisterResponse } from "../types/api";

export default function RegisterForm() {
  const { setUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await fetchWithValidation<RegisterResponse>(
        "http://localhost:3000/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const newUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      };

      setUser(newUser);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(newUser));

      window.location.href = "/";
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Error en el registre");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4 p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-center mb-2">Registre</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nom
        </label>
        <input
          id="name"
          className="border p-2 w-full rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom"
          autoComplete="name"
          required
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Correu electrònic
        </label>
        <input
          id="email"
          type="email"
          className="border p-2 w-full rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correu"
          autoComplete="username"
          required
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Contrasenya
        </label>
        <input
          id="password"
          type="password"
          className="border p-2 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contrasenya"
          autoComplete="new-password"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`flex items-center justify-center gap-2 w-full ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white px-4 py-2 rounded transition`}
      >
        {loading ? (
          <>
            <Spinner /> <span>Creant compte...</span>
          </>
        ) : (
          "Registrar-se"
        )}
      </button>
    </form>
  );
}
