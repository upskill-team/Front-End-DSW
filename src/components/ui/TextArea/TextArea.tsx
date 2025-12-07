import * as React from 'react';
import { cn } from '../../../lib/utils';

/**
 * Props for the Textarea component.
 * @interface TextareaProps
 * @extends React.TextareaHTMLAttributes<HTMLTextAreaElement>
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * The text label displayed above the textarea.
   */
  label: string;
  /**
   * An optional icon to be displayed inside the textarea on the top-left.
   */
  icon?: React.ReactNode;
  /**
   * An error message to be displayed below the textarea. If provided, the border will be styled to indicate an error.
   * @default null
   */
  error?: string | null;
}

/**
 * A reusable textarea component with support for labels, icons, and error states.
 * This component forwards its ref, making it fully compatible with form libraries like React Hook Form.
 *
 * @param {TextareaProps} props - The properties to configure the textarea.
 * @param {React.Ref<HTMLTextAreaElement>} ref - The ref forwarded to the underlying textarea element.
 * @returns {JSX.Element} The rendered textarea component.
 * @example
 * <Textarea
 *   id="description"
 *   label="Course Description"
 *   error={errors.description?.message}
 *   {...register('description')}
 * />
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, id, label, icon, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-4 text-slate-400 pointer-events-none">
              {icon}
            </span>
          )}
          <textarea
            id={id}
            ref={ref}
            className={cn(
              'w-full flex min-h-[120px] p-4 border rounded-lg transition-all',
              'bg-slate-100/70 border-transparent',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white',
              'resize-none text-sm placeholder:text-slate-500',
              icon && 'pl-10',
              error && 'border-red-500 ring-red-200 focus:border-red-500 focus:ring-red-500/50',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;