import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const USERS = [
  { email: "Vindiainfrasec@admin", password: "Admin@123", role: "admin" },
  { email: "Vindiainfrasec@bda1", password: "Bda1@123", role: "bda" },
  { email: "Vindiainfrasec@bda2", password: "Bda2@123", role: "assistant" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = (email, password) => {
    const found = USERS.find(
      (u) => u.email === email && u.password === password
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

export const useAuth = () => useContext(AuthContext);
