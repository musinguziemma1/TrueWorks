import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-text-primary mb-1.5">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">{icon}</div>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-md border border-border bg-white',
            'text-text-primary placeholder:text-text-muted',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            icon && 'pl-10',
            error && 'border-error focus:ring-error/20 focus:border-error',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';
