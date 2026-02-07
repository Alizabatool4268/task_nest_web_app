import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://aliza5-task-nest.hf.space/api/v1',
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Better Auth typically manages sessions via cookies
    // The JWT token is handled by Better Auth's client-side library
    // We'll configure axios to include credentials with every request
    config.withCredentials = true;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 errors (unauthorized) and 403 errors (forbidden)
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear any stored session data
      localStorage.removeItem('better-auth-session-token');

      // For Better Auth, we might also need to sign out from Better Auth
      // This would be handled by calling the Better Auth signOut function in the component

      // Redirect to login
      console.error('Authentication failed - redirecting to login');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login'; // Adjust to your login route
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Utility functions for API calls
export const apiClient = {
  // Task related API calls
  tasks: {
    getAll: () => api.get('/tasks'),
    getById: (id: number) => api.get(`/tasks/${id}`),
    create: (task: any) => api.post('/tasks', task),
    update: (id: number, task: any) => api.put(`/tasks/${id}`, task),
    delete: (id: number) => api.delete(`/tasks/${id}`),
    complete: (id: number, completed: boolean) =>
      api.patch(`/tasks/${id}/complete`, { completed }),
  }
};