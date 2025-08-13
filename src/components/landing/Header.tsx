import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, LogIn, UserPlus, GraduationCap } from 'lucide-react';
import NavBar from '../layouts/NavBar.tsx';

export function Header({token}: { token?: string | null }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-sm">
{ /*     <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-poppins font-bold text-slate-800">UpSkill</span>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            className="hidden sm:flex items-center space-x-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 bg-transparent px-4 py-2 rounded-lg border text-sm font-medium"
            onClick={() => alert('Formulario para profesores próximamente!')}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Quiero ser profesor</span>
          </button>

          <Link
            to="/login"
            className="flex items-center text-slate-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors font-medium text-sm"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login
          </Link>
          <Link
            to="/register"
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Register
          </Link>
        </div>
      </div>*/}

      <NavBar token={token} />
    </header>
  );
}