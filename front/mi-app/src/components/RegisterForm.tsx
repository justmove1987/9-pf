import { useState, useEffect } from "react";
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

  // 💬 Esborra error automàticament
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (password.length < 6) throw new Error("La contrasenya ha de tenir almenys 6 caràcters.");

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
      if (err instanceof Error) setError(`❌ ${err.message}`);
      else setError("❌ Error en el registre");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="space-y-4 p-6 max-w-md mx-auto text-gray-800 dark:text-gray-100 transition-colors duration-300"
    >
      <h2 className="text-2xl font-semibold text-center mb-2">Crear compte</h2>

      {error && (
        <p
          className={`text-center text-sm ${
            error.includes("❌")
              ? "text-red-600 dark:text-red-400"
              : "text-green-600 dark:text-green-400"
          }`}
        >
          {error}
        </p>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Nom
        </label>
        <input
          id="name"
          className="border dark:border-gray-700 dark:bg-gray-900 rounded p-2 w-full focus:ring-2 focus:ring-green-500 outline-none transition"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom complet"
          autoComplete="name"
          required
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Correu electrònic
        </label>
        <input
          id="email"
          type="email"
          className="border dark:border-gray-700 dark:bg-gray-900 rounded p-2 w-full focus:ring-2 focus:ring-green-500 outline-none transition"
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
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Contrasenya
        </label>
        <input
          id="password"
          type="password"
          className="border dark:border-gray-700 dark:bg-gray-900 rounded p-2 w-full focus:ring-2 focus:ring-green-500 outline-none transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínim 6 caràcters"
          autoComplete="new-password"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`flex items-center justify-center gap-2 w-full text-white px-4 py-2 rounded transition ${
          loading
            ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        }`}
      >
        {loading ? (
          <>
            <Spinner color="text-white" /> <span>Creant compte...</span>
          </>
        ) : (
          "Registrar-se"
        )}
      </button>
    </form>
  );
}
