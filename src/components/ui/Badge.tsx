import { cn } from '../../lib/utils';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'accent';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  size?: 'sm' | 'md';
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-section text-text-secondary',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
  accent: 'bg-accent/10 text-accent',
};

export function Badge({ children, variant = 'default', className, size = 'sm' }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center font-semibold rounded',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
      variantStyles[variant],
      className
    )}>
      {children}
    </span>
  );
}
