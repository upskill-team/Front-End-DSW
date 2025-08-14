import type React from 'react';

type TextareaProps = React.ComponentProps<'textarea'>;

export const Textarea = ({ className, ...props }: TextareaProps) => {
  const baseClasses = "flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <textarea className={`${baseClasses} ${className}`} {...props} />
  );
};