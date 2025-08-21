import type React from 'react';

type LabelProps = React.ComponentProps<'label'>;

const Label = ({ className, ...props }: LabelProps) => {
  const baseClasses = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";

  return (
    <label className={`${baseClasses} ${className}`} {...props} />
  );
};

export default Label;