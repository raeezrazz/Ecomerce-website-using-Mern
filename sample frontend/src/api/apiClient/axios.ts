import axios from "axios";

const apiClient = axios.create({
    baseURL: 'http://localhost:4000',
    withCredentials: true
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('userToken') || localStorage.getItem('accessToken');
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
            
            // Try to refresh token
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post('http://localhost:4000/api/user/refreshToken', {
                        refreshToken,
                    });
                    
                    const { accessToken } = response.data;
                    localStorage.setItem('userToken', accessToken);
                    localStorage.setItem('accessToken', accessToken);
                    
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    // Refresh failed, logout user
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('userData');
                    localStorage.removeItem('userInfo');
                    window.location.href = '/auth';
                    return Promise.reject(refreshError);
                }
            }
        }
        
        return Promise.reject(error);
    }
);

export default apiClient