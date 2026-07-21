import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, FileSpreadsheet, BarChart3, Users, Lightbulb, TrendingUp, ShieldCheck, Play, BookOpen } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '../ui/Button';
import { Section, SectionHeader } from '../ui/Section';
import { ProductCard } from '../ui/ProductCard';
import { useCartStore } from '../../lib/store';
import type { Product } from '../../lib/types';

const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } } };
const fadeIn = { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: 'easeOut' as const } } };

const steps = [
  { icon: FileSpreadsheet, title: 'Choose Your Template', description: 'Browse our library of institution-grade Excel models, dashboards, and business systems purpose-built for East Africa.', color: 'from-blue-500 to-indigo-600' },
  { icon: BarChart3, title: 'Customize for Your Needs', description: 'Every template is fully driver-based — adjust assumptions, inputs, and parameters to match your organization.', color: 'from-emerald-500 to-teal-600' },
  { icon: Users, title: 'Deploy Across Your Team', description: 'Board-finished outputs. Share with stakeholders immediately. No consulting firm required.', color: 'from-purple-500 to-violet-600' },
];

const testimonial = {
  quote: 'We were about to spend USD 18,000 on a consulting firm for our budgeting system. TrueWorks delivered a better product for less than 2% of that cost. Our board was impressed.',
  author: 'Finance Director',
  org: 'Regional Healthcare Network',
  metric: '98% cost savings',
};

export function LayoutEditorial() {
  const { addItem } = useCartStore();
  const featuredProducts = useQuery(api.products.getFeatured, { limit: 4 });

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-linear-to-br from-[#060D1A] via-[#0B1A35] to-[#0F2244]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.06),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-24 md:py-32 w-full">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto text-center">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/7 border border-white/8 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-sm text-white/70 font-medium">The workshop your board thinks you paid a firm for</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight text-balance">
              Institution-grade business systems,<br />
              <span className="text-accent">without the institution price.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-white/60 leading-relaxed mb-10 max-w-2xl mx-auto">
              TrueWorks builds the same Excel models, dashboards, and reporting systems that consulting firms charge millions for — and sells them as ready-to-use templates.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
              <Link to="/store">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="accent" size="xl">Explore Templates <ArrowRight className="w-5 h-5" /></Button>
                </motion.div>
              </Link>
              <Link to="/resources">
                <Button variant="outline" size="xl" className="border-white/20 text-white hover:bg-white/10">
                  <BookOpen className="w-5 h-5" /> Read Our Guide
                </Button>
              </Link>
            </motion.div>

            {/* Trust markers */}
            <motion.div variants={fadeUp} className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
              {[
                { label: 'Templates', value: '45+' },
                { label: 'Organizations', value: '50+' },
                { label: 'Avg. Savings', value: '98%' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-2xl md:text-3xl font-heading font-bold text-white">{s.value}</p>
                  <p className="text-xs text-white/40 mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }}>
        <Section>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionHeader title="How TrueWorks Works" subtitle="Three steps to better financial management." />
          </motion.div>
          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-px bg-linear-to-r from-transparent via-accent/30 to-transparent -translate-y-1/2" />
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-8 md:gap-12">
              {steps.map((step, i) => (
                <motion.div key={step.title} variants={fadeUp} className="relative text-center">
                  <div className={`w-16 h-16 mx-auto mb-5 rounded-2xl bg-linear-to-br ${step.color} flex items-center justify-center relative`}>
                    <step.icon className="w-7 h-7 text-white" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-primary mb-2">{step.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Section>
      </motion.section>

      {/* Case Study */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }}>
        <Section variant="section">
          <div className="grid lg:grid-cols-5 gap-10 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-4">
                <TrendingUp className="w-3 h-3" /> Real Results
              </div>
              <blockquote className="font-heading text-xl md:text-2xl text-primary leading-relaxed mb-6 text-balance italic">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-accent to-accent/60 flex items-center justify-center text-white font-bold text-lg">&rdquo;</div>
                <div>
                  <p className="font-semibold text-primary text-sm">{testimonial.author}</p>
                  <p className="text-xs text-text-muted">{testimonial.org}</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10 border border-success/20">
                <ShieldCheck className="w-4 h-4 text-success" />
                <span className="text-sm font-semibold text-success">{testimonial.metric}</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 grid grid-cols-2 gap-4"
            >
              {[
                { label: 'Consulting Cost', value: 'USD 18,000', negative: true },
                { label: 'TrueWorks Cost', value: 'USD 299', negative: false },
                { label: 'Time to Deploy', value: '15 minutes', negative: false },
                { label: 'Board Approval', value: 'Day 1', negative: false },
              ].map(item => (
                <div key={item.label} className="p-4 rounded-lg bg-white border border-border">
                  <p className="text-xs text-text-muted mb-1">{item.label}</p>
                  <p className={`font-heading font-bold text-lg ${item.negative ? 'text-error' : 'text-success'}`}>
                    {item.negative ? '− ' : ''}{item.value}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </Section>
      </motion.section>

      {/* Our Solutions */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }}>
        <Section>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionHeader title="Our Solutions" subtitle="Professional business systems for every department." />
          </motion.div>
          {featuredProducts === undefined ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="animate-pulse rounded-lg border border-border bg-white overflow-hidden"><div className="aspect-4/3 bg-section" /><div className="p-5 space-y-3"><div className="h-4 bg-section rounded w-1/3" /><div className="h-5 bg-section rounded w-3/4" /><div className="h-3 bg-section rounded w-full" /><div className="h-6 bg-section rounded w-1/4" /></div></div>)}
            </div>
          ) : (
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <motion.div key={product._id} variants={fadeIn} whileHover={{ y: -6 }}>
                  <ProductCard product={product as unknown as Product} onAddToCart={addItem} />
                </motion.div>
              ))}
            </motion.div>
          )}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-10">
            <Link to="/store"><Button variant="outline" size="lg">View All Solutions <ArrowRight className="w-5 h-5" /></Button></Link>
          </motion.div>
        </Section>
      </motion.section>

      {/* Why Now */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }}>
        <Section variant="dark">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm mb-4">
                <Lightbulb className="w-4 h-4" /> Why Now
              </motion.div>
              <motion.h2 variants={fadeUp} className="font-heading text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
                The era of expensive financial consulting is over.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-white/70 leading-relaxed mb-6">
                Organizations across East Africa are discovering that the same Excel models used by top-tier consulting firms are available as ready-to-use templates. No engagement letter. No junior associate learning on your dime. Just professional-grade financial systems, delivered instantly.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <Link to="/store"><Button variant="accent" size="lg">Start Building <ArrowRight className="w-4 h-4" /></Button></Link>
                <Link to="/about"><Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">Learn Our Story</Button></Link>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="hidden md:block"
            >
              <div className="aspect-square rounded-2xl bg-linear-to-br from-accent/20 via-white/5 to-transparent border border-white/10 p-8 flex flex-col justify-center">
                <p className="text-7xl font-heading font-bold text-white mb-2">98%</p>
                <p className="text-white/50 text-lg">average cost savings<br />vs. traditional consulting</p>
                <div className="mt-6 flex items-center gap-2 text-white/40 text-sm">
                  <Play className="w-4 h-4 text-accent" fill="currentColor" />
                  Based on customer-reported data
                </div>
              </div>
            </motion.div>
          </div>
        </Section>
      </motion.section>

      {/* CTA */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }}>
        <Section className="text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">Build better. Spend less.</h2>
            <p className="text-lg text-text-secondary mb-8 max-w-xl mx-auto">Your first template is 15 minutes away.</p>
            <Link to="/store">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button variant="primary" size="xl">Browse Templates <ArrowRight className="w-5 h-5" /></Button>
              </motion.div>
            </Link>
          </motion.div>
        </Section>
      </motion.section>
    </div>
  );
}
