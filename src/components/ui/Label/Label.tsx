import * as React from 'react';
import { cn } from '../../../lib/utils';

/**
 * @typedef {object} LabelProps
 * @description Type alias for the standard HTML label attributes.
 * @see React.LabelHTMLAttributes<HTMLLabelElement>
 */
type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

/**
 * A foundational component for form elements that displays a label.
 * It is styled to be accessible and consistent with the design system.
 * This component forwards its ref to the underlying <label> element.
 *
 * @param {LabelProps} props - The properties for the label component.
 * @param {React.Ref<HTMLLabelElement>} ref - The ref to be forwarded to the label element.
 * @returns {JSX.Element} The rendered label component.
 */
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium text-slate-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  )
);
Label.displayName = 'Label';

export default Label;
