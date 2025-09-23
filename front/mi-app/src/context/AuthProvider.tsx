import {
  useState,
  useEffect,       // ✅ importado para la persistencia
  type ReactNode,
} from "react";
import { AuthContext } from "./AuthContext";

export type User = {
  id: string;
  name: string;
};

export type AuthContextProps = {
  user: User | null;
  setUser: (u: User | null) => void;
};

/**
 * Componente que envuelve la app y provee el contexto de autenticación
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Inicializa el usuario con el valor guardado en localStorage, si existe
  const [user, setUser] = useState<User | null>(
    () => JSON.parse(localStorage.getItem("user") || "null")
  );

  // Guarda el usuario en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
