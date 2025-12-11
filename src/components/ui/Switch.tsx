import * as React from 'react';
import { cn } from '../../lib/utils';

type SwitchProps = React.InputHTMLAttributes<HTMLInputElement>;

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, id, ...props }, ref) => {
    return (
      <label htmlFor={id} className={cn('relative inline-block h-6 w-11 cursor-pointer', className)}>
        <input
          type="checkbox"
          id={id}
          ref={ref}
          className="sr-only peer"
          {...props}
        />

        <div 
          className="h-full w-full rounded-full bg-slate-200 transition-colors peer-checked:bg-blue-600"
        ></div>
        
        <div 
          className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform peer-checked:translate-x-5"
        ></div>
      </label>
    );
  }
);
Switch.displayName = 'Switch';

export default Switch;