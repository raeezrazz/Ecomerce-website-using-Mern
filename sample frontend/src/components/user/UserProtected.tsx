import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import type { RootState } from "../../store/store";
import { useEffect, useState } from "react";

const UserProtected = () => {
    const { userInfo } = useSelector((state: RootState) => state.user);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        // Check both Redux store and localStorage
        const token = localStorage.getItem('userToken');
        const userData = localStorage.getItem('userData');
        
        // If we have token/userData but no Redux state, user is still authenticated
        if ((token || userData) && !userInfo) {
            setIsLoading(false);
            return;
        }
        
        setIsLoading(false);
    }, [userInfo]);
    
    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
    
    // Check both Redux store and localStorage for authentication
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    const isAuthenticated = userInfo || (token && userData);
    
    return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default UserProtected;
