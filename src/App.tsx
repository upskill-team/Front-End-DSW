import AppRouter from './router/AppRouter.tsx';
import { AuthProvider } from './contexts/AuthProvider.tsx';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-right" 
        reverseOrder={false}
        toastOptions={{
          className: '',
          style: {
            border: '1px solid #E2E8F0',
            padding: '16px',
            color: '#1E293B',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFAEE',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFAEE',
            },
          },
        }}
      />
      <AppRouter />
    </AuthProvider>
  );
}

export default App;