import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <div className="loading">Loading CampusHub...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const role = String(user?.role || "").toLowerCase();
  if (allowedRoles?.length && !allowedRoles.includes(role)) {
    return <Navigate to={role === "teacher" ? "/teacher" : "/dashboard"} replace />;
  }

  return children;
}
