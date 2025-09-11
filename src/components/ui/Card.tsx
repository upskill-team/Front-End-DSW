import * as React from 'react';
import { cn } from '../../lib/utils';

/**
 * A container component that groups related content.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - The properties for the component.
 * @param {React.Ref<HTMLDivElement>} ref - The ref forwarded to the underlying div element.
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl bg-white/80 backdrop-blur-sm shadow-lg',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

/**
 * A header section for a Card component.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - The properties for the component.
 * @param {React.Ref<HTMLDivElement>} ref - The ref forwarded to the underlying div element.
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

/**
 * A title element for a CardHeader.
 * @param {React.HTMLAttributes<HTMLHeadingElement>} props - The properties for the component.
 * @param {React.Ref<HTMLHeadingElement>} ref - The ref forwarded to the underlying h3 element.
 */
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-xl font-semibold leading-none tracking-tight text-slate-800',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

/**
 * A description element for a CardHeader.
 * @param {React.HTMLAttributes<HTMLParagraphElement>} props - The properties for the component.
 * @param {React.Ref<HTMLParagraphElement>} ref - The ref forwarded to the underlying p element.
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

/**
 * The main content section for a Card component.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - The properties for the component.
 * @param {React.Ref<HTMLDivElement>} ref - The ref forwarded to the underlying div element.
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardDescription, CardContent };