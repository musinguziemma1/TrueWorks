import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: string; positive: boolean };
  variant?: 'default' | 'compact';
}

export function StatCard({ label, value, icon, trend, variant = 'default' }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-lg border border-border bg-white p-6',
        'hover:shadow-card-hover transition-shadow',
        variant === 'compact' && 'p-4'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm font-medium text-text-muted">{label}</span>
        {icon && <span className="text-text-muted">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-2">
        <span className={cn('font-heading font-bold text-text-primary', variant === 'compact' ? 'text-2xl' : 'text-3xl')}>
          {value}
        </span>
        {trend && (
          <span className={cn('text-sm font-semibold', trend.positive ? 'text-success' : 'text-error')}>
            {trend.positive ? '+' : ''}{trend.value}
          </span>
        )}
      </div>
    </motion.div>
  );
}
