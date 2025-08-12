import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode; 
  isLoading?: boolean;       
}

const Button = ({ children, isLoading = false, ...props }: ButtonProps) => {
  const baseClasses = "w-full inline-flex items-center justify-center py-3 px-6 rounded-lg font-medium text-sm text-white bg-gradient-to-r from-primary-600 to-primary-700 shadow-medium hover:from-primary-700 hover:to-primary-800 hover:scale-[1.02] hover:shadow-strong transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

  return (
    <button
      className={baseClasses}
      disabled={isLoading}
      {...props} 
    >
      {isLoading ? (
        <span className="animate-spin h-5 w-5 border-2 border-transparent border-t-white rounded-full"></span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;