import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { Industry } from '../../lib/types';
import { Building2, HeartPulse, TrendingUp, HandHeart, UserCheck, GraduationCap, Church, Sprout } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  HeartPulse, Building2, TrendingUp, HandHeart, UserCheck, GraduationCap, Church, Sprout,
};

interface IndustryCardProps {
  industry: Industry;
  onSelect?: (slug: string) => void;
}

export function IndustryCard({ industry, onSelect }: IndustryCardProps) {
  const IconComponent = iconMap[industry.icon] || Building2;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      onClick={() => onSelect?.(industry.slug)}
      className={cn(
        'group relative p-6 rounded-lg border border-border bg-white text-left',
        'hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300',
        'cursor-pointer w-full'
      )}
    >
      <div className="w-14 h-14 rounded-xl bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
        <IconComponent className="w-7 h-7 text-primary group-hover:text-accent transition-colors" />
      </div>
      <h3 className="font-heading text-lg font-bold text-primary mb-2">{industry.name}</h3>
      <p className="text-sm text-text-secondary mb-3 line-clamp-2">{industry.description}</p>
      <span className="text-xs font-semibold text-accent">
        {industry.productCount} {industry.productCount === 1 ? 'template' : 'templates'}
      </span>
    </motion.button>
  );
}
