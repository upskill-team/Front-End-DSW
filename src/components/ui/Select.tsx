import * as React from 'react';
import { cn } from '../../lib/utils';

/**
 * Props for the Select component.
 * @interface SelectProps
 * @extends React.SelectHTMLAttributes<HTMLSelectElement>
 */
interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /**
   * The text label displayed above the select field.
   */
  label: string;
  /**
   * The option elements to be rendered inside the select.
   */
  children: React.ReactNode;
}

/**
 * A reusable select (dropdown) component with support for labels and error states.
 * This component forwards its ref, making it fully compatible with form libraries like React Hook Form.
 *
 * @param {SelectProps} props - The properties to configure the select component.
 * @param {React.Ref<HTMLSelectElement>} ref - The ref forwarded to the underlying select element.
 * @returns {JSX.Element} The rendered select component.
 * @example
 * <Select
 *   id="category"
 *   label="Select a Category"
 *   {...register('category')}
 * >
 *   <option value="tech">Technology</option>
 *   <option value="design">Design</option>
 * </Select>
 */
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ id, label, children, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
        <select
          id={id}
          ref={ref}
          className={cn(
            'w-full py-3 px-4 border rounded-lg transition-all',
            'bg-slate-100/70 border-transparent',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white',
            className
          )}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;