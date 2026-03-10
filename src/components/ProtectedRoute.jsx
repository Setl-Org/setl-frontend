import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

/**
 * ProtectedRoute - Wraps routes that require authentication.
 * Redirects to redirectPath (default /) when not authenticated.
 */
export function ProtectedRoute({ children, redirectPath = "/" }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children;
}
