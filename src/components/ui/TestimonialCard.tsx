import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  image?: string;
}

export function TestimonialCard({ name, role, company, quote, rating }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="relative p-8 rounded-lg border border-border bg-white hover:shadow-card-hover transition-shadow"
    >
      <Quote className="w-8 h-8 text-accent/20 absolute top-6 right-6" />
      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn('w-4 h-4', star <= rating ? 'text-accent fill-accent' : 'text-border')}
          />
        ))}
      </div>
      <blockquote className="text-text-secondary leading-relaxed mb-6 italic">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-linear-to-br from-secondary to-primary flex items-center justify-center text-white font-heading font-bold text-lg">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="font-heading font-bold text-primary">{name}</p>
          <p className="text-sm text-text-muted">{role}, {company}</p>
        </div>
      </div>
    </motion.div>
  );
}
