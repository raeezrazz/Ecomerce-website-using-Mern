import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { safeGetItem } from "@/lib/safeStorage";

/**
 * AuthGuard - Redirects authenticated users away from auth pages (login/register)
 * If user is logged in, redirect them to their appropriate dashboard
 * Handles both admin and user login pages separately
 */
export function AuthGuard() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    // Check if this is an admin login route
    const isAdminLogin = location.pathname.includes('/admin/login');
    setIsAdminRoute(isAdminLogin);

    if (isAdminLogin) {
      const authToken = safeGetItem('authToken');
      const adminUser = safeGetItem('adminUser');
      setIsAuthenticated(!!(authToken && adminUser));
    } else {
      const userToken = safeGetItem('userToken');
      const accessToken = safeGetItem('accessToken');
      const userData = safeGetItem('userData');
      setIsAuthenticated(!!(userToken || accessToken || userData));
    }
  }, [location.pathname]);

  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // If authenticated, redirect based on route type
  if (isAuthenticated) {
    if (isAdminRoute) {
      // Admin is logged in, redirect to admin dashboard
      return <Navigate to="/admin" replace />;
    } else {
      // User is logged in, redirect to home
      return <Navigate to="/" replace />;
    }
  }

  // Not authenticated, allow access to auth pages
  return <Outlet />;
}

