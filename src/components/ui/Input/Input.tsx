import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../../lib/utils';
import Button from '../Button/Button';

/**
 * Props for the Input component.
 * @interface InputProps
 * @extends React.InputHTMLAttributes<HTMLInputElement>
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * The text label displayed above the input field.
   */
  label?: string;
  /**
   * An optional icon to be displayed inside the input field on the left.
   */
  icon?: React.ReactNode;
  /**
   * An error message to be displayed below the input. If provided, the input border will be styled to indicate an error.
   * @default null
   */
  error?: string | null;
}

/**
 * A versatile and reusable input component with support for labels, icons, and error states.
 * It also includes built-in functionality for password visibility toggling.
 * This component forwards its ref, making it fully compatible with form libraries like React Hook Form.
 *
 * @param {InputProps} props - The properties to configure the input.
 * @param {React.Ref<HTMLInputElement>} ref - The ref forwarded to the underlying input element.
 * @returns {JSX.Element} The rendered input component.
 * @example
 * <Input
 *   id="email"
 *   label="Email Address"
 *   type="email"
 *   icon={<Mail />}
 *   error={errors.email?.message}
 *   {...register('email')}
 * />
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, type, icon, error, className, ...props }, ref) => {
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    const isPasswordInput = type === 'password';
    const inputType = isPasswordInput
      ? isPasswordVisible
        ? 'text'
        : 'password'
      : type;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {icon}
            </span>
          )}
          <input
            id={id}
            type={inputType}
            className={cn(
              'w-full py-3 border rounded-lg transition-all',
              'bg-slate-100/70 border-transparent',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white',
              icon ? 'pl-10' : 'pl-4',
              isPasswordInput ? 'pr-10' : 'pr-4',
              error && 'border-red-500 ring-red-200 focus:border-red-500 focus:ring-red-500/50',
              className
            )}
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