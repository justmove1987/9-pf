import { useContext } from "react";
import { AuthContext, AuthContextProps } from "./AuthContext";

export const useAuth = () =>
  useContext<AuthContextProps>(AuthContext);

