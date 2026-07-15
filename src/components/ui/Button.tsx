import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-accent shadow-md hover:shadow-lg active:bg-accent-dark',
  secondary: 'bg-secondary text-white hover:bg-secondary-light shadow-md hover:shadow-lg active:bg-secondary',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white active:bg-primary-light',
  ghost: 'text-primary hover:bg-section active:bg-section-alt',
  accent: 'bg-accent text-white hover:bg-accent-light shadow-md hover:shadow-lg active:bg-accent-dark',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-base',
  lg: 'px-8 py-3 text-lg',
  xl: 'px-10 py-4 text-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, fullWidth, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'relative overflow-hidden',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
      {!loading && (
        <span className="absolute inset-0 rounded-md transition-all duration-300 hover:bg-white/10" />
      )}
    </button>
  )
);
Button.displayName = 'Button';
