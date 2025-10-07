import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { fetchWithValidation } from "../utils/fetchWithValidation";
import Spinner from "../components/Spinner";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "subscriber";
  active: boolean;
}

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  /* ----------------------- Carregar usuaris ----------------------- */
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

  /* ----------------------- Autoesborrar missatge ----------------------- */
  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [message]);

  /* ----------------------- Accions admin ----------------------- */
  const handleToggleActive = async (id: string, current: boolean) => {
    if (id === user?.id) return; // 👈 no permet bloquejar-se

    try {
      const updated = await fetchWithValidation<User>(
        `http://localhost:3000/admin/users/${id}/toggle`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ active: !current }),
        }
      );

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, active: updated.active } : u))
      );
      setMessage(
        updated.active
          ? "✅ Usuari reactivat correctament"
          : "⛔ Usuari bloquejat"
      );
    } catch (err) {
      if (err instanceof Error) setMessage(`❌ ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (id === user?.id) return; // 👈 no permet eliminar-se
    if (!confirm("Vols eliminar aquest usuari?")) return;

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

  /* ----------------------- Filtratge ----------------------- */
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  /* ----------------------- Render ----------------------- */
  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" color="text-green-600 dark:text-green-400" />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 text-gray-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Panell d’administració
      </h1>

      {message && (
        <p
          className={`mb-4 text-center text-sm ${
            message.startsWith("✅")
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {message}
        </p>
      )}

      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Cerca per nom o correu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2 dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 dark:border-gray-700 text-left bg-white dark:bg-gray-800 rounded shadow-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="p-2 border-b dark:border-gray-600">Nom</th>
              <th className="p-2 border-b dark:border-gray-600">Email</th>
              <th className="p-2 border-b dark:border-gray-600">Rol</th>
              <th className="p-2 border-b dark:border-gray-600 text-center">
                Estat
              </th>
              <th className="p-2 border-b dark:border-gray-600 text-center">
                Accions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr
                key={u._id}
                className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  !u.active ? "opacity-60" : ""
                }`}
              >
                <td className="p-2 border-b dark:border-gray-700">{u.name}</td>
                <td className="p-2 border-b dark:border-gray-700">{u.email}</td>
                <td className="p-2 border-b dark:border-gray-700">
                  <select
                    value={u.role}
                    onChange={(e) =>
                      handleRoleChange(u._id, e.target.value as User["role"])
                    }
                    className="border dark:border-gray-600 rounded p-1 bg-white dark:bg-gray-900 text-sm"
                  >
                    <option value="subscriber">Subscriptor</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </td>
                <td className="p-2 border-b dark:border-gray-700 text-center">
                  {u.active ? "✅ Actiu" : "⛔ Bloc."}
                </td>
                <td className="p-2 border-b dark:border-gray-700 text-center flex gap-2 justify-center">
                  <button
                    disabled={u._id === user?.id}
                    onClick={() => handleToggleActive(u._id, u.active)}
                    className={`${
                      u.active
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-green-600 hover:bg-green-700"
                    } text-white text-sm px-3 py-1 rounded transition disabled:bg-gray-400`}
                  >
                    {u.active ? "Bloquejar" : "Activar"}
                  </button>
                  <button
                    disabled={u._id === user?.id}
                    onClick={() => handleDelete(u._id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded transition disabled:bg-gray-400"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
