import { Spinner } from '../ui/spinner';
import { cn } from '../../lib/utils';

interface LoadingAnimationProps {
  message?: string;
  className?: string;
}

export function LoadingAnimation({
  message = 'Loading...',
  className,
}: LoadingAnimationProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 space-y-4',
        className
      )}
    >
      <Spinner className="h-12 w-12 text-primary" />
      <p className="text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 space-y-4 text-center',
        className
      )}
    >
      <div className="rounded-full bg-muted p-4">
        <svg
          className="h-12 w-12 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
        )}
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}

