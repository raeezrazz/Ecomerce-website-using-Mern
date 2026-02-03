import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import type { RootState } from "../../store/store";
import { useEffect, useState } from "react";

/**
 * UserProtected - Protects user profile and cart routes
 * Only allows access if user is authenticated (not admin)
 */
const UserProtected = () => {
    const { userInfo } = useSelector((state: RootState) => state.user);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    
    useEffect(() => {
        // Check both Redux store and localStorage
        const token = localStorage.getItem('userToken');
        const accessToken = localStorage.getItem('accessToken');
        const userData = localStorage.getItem('userData');
        const authToken = localStorage.getItem('authToken'); // Admin token
        
        // If admin token exists, user should not access user routes
        if (authToken) {
            setIsAuthorized(false);
            setIsLoading(false);
            return;
        }
        
        // Check if user token exists
        const hasUserToken = !!(token || accessToken);
        const hasUserData = !!userData;
        
        // If we have token/userData but no Redux state, user is still authenticated
        if ((hasUserToken || hasUserData) && !userInfo) {
            setIsAuthorized(true);
            setIsLoading(false);
            return;
        }
        
        // Check if userInfo exists in Redux
        if (userInfo) {
            setIsAuthorized(true);
        } else {
            setIsAuthorized(hasUserToken && hasUserData);
        }
        
        setIsLoading(false);
    }, [userInfo]);
    
    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
    
    if (!isAuthorized) {
        // Clear invalid tokens
        localStorage.removeItem('userToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('refreshToken');
        return <Navigate to="/auth" replace />;
    }
    
    return <Outlet />;
};

export default UserProtected;
