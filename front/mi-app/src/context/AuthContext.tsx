import { createContext, useContext } from "react";
import type { AuthContextProps } from "./AuthProvider";

/** Contexto de autenticación puro, sin JSX */
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

/** Hook para consumir el contexto en cualquier componente */
export const useAuth = (): AuthContextProps => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
