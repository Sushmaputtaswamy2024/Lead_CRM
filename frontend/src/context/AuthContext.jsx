import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const USERS = [
  { email: "vindiainfrasec@admin", password: "Admin@123", role: "admin" },
  { email: "vindiainfrasec@bda1", password: "Bda1@123", role: "bda1" },
  { email: "vindiainfrasec@bda2", password: "Bda2@123", role: "bda2" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = (email, password) => {
  const found = USERS.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
  );

  if (!found) return false;

  localStorage.setItem("user", JSON.stringify(found));
  setUser(found);
  return true;
};


  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
