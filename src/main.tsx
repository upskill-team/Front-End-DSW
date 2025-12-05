import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider, MutationCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App.tsx';
import './index.css';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      ignoreGlobalError?: boolean
    }
  }
}

interface ApiErrorResponse {
  message?: string;
  errors?: string | Record<string, unknown>;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
    },
  },
  mutationCache: new MutationCache({
    onError: (error: unknown, _variables, _context, mutation) => {
      
      if (mutation.meta?.ignoreGlobalError) {
        return; 
      }
      
      const axiosError = error as AxiosError<ApiErrorResponse>;

      const status = axiosError.response?.status;
      const backendMessage = axiosError.response?.data?.message;
      const backendErrors = axiosError.response?.data?.errors;

      if (backendMessage) {
        toast.error(backendMessage);
        return;
      }
      if (typeof backendErrors === 'string') {
        toast.error(backendErrors);
        return;
      }
      if (status && status >= 500) {
        toast.error('Error interno del servidor. Por favor intenta más tarde.');
        return;
      }
      if (!axiosError.response) {
        toast.error('No se pudo conectar con el servidor. Revisa tu conexión.');
        return;
      }
      toast.error('Ocurrió un error inesperado.');
    },
  }),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
