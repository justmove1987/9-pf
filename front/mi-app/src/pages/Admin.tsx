import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // 🔄 Carregar tots els usuaris
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error carregant usuaris");
        const data: User[] = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        alert("No s'han pogut carregar els usuaris");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  // 🗑️ Eliminar usuari
  const handleDelete = async (id: string) => {
    if (!window.confirm("Vols eliminar aquest usuari?")) return;
    try {
      const res = await fetch(`http://localhost:3000/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error eliminant usuari");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error eliminant usuari");
    }
  };

  // ✏️ Canviar rol
  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const res = await fetch(`http://localhost:3000/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Error actualitzant rol");
      const updated: User = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: updated.role } : u))
      );
    } catch (err) {
      console.error(err);
      alert("No s’ha pogut actualitzar el rol");
    }
  };

  if (loading) return <div className="p-4">Carregant usuaris…</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Benvingut/da, {user?.name} (Admin)
      </h1>

      {users.length === 0 ? (
        <p>No hi ha usuaris registrats.</p>
      ) : (
        <table className="min-w-full border border-gray-300 text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border-b">Nom</th>
              <th className="p-2 border-b">Email</th>
              <th className="p-2 border-b">Rol</th>
              <th className="p-2 border-b">Accions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td className="p-2 border-b">{u.name}</td>
                <td className="p-2 border-b">{u.email}</td>
                <td className="p-2 border-b">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="subscriber">subscriptor</option>
                    <option value="editor">editor</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="p-2 border-b">
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
