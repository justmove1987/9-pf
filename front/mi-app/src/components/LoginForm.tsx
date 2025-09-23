import { useState } from "react";
import { useAuth } from "../context/useAuth";

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
      if (!res.ok) throw new Error("Credenciales inválidas");
      const data = await res.json();

      // ✅ Guardar usuario y rol en el contexto y localStorage
      setUser({
        id: data.user.id,
        name: data.user.name,
        role: data.user.role,
      });
      localStorage.setItem("token", data.token);

      // Redirigir a dashboard o donde quieras
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      alert("Error de inicio de sesión");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2 w-full"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        className="border p-2 w-full"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Iniciar sesión
      </button>
    </form>
  );
}
