import { createContext, useContext, useState, useEffect } from "react";
import { logout as apiLogout } from "../api/drupal";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    const username = localStorage.getItem("username");
    const creds = localStorage.getItem("basic_creds");
    if (uid && username && creds) setUser({ uid, username });
  }, []);

  const login = () => {
    setUser({
      uid: localStorage.getItem("uid"),
      username: localStorage.getItem("username"),
    });
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);