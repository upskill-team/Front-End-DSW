import AppRouter from './router/AppRouter.tsx';
import { AuthProvider } from './contexts/AuthProvider.tsx';
import ErrorBoundary from './components/ui/ErrorBoundary.tsx';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;