import { createContext, useContext } from "react";

const initialValue = {
  isAuthenticated: true,
  userDetails: null,
  login: () => {},
  logout: () => {},
};
export const AuthContext = createContext(initialValue);

// useAuth - hook
export const useAuth = () => useContext(AuthContext);
