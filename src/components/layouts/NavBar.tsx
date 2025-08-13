import { Badge, Bell, BookOpen, GraduationCap, LogIn, ShoppingCart, UserPlus } from "lucide-react";
import Button from "../../components/ui/Button";
import React from "react";
import { Link } from "react-router-dom";

function NavBar({ token }: { token?: string | null }) {

    const currentUser = {cartItems:null};
    
  return (
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      <Link
        to="/"
        className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-lg flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-poppins font-bold text-slate-800">
          UpSkill
        </span>
      </Link>

      <div className="flex items-center justify-between space-x-3 max-w-sm">
        <button
          className="hidden sm:flex items-center space-x-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 bg-transparent px-2 py-2 rounded-lg border text-sm font-medium"
          onClick={() => alert("Formulario para profesores próximamente!")}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Quiero ser profesor</span>
        </button>

        {token ? (
          <>
            {/* Carrito de compras */}
            <Link to="/carrito">
              <Button
                variant="ghost"
                className="relative text-slate-700 hover:text-blue-600 hover:bg-blue-50 p-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {currentUser.cartItems && currentUser.cartItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                    {currentUser.cartItems}
                  </Badge>
                )}
              </Button>
            </Link>
            {/* Notificaciones */}
            <Button
              variant="ghost"
              className="flex-1 text-slate-700 hover:text-blue-600 hover:bg-blue-50 p-2"
            >
              <Bell className="w-5 h-5" />
            </Button>
            {/* Perfil de usuario */}
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <img
                  src="https://via.placeholder.com/40"
                  alt="User Avatar"
                  className="h-10 w-10 rounded-full object-cover"
                />
              </Button>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}

export default NavBar;
