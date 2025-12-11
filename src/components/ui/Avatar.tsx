import * as React from 'react';
import { cn } from '../../lib/utils';

type ImageStatus = 'loading' | 'loaded' | 'error';

const AvatarContext = React.createContext<{
  imageStatus: ImageStatus;
  setImageStatus: React.Dispatch<React.SetStateAction<ImageStatus>>;
} | null>(null);

const useAvatarContext = () => {
  const context = React.useContext(AvatarContext);
  if (!context) {
    throw new Error('Avatar components must be used within an Avatar provider');
  }
  return context;
};

const Avatar = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  const [imageStatus, setImageStatus] = React.useState<ImageStatus>('loading');
  return (
    <AvatarContext.Provider value={{ imageStatus, setImageStatus }}>
      <span
        ref={ref}
        className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
        {...props}
      />
    </AvatarContext.Provider>
  );
});
Avatar.displayName = 'Avatar';

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => {
  const { setImageStatus } = useAvatarContext();

  return (
    <img
      ref={ref}
      className={cn('aspect-square h-full w-full', className)}
      onLoad={() => setImageStatus('loaded')}
      onError={() => setImageStatus('error')}
      {...props}
    />
  );
});
AvatarImage.displayName = 'AvatarImage';

const AvatarFallback = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  const { imageStatus } = useAvatarContext();

  if (imageStatus === 'loaded') {
    return null;
  }

  return (
    <span
      ref={ref}
      className={cn('flex h-full w-full items-center justify-center rounded-full bg-slate-100', className)}
      {...props}
    />
  );
});
AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };