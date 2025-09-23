import { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { JSX } from "react";

interface User { email: string; role?: "admin" | "user"; }
interface AuthContextProps {
  user: User | null;
  login: (email: string) => Promise<void>;
  logout: ()=>void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);
// Remove useAuth export from this file

export const AuthProvider = ({children}:{children:ReactNode}): JSX.Element => {
  const [user, setUser] = useState<User|null>(null);

  const login = async (email: string) => {
    // Aquí iría llamada a Firebase o a tu API
    setUser({ email, role:"user" });
  };
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
