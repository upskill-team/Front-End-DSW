import axios from 'axios';

export const TOKEN_STORAGE_KEY = 'jwt_token';

interface FailedRequest {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Access Token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Variables to handle concurrent refresh requests
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

// Helper to process the queue of failed requests
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Handle 401 errors (Expired Access Token)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      
      if (isRefreshing) {
        return new Promise<string | null>(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await apiClient.post('/auth/refresh');
        const newToken = data.data.token;

        localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
        
        processQueue(null, newToken);
        
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return apiClient(originalRequest);
        
      } catch (refreshError: unknown) {
        processQueue(refreshError as Error, null);
        
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;