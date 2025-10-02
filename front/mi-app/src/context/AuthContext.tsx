import { createContext, useContext } from "react";
import type { AuthContextProps } from "./AuthProvider";

/** Context d'autenticació pur, sense JSX */
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

/** Hook per consumir el context a qualsevol component */
export const useAuth = (): AuthContextProps => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth ha d'estar dins d'AuthProvider");
  return ctx;
};
