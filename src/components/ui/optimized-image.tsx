import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'placeholder'> {
  className?: string;
  usePlaceholder?: boolean;
}

export function OptimizedImage({
  className,
  usePlaceholder = false,
  alt,
  ...props
}: OptimizedImageProps) {
  return (
    <div className={cn("overflow-hidden", className)}>
      <Image
        className={cn("transition-all", className)}
        alt={alt || "Image"}
        loading={props.priority ? 'eager' : 'lazy'}
        placeholder={usePlaceholder ? 'blur' : undefined}
        blurDataURL={usePlaceholder ? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmVyc2lvbj0iMS4xIi8+" : undefined}
        {...props}
      />
    </div>
  );
} 