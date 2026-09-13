import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    try { const saved = localStorage.getItem("campusHubUser"); if (saved) setUser(JSON.parse(saved)); }
    finally { setLoading(false); }
  }, []);
  const login = (data) => { localStorage.setItem("campusHubUser", JSON.stringify(data)); setUser(data); };
  const logout = () => { localStorage.removeItem("campusHubUser"); setUser(null); };
  return <AuthContext.Provider value={{user,login,logout,loading,isAuthenticated:!!user}}>{children}</AuthContext.Provider>;
}
export function useAuth(){ return useContext(AuthContext); }
