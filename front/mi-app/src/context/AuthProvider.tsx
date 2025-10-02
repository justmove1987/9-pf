import {
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { AuthContext } from "./AuthContext";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AuthContextProps = {
  user: User | null;
  setUser: (u: User | null) => void;
  accessToken: string | null;
  setAccessToken: (t: string | null) => void;
  logout: () => void;   // ✅ afegit
};

/**
 * Proveïdor del context d'autenticació
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(
    () => JSON.parse(localStorage.getItem("user") || "null")
  );
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem("token")
  );

  // ✅ Persistència al localStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  useEffect(() => {
    if (accessToken) localStorage.setItem("token", accessToken);
    else localStorage.removeItem("token");
  }, [accessToken]);

  // ✅ Funció logout
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
