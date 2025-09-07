import React from 'react';

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onValueChange: (value: string) => void;
  name?: string | undefined;
}

const RadioGroup = ({ className, children, value, onValueChange, name, ...props }: RadioGroupProps) => (
  <div
    data-slot="radio-group"
    className={`grid gap-3 ${className || ''}`}
    role="radiogroup"
    {...props}
  >
    {React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          name: name || child.props.name,
          checked: child.props.value === value,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => onValueChange(e.target.value),
        });
      }
      return child;
    })}
  </div>
);

export default RadioGroup;