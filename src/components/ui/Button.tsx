import React from 'react';

type ButtonVariant = 'primary' | 'outline';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  variant?: ButtonVariant;
}

const Button = ({
  children,
  isLoading = false,
  variant = 'primary',
  className,
  ...props
}: ButtonProps) => {
  const baseClasses = `
    w-full inline-flex items-center justify-center py-2.5 px-4 rounded-lg font-medium 
    text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline:
      'bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-400',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="animate-spin h-5 w-5 border-2 border-transparent border-t-current rounded-full"></span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
