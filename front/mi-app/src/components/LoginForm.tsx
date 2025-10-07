import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { Link } from "react-router-dom";
import { fetchWithValidation } from "../utils/fetchWithValidation";
import Spinner from "../components/Spinner";
import type { LoginResponse } from "../types/api";

export default function LoginForm() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 💬 Esborra l’error després de 3 s
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await fetchWithValidation<LoginResponse>(
        "http://localhost:3000/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      });

      window.location.href = "/";
    } catch (err) {
      if (err instanceof Error) setError(`❌ ${err.message}`);
      else setError("❌ Error d'inici de sessió");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 max-w-sm mx-auto text-gray-800 dark:text-gray-100 transition-colors duration-300"
    >
      <h2 className="text-2xl font-semibold text-center mb-2">
        Iniciar sessió
      </h2>

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
          htmlFor="login-email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Correu electrònic
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border dark:border-gray-700 dark:bg-gray-900 rounded p-2 w-full focus:ring-2 focus:ring-green-500 outline-none transition"
          required
        />
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Contrasenya
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contrasenya"
          className="border dark:border-gray-700 dark:bg-gray-900 rounded p-2 w-full focus:ring-2 focus:ring-green-500 outline-none transition"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center gap-2 w-full sm:w-auto text-white px-4 py-2 rounded transition ${
            loading
              ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          }`}
        >
          {loading ? (
            <>
              <Spinner color="text-white" /> <span>Iniciant sessió...</span>
            </>
          ) : (
            "Iniciar sessió"
          )}
        </button>

        <Link
          to="/register"
          className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 text-sm"
        >
          Crear compte
        </Link>
      </div>
    </form>
  );
}
