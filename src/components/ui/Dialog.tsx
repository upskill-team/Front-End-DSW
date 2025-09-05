import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, XIcon } from 'lucide-react';
import Button from './Button';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 text-center">{children}</div>
);
const DialogTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-semibold text-slate-900">{children}</h2>
);

const DialogFooter = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="dialog-footer"
    className={`flex flex-col-reverse gap-2 sm:flex-row sm:justify-end ${className}`}
    {...props}
  >
    {children}
  </div>
);

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-lg shadow-xl p-6 m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 h-8 w-8 p-0"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </Button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-portal')!
  );
};

const DialogContent = ({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  showCloseButton?: boolean;
}) => (
  <>
    {/* Overlay oscuro */}
    <div
      data-slot="dialog-overlay"
      className="fixed inset-0 z-40 bg-black/50"
    />

    {/* Contenido del modal */}
    <div
      data-slot="dialog-content"
      className={`fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] sm:max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-white p-6 shadow-lg`}
      {...props}
    >
      {children}

      {showCloseButton && (
        <button
          type="button"
          data-slot="dialog-close"
          className="absolute top-4 right-4 rounded opacity-70 hover:opacity-100 transition-opacity disabled:pointer-events-none"
        >
          <XIcon className="w-4 h-4 text-gray-500" />
          <span className="sr-only">Close</span>
        </button>
      )}
    </div>
  </>
);

export { Dialog, DialogHeader, DialogTitle,DialogFooter,DialogContent };
