import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { Link } from "react-router-dom";

export default function LoginForm() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

if (!res.ok) throw new Error("Error iniciant sessió");

const data = await res.json();
localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data.user));
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        })
      );

      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      alert("Error de inicio de sesión");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-sm mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2 w-full"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        className="border p-2 w-full"
        required
      />

      <div className="flex items-center justify-between mt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Iniciar sesión
        </button>

        {/* ➕ Botó/enllaç per registrar-se */}
        <Link
          to="/register"
          className="ml-4 text-blue-600 underline hover:text-blue-800"
        >
          Crear compte
        </Link>
      </div>
    </form>
  );
}
