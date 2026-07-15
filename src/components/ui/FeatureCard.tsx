import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: 'default' | 'horizontal' | 'minimal';
}

export function FeatureCard({ icon: Icon, title, description, variant = 'default' }: FeatureCardProps) {
  if (variant === 'minimal') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex items-start gap-4 p-4"
      >
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-primary mb-1">{title}</h3>
          <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
        </div>
      </motion.div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className={cn(
          'flex items-start gap-6 p-6 rounded-lg border border-border',
          'hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300',
          'bg-white'
        )}
      >
        <div className="w-14 h-14 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
          <Icon className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h3 className="font-heading text-xl font-bold text-primary mb-2">{title}</h3>
          <p className="text-text-secondary leading-relaxed">{description}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn(
        'p-8 rounded-lg border border-border bg-white text-center',
        'hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300'
      )}
    >
      <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-accent/10 flex items-center justify-center">
        <Icon className="w-8 h-8 text-accent" />
      </div>
      <h3 className="font-heading text-xl font-bold text-primary mb-3">{title}</h3>
      <p className="text-text-secondary leading-relaxed">{description}</p>
    </motion.div>
  );
}
