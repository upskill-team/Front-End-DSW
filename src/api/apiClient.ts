import axios, { isAxiosError } from 'axios';

export const TOKEN_STORAGE_KEY = 'jwt_token';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error) && error.response) {
      const backendError = error.response.data?.errors;
      const backendMessage = error.response.data?.message;

      if (backendError) {
        const errorMessage = Array.isArray(backendError) 
          ? backendError.join(', ') 
          : typeof backendError === 'object' 
            ? JSON.stringify(backendError) 
            : backendError;
        error.message = errorMessage;
      } else if (backendMessage) {
        error.message = backendMessage;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;