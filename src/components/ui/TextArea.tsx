import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  icon?: React.ReactNode; 
}

const Textarea = ({ id, label, icon, ...props }: TextareaProps) => {
  const textareaClasses = `
    w-full flex min-h-[120px] p-4 border rounded-lg transition-all
    bg-slate-100/70 border-transparent 
    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white
    resize-none text-sm placeholder:text-slate-500
    ${icon ? 'pl-10' : ''} 
  `;

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
        <textarea id={id} className={textareaClasses} {...props} />
      </div>
    </div>
  );
};

export default Textarea;