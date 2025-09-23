import { useState } from "react";
import { useAuth } from "../context/useAuth";

export default function RegisterForm() {
  // ✅ Hook dentro del componente
  const { setUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setUser({
      id: data.user.id,
      name: data.user.name,
      role: data.user.role,
    });
    localStorage.setItem("token", data.token);
    window.location.href = "/dashboard";
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4 p-4">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre"
        className="border p-2 w-full"
      />
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
        Registrarse
      </button>
    </form>
  );
}

