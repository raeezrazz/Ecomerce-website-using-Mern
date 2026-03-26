import axios from "axios";
import { safeGetItem, safeRemoveItem, safeSetItem } from "@/lib/safeStorage";

// const baseURL = import.meta.env.VITE_API_URL || "http://13.239.33.61:4000";
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000";


const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  // Mobile networks + image upload can take longer; prevent premature timeouts.
  timeout: 120000,
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
    (config) => {
        // Check for admin token first, then user token
        const adminToken = safeGetItem('authToken');
        const userToken = safeGetItem('userToken') || safeGetItem('accessToken');
        
        // Use admin token for admin routes, user token for user routes
        const isAdminRoute = config.url?.includes('/api/admin');
        
        // For admin routes, only use admin token
        // For user routes, only use user token (not admin token)
        const token = isAdminRoute ? adminToken : userToken;
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            const isAdminRoute = originalRequest.url?.includes('/api/admin');
            const refreshToken = safeGetItem('refreshToken');
            
            // For public routes (like products, categories), don't redirect on 401
            // Just let the error pass through so the page can still load
            const isPublicRoute =
              originalRequest.url?.includes('/api/admin/products') ||
              originalRequest.url?.includes('/api/admin/categories') ||
              originalRequest.url?.includes('/api/admin/auth/login') ||
              originalRequest.url?.includes('/api/user/login') ||
              originalRequest.url?.includes('/api/user/register') ||
              originalRequest.url?.includes('/api/user/verifyOtp') ||
              originalRequest.url?.includes('/api/admin/auth/refreshToken');

            // Never attempt refresh-token retry for auth/login endpoints.
            // Otherwise the original 401 reason (wrong password) can be replaced by a refresh error,
            // and the UI may not show the correct backend message.
            const isAuthLoginRequest =
              originalRequest.url?.includes('/api/admin/auth/login') ||
              originalRequest.url?.includes('/api/user/login');
            if (isAuthLoginRequest) {
              return Promise.reject(error);
            }
            
            if (isPublicRoute && !refreshToken) {
                // Public route without token - just return the error, don't redirect
                return Promise.reject(error);
            }
            
            if (refreshToken) {
                try {
                    let response;
                    if (isAdminRoute) {
                        // Admin token refresh
                        response = await axios.post(`${baseURL}/api/admin/auth/refreshToken`, {
                            refreshToken,
                        });
                        const { accessToken } = response.data;
                        safeSetItem('authToken', accessToken);
                        if (response.data.refreshToken) {
                            safeSetItem('refreshToken', response.data.refreshToken);
                        }
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    } else {
                        // User token refresh
                        response = await axios.post(`${baseURL}/api/user/refreshToken`, {
                            refreshToken,
                        });
                        const { accessToken } = response.data;
                        safeSetItem('userToken', accessToken);
                        safeSetItem('accessToken', accessToken);
                        if (response.data.refreshToken) {
                            safeSetItem('refreshToken', response.data.refreshToken);
                        }
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    }
                    
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    // Refresh failed
                    if (isPublicRoute) {
                        // For public routes, just return error without redirecting
                        return Promise.reject(refreshError);
                    }
                    
                    // For protected routes, logout and redirect
                    if (isAdminRoute) {
                        // Only clear admin tokens
                        safeRemoveItem('authToken');
                        safeRemoveItem('adminUser');
                        safeRemoveItem('refreshToken');
                        // Don't redirect here - let the component handle it
                        return Promise.reject(refreshError);
                    } else {
                        // Only clear user tokens
                        safeRemoveItem('userToken');
                        safeRemoveItem('refreshToken');
                        safeRemoveItem('accessToken');
                        safeRemoveItem('userData');
                        safeRemoveItem('userInfo');
                        // Don't redirect here - let the component handle it
                        return Promise.reject(refreshError);
                    }
                }
            } else {
                // No refresh token
                if (isPublicRoute) {
                    // For public routes, just return error without redirecting
                    return Promise.reject(error);
                }
                
                // For protected routes, don't redirect here - let components handle it
                // This prevents unwanted redirects
                return Promise.reject(error);
            }
        }
        
        return Promise.reject(error);
    }
);

export default apiClient