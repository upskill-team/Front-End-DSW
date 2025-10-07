import React from 'react';

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onValueChange: (value: string) => void;
  name?: string | undefined;
}

const RadioGroup = ({
  className,
  children,
  value,
  onValueChange,
  name,
  ...props
}: RadioGroupProps) => (
  <div
    data-slot="radio-group"
    className={`grid gap-3 ${className || ''}`}
    role="radiogroup"
    {...props}
  >
    {React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        const childProps = child.props as { name?: string; value?: string };
        return React.cloneElement(
          child as React.ReactElement<{
            name?: string;
            value?: string;
            checked?: boolean;
            onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
          }>,
          {
            name: name || childProps.name,
            checked: childProps.value === value,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              onValueChange(e.target.value),
          }
        );
      }
      return child;
    })}
  </div>
);

export default RadioGroup;
