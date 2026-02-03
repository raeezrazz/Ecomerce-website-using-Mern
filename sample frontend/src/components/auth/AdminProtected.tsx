import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

/**
 * AdminProtected - Protects admin routes
 * Only allows access if user is authenticated and has admin role
 */
export function AdminProtected() {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Only check for admin-specific tokens
        const authToken = localStorage.getItem('authToken');
        const adminUser = localStorage.getItem('adminUser');
        
        // Must have both admin token and admin user data
        if (!authToken || !adminUser) {
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        try {
          const user = JSON.parse(adminUser);
          // Check if user has admin role
          if (user.role === 'admin') {
            setIsAuthorized(true);
          } else {
            // User doesn't have admin role
            setIsAuthorized(false);
          }
        } catch {
          // Invalid admin user data
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthorized) {
    // Don't clear tokens here - let the login page handle it
    // Just redirect to admin login
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

