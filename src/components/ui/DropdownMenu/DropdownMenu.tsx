import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { cn } from '../../../lib/utils';

interface DropdownMenuContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


/**
 * A dropdown menu component that provides context for its trigger and content.
 * @param {Object} props - The properties for the component.
 * @param {React.ReactNode} props.children - The child components of the dropdown menu.
 */
const DropdownMenuContext = createContext<DropdownMenuContextProps | null>(null);

export const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownMenuContext.Provider>
  );
};

export const DropdownMenuTrigger = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(DropdownMenuContext);
  if (!context) throw new Error('DropdownMenuTrigger must be used within a DropdownMenu');
  return <div onClick={() => context.setOpen((prev) => !prev)}>{children}</div>;
};

export const DropdownMenuContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const context = useContext(DropdownMenuContext);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        context?.setOpen(false);
      }
    };
    if (context?.open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [context]);

  if (!context || !context.open) return null;

  return (
    <div
      ref={menuRef}
      className={cn(
        "origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50",
        className
      )}
    >
      <div className="py-1">{children}</div>
    </div>
  );
};

export const DropdownMenuItem = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const DropdownMenuSeparator = () => <div className="border-t border-slate-100 my-1" />;