import { cn } from '../../lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'section' | 'dark' | 'accent';
  id?: string;
}

const variantStyles = {
  default: 'bg-surface',
  section: 'bg-section',
  dark: 'bg-primary text-white',
  accent: 'bg-accent/5',
};

const sectionSpacing = {
  default: 'py-16 md:py-20 lg:py-24',
  section: 'py-16 md:py-20 lg:py-24',
  dark: 'py-16 md:py-20 lg:py-24',
  accent: 'py-16 md:py-20 lg:py-24',
};

export function Section({ children, className, variant = 'default', id }: SectionProps) {
  return (
    <section id={id} className={cn(sectionSpacing[variant], variantStyles[variant], className)}>
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({ title, subtitle, align = 'center', className }: SectionHeaderProps) {
  return (
    <div className={cn(
      'max-w-3xl mb-12 md:mb-16',
      align === 'center' && 'mx-auto text-center',
      className
    )}>
      <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 text-balance tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg md:text-xl text-text-secondary leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
