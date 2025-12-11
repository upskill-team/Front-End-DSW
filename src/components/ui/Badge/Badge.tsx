import * as React from 'react';
import { cn } from '../../../lib/utils';

/**
 * An object containing the Tailwind CSS classes for the different badge variants.
 * @type {Record<string, string>}
 */
const badgeVariants = {
  default:
    'border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80',
  secondary:
    'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80',
  destructive:
    'border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80',
  outline: 'text-slate-950',
};

/**
 * @interface BadgeProps
 * @extends React.HTMLAttributes<HTMLDivElement>
 * @property {'default' | 'secondary' | 'destructive' | 'outline'} [variant='default'] - The visual style of the badge.
 */
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants;
}

/**
 * A UI component to display a badge or tag.
 * It supports multiple visual styles through variants.
 *
 * @param {BadgeProps} props - The properties for the badge component.
 * @returns {JSX.Element} The rendered badge component.
 */
const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
};

export default Badge;