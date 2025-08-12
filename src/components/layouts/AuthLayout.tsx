import { Outlet, Link } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="flex items-center gap-4 text-slate-800 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft className="w-6 h-6" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">UpSkill</span>
          </div>
        </Link>
      </div>
      
      <main className="w-full flex justify-center">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
