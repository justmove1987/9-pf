import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { fetchWithValidation } from "../utils/fetchWithValidation";
import Spinner from "../components/Spinner";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "subscriber";
}

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  // 🔄 Carregar usuaris
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchWithValidation<User[]>(
          "http://localhost:3000/admin/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(data);
      } catch (err) {
        if (err instanceof Error) setMessage(`❌ ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [token]);

  // 🗑️ Eliminar usuari
  const handleDelete = async (id: string) => {
    if (!window.confirm("Vols eliminar aquest usuari?")) return;

    try {
      await fetchWithValidation<void>(
        `http://localhost:3000/admin/users/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setMessage("✅ Usuari eliminat correctament");
    } catch (err) {
      if (err instanceof Error) setMessage(`❌ ${err.message}`);
    }
  };

  // ✏️ Canviar rol
  const handleRoleChange = async (id: string, newRole: User["role"]) => {
    try {
      const updated = await fetchWithValidation<User>(
        `http://localhost:3000/admin/users/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: updated.role } : u))
      );
      setMessage("✅ Rol actualitzat correctament");
    } catch (err) {
      if (err instanceof Error) setMessage(`❌ ${err.message}`);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" color="text-green-600" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Benvingut/da, {user?.name} (Admin)
      </h1>

      {message && (
        <p
          className={`mb-4 text-center text-sm ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      {users.length === 0 ? (
        <p className="text-center text-gray-600">No hi ha usuaris registrats.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-left bg-white rounded shadow-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2 border-b">Nom</th>
                <th className="p-2 border-b">Email</th>
                <th className="p-2 border-b">Rol</th>
                <th className="p-2 border-b text-center">Accions</th>
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
                      onChange={(e) =>
                        handleRoleChange(u._id, e.target.value as User["role"])
                      }
                      className="border rounded p-1 bg-white text-sm"
                    >
                      <option value="subscriber">Subscriptor</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </td>
                  <td className="p-2 border-b text-center">
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
