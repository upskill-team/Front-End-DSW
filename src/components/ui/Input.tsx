import React, { forwardRef, useState } from 'react';
import Button from './Button';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string | null;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, type, icon, error, ...props }, ref) => {
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    const isPasswordInput = type === 'password';
    const inputType = isPasswordInput
      ? isPasswordVisible
        ? 'text'
        : 'password'
      : type;

    const inputClasses = `
      w-full py-3 border rounded-lg transition-all
      bg-slate-100/70 border-transparent 
      focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white
      ${icon ? 'pl-10' : 'pl-4'}
      ${isPasswordInput ? 'pr-10' : 'pr-4'}
      ${error ? 'border-red-500 ring-red-200' : ''}
    `;

    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {icon}
            </span>
          )}
          <input
            id={id}
            type={inputType}
            className={inputClasses}
            ref={ref}
            {...props}
          />

          {isPasswordInput && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setPasswordVisible(!isPasswordVisible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label={
                isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'
              }
            >
              {isPasswordVisible ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
