import axios from 'axios';

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

    // ELIMINA TODA LA LÓGICA DEL 'Content-Type'.
    // Axios lo manejará automáticamente de forma correcta.

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;