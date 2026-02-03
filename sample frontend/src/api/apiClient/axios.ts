import axios from "axios";

const apiClient = axios.create({
    // baseURL: 'https://rsmeter.onrender.com',
    baseURL: 'http://localhost:4000',

    withCredentials: true
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
    (config) => {
        // Check for admin token first, then user token
        const adminToken = localStorage.getItem('authToken');
        const userToken = localStorage.getItem('userToken') || localStorage.getItem('accessToken');
        
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
            const refreshToken = localStorage.getItem('refreshToken');
            
            // For public routes (like products, categories), don't redirect on 401
            // Just let the error pass through so the page can still load
            const isPublicRoute = originalRequest.url?.includes('/api/admin/products') || 
                                  originalRequest.url?.includes('/api/admin/categories');
            
            if (isPublicRoute && !refreshToken) {
                // Public route without token - just return the error, don't redirect
                return Promise.reject(error);
            }
            
            if (refreshToken) {
                try {
                    let response;
                    if (isAdminRoute) {
                        // Admin token refresh
                        response = await axios.post('http://localhost:4000/api/admin/auth/refreshToken', {
                            refreshToken,
                        });
                        const { accessToken } = response.data;
                        localStorage.setItem('authToken', accessToken);
                        if (response.data.refreshToken) {
                            localStorage.setItem('refreshToken', response.data.refreshToken);
                        }
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    } else {
                        // User token refresh
                        response = await axios.post('http://localhost:4000/api/user/refreshToken', {
                            refreshToken,
                        });
                        const { accessToken } = response.data;
                        localStorage.setItem('userToken', accessToken);
                        localStorage.setItem('accessToken', accessToken);
                        if (response.data.refreshToken) {
                            localStorage.setItem('refreshToken', response.data.refreshToken);
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
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('adminUser');
                        localStorage.removeItem('refreshToken');
                        // Don't redirect here - let the component handle it
                        return Promise.reject(refreshError);
                    } else {
                        // Only clear user tokens
                        localStorage.removeItem('userToken');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('userData');
                        localStorage.removeItem('userInfo');
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