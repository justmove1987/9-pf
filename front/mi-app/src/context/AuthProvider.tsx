import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";

export type User = { id: string; name: string };

export type AuthContextProps = {
  user: User | null;
  setUser: (u: User | null) => void;
};

/** Componente que envuelve la app y provee el contexto */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
