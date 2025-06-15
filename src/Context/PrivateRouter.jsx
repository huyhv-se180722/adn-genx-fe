import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function PrivateRouter({ children }) {
  const { isLoggedIn, loading } = useAuth();

  // Wait for auth check to complete
  if (loading) {
    return <div className="loading">Loading...</div>; // Or your loading spinner
  }

  // Check auth status and redirect if not logged in
  if (!isLoggedIn) {
    // Save current path for redirect after login
    localStorage.setItem("redirectUrl", window.location.pathname);
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render protected content
  return children;
}