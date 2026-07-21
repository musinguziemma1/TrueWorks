import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, HeartPulse, TrendingUp, GraduationCap, Church, HandHeart, Star } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '../ui/Button';
import { Section, SectionHeader } from '../ui/Section';
import { ProductCard } from '../ui/ProductCard';
import { StatCard } from '../ui/StatCard';
import { TestimonialCard } from '../ui/TestimonialCard';
import { useCartStore } from '../../lib/store';
import type { Product } from '../../lib/types';

const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } } };

const categories = [
  { name: 'Healthcare', icon: HeartPulse, count: 8, color: 'from-blue-500 to-blue-600' },
  { name: 'Business', icon: Building2, count: 24, color: 'from-emerald-500 to-emerald-600' },
  { name: 'Finance', icon: TrendingUp, count: 15, color: 'from-purple-500 to-purple-600' },
  { name: 'NGO', icon: HandHeart, count: 7, color: 'from-rose-500 to-rose-600' },
  { name: 'Schools', icon: GraduationCap, count: 5, color: 'from-amber-500 to-amber-600' },
  { name: 'Churches', icon: Church, count: 4, color: 'from-indigo-500 to-indigo-600' },
];

const previewProducts = [
  { name: 'Hospital KPI Dashboard', metrics: ['Bed Occupancy', 'Revenue/Bed', 'Patient Satisfaction', 'Staff Efficiency'], color: 'from-blue-500 to-indigo-600' },
  { name: 'Financial Model Toolkit', metrics: ['DCF Valuation', 'Sensitivity Analysis', '3-Statement Model', 'Scenario Planning'], color: 'from-emerald-500 to-teal-600' },
  { name: 'NGO Grant System', metrics: ['Donor Tracking', 'Budget vs Actual', 'Compliance Reports', 'Grant Pipeline'], color: 'from-purple-500 to-violet-600' },
];

export function LayoutShowroom() {
  const { addItem } = useCartStore();
  const featuredProducts = useQuery(api.products.getFeatured, { limit: 4 });
  const testimonials = useQuery(api.reviews.list, { approved: true, featured: true, limit: 3 });

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-linear-to-br from-[#060D1A] via-[#0B1A35] to-primary">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(74,111,165,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(201,162,39,0.06),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-xs text-white/70 font-medium tracking-wide">Premium Template Store</span>
              </motion.div>
              <motion.h1 variants={fadeUp} className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight text-balance">
                Institution-grade Excel templates,
                <br />
                <span className="text-accent">instantly delivered.</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg text-white/60 leading-relaxed mb-8 max-w-lg">
                Financial models, dashboards and business systems built for East African organizations. Download and deploy in minutes.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                <Link to="/store">
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Button variant="accent" size="lg">
                      Browse Templates <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/store">
                  <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                    View All Products
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="hidden lg:flex gap-4"
            >
              {previewProducts.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`flex-1 rounded-xl bg-linear-to-b ${p.color} p-5 flex flex-col justify-end min-h-70 relative overflow-hidden`}
                >
                  <motion.div
                    className="absolute inset-0 opacity-15"
                    style={{ background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)' }}
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <div className="relative z-10">
                    <p className="text-white/80 text-xs font-medium mb-1 uppercase tracking-wide">{p.metrics.length} Metrics</p>
                    <h3 className="text-white font-heading font-bold text-sm">{p.name}</h3>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <Section variant="section">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div variants={fadeUp}><StatCard label="Templates" value="45+" variant="compact" /></motion.div>
            <motion.div variants={fadeUp}><StatCard label="Organizations" value="50+" variant="compact" /></motion.div>
            <motion.div variants={fadeUp}><StatCard label="Downloads" value="1,200+" variant="compact" /></motion.div>
            <motion.div variants={fadeUp}><StatCard label="Satisfaction" value="98%" variant="compact" /></motion.div>
          </motion.div>
        </Section>
      </motion.section>

      {/* Featured Products */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }}>
        <Section>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionHeader title="Featured Templates" subtitle="Our most popular business systems, trusted by organizations across East Africa." />
          </motion.div>
          {featuredProducts === undefined ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="animate-pulse rounded-lg border border-border bg-white overflow-hidden"><div className="aspect-4/3 bg-section" /><div className="p-5 space-y-3"><div className="h-4 bg-section rounded w-1/3" /><div className="h-5 bg-section rounded w-3/4" /><div className="h-3 bg-section rounded w-full" /><div className="h-6 bg-section rounded w-1/4" /></div></div>)}
            </div>
          ) : (
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <motion.div key={product._id} variants={fadeUp} whileHover={{ y: -6 }}>
                  <ProductCard product={product as unknown as Product} onAddToCart={addItem} />
                </motion.div>
              ))}
            </motion.div>
          )}
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-10">
            <Link to="/store"><Button variant="outline" size="lg">View All Products <ArrowRight className="w-5 h-5" /></Button></Link>
          </motion.div>
        </Section>
      </motion.section>

      {/* Shop by Collection */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }}>
        <Section variant="section">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionHeader title="Shop by Collection" subtitle="Purpose-built template packs for every sector." />
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map(cat => (
              <motion.div
                key={cat.name}
                variants={fadeUp}
                whileHover={{ y: -4, scale: 1.03 }}
                className="flex flex-col items-center gap-3 p-5 rounded-xl bg-white border border-border hover:shadow-card transition-all cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${cat.color} flex items-center justify-center`}>
                  <cat.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-primary text-center">{cat.name}</span>
                <span className="text-xs text-text-muted">{cat.count} templates</span>
              </motion.div>
            ))}
          </motion.div>
        </Section>
      </motion.section>

      {/* Showcase */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }}>
        <Section>
          <SectionHeader title="See Your Data Come Alive" subtitle="Interactive dashboards and financial models that give you real-time visibility." />
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
            {previewProducts.map(p => (
              <motion.div
                key={p.name}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                className="shrink-0 w-87.5 md:w-112.5 rounded-xl border border-border bg-white overflow-hidden hover:shadow-card-hover transition-shadow"
              >
                <div className={`h-48 bg-linear-to-br ${p.color} p-6 flex flex-col justify-end relative overflow-hidden`}>
                  <motion.div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)' }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
                  <h3 className="font-heading text-xl font-bold text-white relative z-10">{p.name}</h3>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-3">
                    {p.metrics.map(m => <div key={m} className="flex items-center gap-2 text-sm text-text-secondary"><Star className="w-4 h-4 text-accent shrink-0" />{m}</div>)}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Section>
      </motion.section>

      {/* Testimonials */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }}>
        <Section variant="section">
          <SectionHeader title="Trusted by Business Leaders" subtitle="Hear from organizations using TrueWorks." />
          {testimonials === undefined ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="animate-pulse p-8 rounded-lg border border-border bg-white"><div className="h-4 bg-section rounded w-1/4 mb-4" /><div className="h-3 bg-section rounded w-full mb-2" /><div className="h-3 bg-section rounded w-3/4 mb-6" /><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-section" /><div className="space-y-2"><div className="h-4 bg-section rounded w-24" /><div className="h-3 bg-section rounded w-32" /></div></div></div>)}
            </div>
          ) : (
            <div className="relative overflow-hidden">
              <motion.div className="flex gap-6" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}>
                {[...testimonials, ...testimonials].map((t, i) => (
                  <div key={`${t._id}-${i}`} className="shrink-0 w-87.5">
                    <TestimonialCard name={t.customerName} role="Customer" company="TrueWorks" quote={t.content} rating={t.rating} />
                  </div>
                ))}
              </motion.div>
            </div>
          )}
        </Section>
      </motion.section>

      {/* CTA */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }}>
        <Section className="text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">Ready to get started?</h2>
            <p className="text-lg text-text-secondary mb-8 max-w-xl mx-auto">Join 50+ organizations already building better with TrueWorks.</p>
            <Link to="/store">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button variant="primary" size="xl">Browse Premium Templates <ArrowRight className="w-5 h-5" /></Button>
              </motion.div>
            </Link>
          </motion.div>
        </Section>
      </motion.section>
    </div>
  );
}
