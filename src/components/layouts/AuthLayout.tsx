import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <Link 
        to="/" 
        className="absolute top-8 left-8 text-primary-100 no-underline font-semibold hover:text-white transition-colors"
      >
        Home
      </Link>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;