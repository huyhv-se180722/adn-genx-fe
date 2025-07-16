import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function PrivateRouter({ children, allowedRole }) {
  const { isLoggedIn, loading, role, checkTokenExpiry } = useAuth();

  // Wait for auth check to complete
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Check auth status and redirect if not logged in
  if (!isLoggedIn || !checkTokenExpiry()) {
    localStorage.setItem("redirectUrl", window.location.pathname);
    return <Navigate to="/login" replace />;
  }

  // Check role
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has correct role
  return children;
}