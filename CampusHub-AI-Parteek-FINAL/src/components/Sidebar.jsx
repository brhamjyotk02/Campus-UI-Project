import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = String(user?.role || "student").toLowerCase();

  const studentItems = [
    ["/dashboard", "Dashboard", "⌂"],
    ["/timetable", "Timetable", "▦"],
    ["/attendance", "Attendance", "✓"],
    ["/directory", "Campus Directory", "👥"],
    ["/assignments", "Assignments", "📝"],
    ["/notes", "Notes", "📚"],
    ["/focus-zone", "Focus Zone", "🎯"],
    ["/notifications", "Notifications", "🔔"],
  ];
  const campusItems = [
    ["/clubs", "Clubs", "👥"],
    ["/events", "Events", "📅"],
    ["/complaints", "Complaints", "⚠"],
    ["/assistant", "Campus Assistant", "🤖"],
    ["/campus-profile", "Achievements", "🏆"],
  ];
  const teacherItems = [
    ["/teacher", "Dashboard", "⌂"],
    ["/teacher/timetable", "Timetable", "▦"],
    ["/teacher/attendance", "Attendance Management", "✓"],
    ["/teacher/assignments", "Assignments", "📝"],
    ["/teacher/students", "Students", "👥"],
    ["/teacher/profile", "Profile", "◉"],
    ["/notifications", "Notifications", "🔔"],
  ];

  const items = role === "teacher" ? teacherItems : studentItems;

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <NavLink to={role === "teacher" ? "/teacher" : "/dashboard"} className="sidebar-logo" onClick={onClose}>
            <span className="sidebar-logo-icon">C</span><span>CampusHub AI</span>
          </NavLink>
          <button className="sidebar-close" onClick={onClose}>×</button>
        </div>
        <div className="sidebar-user">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase() || "U"}</div>
          <div className="user-info"><strong>{user?.name || "Campus User"}</strong><span>{role === "teacher" ? "Teacher" : "Student"}</span></div>
        </div>
        <nav className="sidebar-nav">
          <p className="sidebar-section-title">ACADEMIC</p>
          {items.map(([path, label, icon]) => (
            <NavLink key={path} to={path} onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}>
              <span className="sidebar-icon">{icon}</span><span>{label}</span>
            </NavLink>
          ))}
          {role === "student" && <>
            <p className="sidebar-section-title campus-nav-title">CAMPUS LIFE</p>
            {campusItems.map(([path, label, icon]) => (
              <NavLink key={path} to={path} onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}>
                <span className="sidebar-icon">{icon}</span><span>{label}</span>
              </NavLink>
            ))}
            <NavLink to="/profile" onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}>
              <span className="sidebar-icon">◉</span><span>Profile</span>
            </NavLink>
          </>}
        </nav>
        <div className="sidebar-bottom">
          <button className="sidebar-logout" onClick={() => { logout(); onClose?.(); navigate("/login"); }}><span className="sidebar-icon">↪</span><span>Logout</span></button>
        </div>
      </aside>
    </>
  );
}
