import { useState } from "react";
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
      if (err instanceof Error) setError(err.message);
      else setError("Error d'inici de sessió");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold text-center mb-2">Iniciar sessió</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div>
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Correu electrònic
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 w-full rounded"
          required
        />
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Contrasenya
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contrasenya"
          className="border p-2 w-full rounded"
          required
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center gap-2 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white px-4 py-2 rounded transition w-full sm:w-auto`}
        >
          {loading ? (
            <>
              <Spinner /> <span>Iniciant sessió...</span>
            </>
          ) : (
            "Iniciar sessió"
          )}
        </button>

        <Link
          to="/register"
          className="ml-4 text-blue-600 underline hover:text-blue-800 text-sm"
        >
          Crear compte
        </Link>
      </div>
    </form>
  );
}
