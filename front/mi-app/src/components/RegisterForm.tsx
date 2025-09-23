import { useState } from "react";
import { useAuth } from "../context/useAuth";

export default function RegisterForm() {
  const { setUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const msg = await res.json();
        throw new Error(msg.message || "Error en el registro");
      }
      const data = await res.json();

      // ✅ guardar en contexto y localStorage
      setUser({
        id: data.user.id,
        name: data.user.name,
        role: data.user.role,
      });
      localStorage.setItem("token", data.token);

      // redirigir a dashboard o donde quieras
      window.location.href = "/dashboard";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4 p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Registro</h2>
      {error && <p className="text-red-500">{error}</p>}

      <input
        className="border p-2 w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre"
        required
      />
      <input
        type="email"
        className="border p-2 w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        className="border p-2 w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        required
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Registrarse
      </button>
    </form>
  );
}
