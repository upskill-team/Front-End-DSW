import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode; 
  error?: string | null; 
}

const Input = ({ label, id, type, icon, error, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const inputClasses = `w-full ${icon ? 'pl-10' : 'pl-4'} ${isPassword ? 'pr-10' : 'pr-4'} py-3 border rounded-lg text-base bg-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-neutral-700">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
            {icon}
          </span>
        )}

        <input
          id={id}
          type={inputType}
          className={`${inputClasses} ${error ? 'border-error' : 'border-neutral-300'}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        )}
      </div>
      {error && <p className="text-sm text-error mt-1">{error}</p>}
    </div>
  );
};

export default Input;