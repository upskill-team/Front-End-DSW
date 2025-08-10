import AppRouter from './router/AppRouter.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;