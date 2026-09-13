import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Sidebar({isOpen,onClose}){
 const {user,logout}=useAuth(); const navigate=useNavigate();
 const items=[["/dashboard","Dashboard","⌂"],["/timetable","Timetable","▦"],["/attendance","Attendance","✓"],["/notes","Notes","📝"],["/assignments","Assignments","📚"],["/focus","Focus Zone","🎯"]];
 return <>{isOpen&&<div className="sidebar-overlay" onClick={onClose}/>}<aside className={`sidebar ${isOpen?"sidebar-open":""}`}>
  <div className="sidebar-header"><NavLink to="/" className="sidebar-logo"><span className="sidebar-logo-icon">C</span><span>CampusHub AI</span></NavLink><button className="sidebar-close" onClick={onClose}>×</button></div>
  <div className="sidebar-user"><div className="user-avatar">{user?.name?.[0]?.toUpperCase()||"U"}</div><div className="user-info"><strong>{user?.name||"Campus User"}</strong><span>{user?.role||"Student"}</span></div></div>
  <nav className="sidebar-nav"><p className="sidebar-section-title">MAIN MENU</p>{items.map(([path,label,icon])=><NavLink key={path} to={path} onClick={onClose} className={({isActive})=>`sidebar-link ${isActive?"sidebar-link-active":""}`}><span className="sidebar-icon">{icon}</span><span>{label}</span></NavLink>)}</nav>
  <div className="sidebar-bottom"><button className="sidebar-logout" onClick={()=>{logout();navigate("/login");}}><span className="sidebar-icon">↪</span>Logout</button></div>
 </aside></>
}
