import { useState, useEffect } from "react";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export function useUsers() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { users, loading };
}
