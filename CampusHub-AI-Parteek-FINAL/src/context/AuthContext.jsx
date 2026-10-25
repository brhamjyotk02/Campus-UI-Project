import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user,setUser]=useState(null); const [loading,setLoading]=useState(true);
  useEffect(()=>{try{
    const users=JSON.parse(localStorage.getItem("campusHubUsers")||"[]");
    if(!users.length) localStorage.setItem("campusHubUsers",JSON.stringify([
      {id:"demo-student",name:"Student Demo",email:"student@campushub.local",password:"student123",role:"student"},
      {id:"demo-teacher",name:"Teacher Demo",email:"teacher@campushub.local",password:"teacher123",role:"teacher"}
    ]));
    const saved=localStorage.getItem("campusHubUser"); if(saved)setUser(JSON.parse(saved));}finally{setLoading(false)}},[]);
  const login=data=>{localStorage.setItem("campusHubUser",JSON.stringify(data));setUser(data)};
  const logout=()=>{localStorage.removeItem("campusHubUser");setUser(null)};
  return <AuthContext.Provider value={{user,login,logout,loading,isAuthenticated:!!user}}>{children}</AuthContext.Provider>
}
export function useAuth(){return useContext(AuthContext)}
