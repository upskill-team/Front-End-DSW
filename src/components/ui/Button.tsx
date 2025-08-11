import React from 'react';

// Definimos las props que nuestro botón aceptará.
// Extiende los atributos de un botón HTML normal para que podamos pasar 'type', 'onClick', etc.
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode; // El texto o ícono dentro del botón
  isLoading?: boolean;       // Un booleano opcional para el estado de carga
}

const Button = ({ children, isLoading = false, ...props }: ButtonProps) => {
  // Aquí definimos las clases UNA SOLA VEZ.
  const baseClasses = "w-full inline-flex items-center justify-center py-3 px-6 rounded-lg font-medium text-sm text-white bg-gradient-to-r from-primary-600 to-primary-700 shadow-medium hover:from-primary-700 hover:to-primary-800 hover:scale-[1.02] hover:shadow-strong transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

  return (
    <button
      className={baseClasses}
      disabled={isLoading}
      {...props} // Pasamos todas las demás props (como type="submit") al botón real
    >
      {isLoading ? (
        // Muestra un spinner cuando isLoading es true
        <span className="animate-spin h-5 w-5 border-2 border-transparent border-t-white rounded-full"></span>
      ) : (
        // Muestra el contenido normal si no
        children
      )}
    </button>
  );
};

export default Button;