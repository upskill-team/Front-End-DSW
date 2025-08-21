import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

const Select = ({ id, label, children, ...props }: SelectProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        id={id}
        className="w-full py-3 px-4 border rounded-lg transition-all bg-slate-100/70 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white"
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;