import axios from 'axios';

// Call environment variable using Vite's import.meta.env
const API_URL = import.meta.env.VITE_API_URL || '';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 & refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 Unauthorized and request hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }
        
        // Make request to get new token
        // const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        // const newAccessToken = data.accessToken;
        
        // Save new token
        // localStorage.setItem('access_token', newAccessToken);
        
        // Update authorization header and retry original request
        // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        // return axiosInstance(originalRequest);
        
      } catch (refreshError) {
        // Handle failed refresh (e.g., clear tokens, redirect to login page)
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
