import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Star, Quote, HeartPulse, Building2, TrendingUp, HandHeart, GraduationCap, Church, CheckCircle, Award, BadgeCheck } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '../ui/Button';
import { Section, SectionHeader } from '../ui/Section';
import { ProductCard } from '../ui/ProductCard';
import { StatCard } from '../ui/StatCard';
import { useCartStore } from '../../lib/store';
import type { Product } from '../../lib/types';

const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } } };
const fadeIn = { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: 'easeOut' as const } } };

const partners = [
  'Healthcare Facilities', 'NGOs', 'Financial Institutions', 'Educational Institutions',
  'Religious Organizations', 'SMEs', 'Government Agencies', 'International Organizations',
];

const featuredTestimonials = [
  { quote: 'TrueWorks transformed our budgeting process. What used to take two weeks now takes one hour. The board templates alone saved us an entire month of work.', author: 'Sarah K.', role: 'CFO', org: 'East Africa Healthcare Network' },
  { quote: 'We evaluated five consulting firms before finding TrueWorks. The quality is identical to a USD 30,000 deliverable — at a fraction of the cost.', author: 'James M.', role: 'Executive Director', org: 'NGO Consortium' },
  { quote: 'The financial models are incredibly well-built. Driver-based, formula-audited, and board-ready out of the box. This is what we should have been using all along.', author: 'Dr. Grace W.', role: 'Finance Lead', org: 'Regional Education Board' },
];

const stats = [
  { value: '45+', label: 'Premium Templates', sub: 'Across 6 industries' },
  { value: '50+', label: 'Active Organizations', sub: 'Across East Africa' },
  { value: '98%', label: 'Cost Savings', sub: 'Vs. traditional consulting' },
  { value: '1,200+', label: 'Downloads', sub: 'And counting' },
];

export function LayoutTrust() {
  const { addItem } = useCartStore();
  const featuredProducts = useQuery(api.products.getFeatured, { limit: 4 });

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-linear-to-br from-[#060D1A] via-[#0B1A35] to-primary">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(74,111,165,0.08),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-24 md:py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/7 border border-white/8 mb-6">
                <BadgeCheck className="w-4 h-4 text-accent" />
                <span className="text-sm text-white/70 font-medium">Trusted by 50+ organizations</span>
              </motion.div>
              <motion.h1 variants={fadeUp} className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight text-balance">
                The institution-grade templates<br />
                <span className="text-accent">East Africa trusts.</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg md:text-xl text-white/60 leading-relaxed mb-8 max-w-lg">
                Professional Excel models, dashboards, and business systems built by finance experts. Used by hospitals, NGOs, schools, and growing businesses.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                <Link to="/store">
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Button variant="accent" size="xl">Browse Templates <ArrowRight className="w-5 h-5" /></Button>
                  </motion.div>
                </Link>
                <Link to="/store">
                  <Button variant="outline" size="xl" className="border-white/20 text-white hover:bg-white/10">
                    <Award className="w-5 h-5" /> See What&rsquo;s Included
                  </Button>
                </Link>
              </motion.div>

              {/* Trust bar */}
              <motion.div variants={fadeUp} className="mt-12 pt-8 border-t border-white/8">
                <p className="text-xs text-white/30 uppercase tracking-widest mb-4">Trusted by professionals at</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {partners.map(p => (
                    <span key={p} className="text-sm text-white/40 hover:text-white/60 transition-colors">{p}</span>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:grid grid-cols-2 gap-4"
            >
              {featuredTestimonials.slice(0, 2).map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`p-6 rounded-xl bg-white/4 border border-white/8 backdrop-blur-sm ${i === 0 ? 'col-span-2' : ''}`}
                >
                  <Quote className="w-6 h-6 text-accent/40 mb-3" />
                  <p className="text-white/70 text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">{t.author.charAt(0)}</div>
                    <div>
                      <p className="text-white text-sm font-semibold">{t.author}</p>
                      <p className="text-white/40 text-xs">{t.role}, {t.org}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Wall */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }}>
        <Section variant="section">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(s => (
              <motion.div key={s.label} variants={fadeIn} className="text-center p-6 rounded-xl bg-white border border-border hover:shadow-card transition-shadow">
                <p className="font-heading text-4xl md:text-5xl font-bold text-accent mb-1">{s.value}</p>
                <p className="font-semibold text-primary text-sm">{s.label}</p>
                <p className="text-xs text-text-muted mt-1">{s.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </Section>
      </motion.section>

      {/* Featured Testimonials */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }}>
        <Section>
          <SectionHeader title="What Our Clients Say" subtitle="Organizations that trust TrueWorks for their financial systems." />
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-6">
            {featuredTestimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp} className="p-6 rounded-xl bg-white border border-border hover:shadow-card-hover transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 text-accent" fill="currentColor" />)}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-3 border-t border-border">
                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-accent to-accent/60 flex items-center justify-center text-white font-bold text-xs">{t.author.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-semibold text-primary">{t.author}</p>
                    <p className="text-xs text-text-muted">{t.role}, {t.org}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Section>
      </motion.section>

      {/* Trusted Solutions */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }}>
        <Section variant="section">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionHeader title="Trusted Solutions" subtitle="Professional templates backed by domain expertise." />
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
            <Link to="/store"><Button variant="outline" size="lg">View All <ArrowRight className="w-5 h-5" /></Button></Link>
          </motion.div>
        </Section>
      </motion.section>

      {/* Guarantee */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }}>
        <Section>
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-accent" />
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-4 text-balance">Built by professionals. Backed by results.</h2>
              <p className="text-text-secondary leading-relaxed mb-6 max-w-xl mx-auto">
                Every TrueWorks template is formula-audited, driver-based, and board-finished. We build the same quality as top-tier consulting firms — and deliver it at a fraction of the cost.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                {['Formula-audited', 'Driver-based', 'Board-finished', 'Instant download'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-primary">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    {f}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </Section>
      </motion.section>

      {/* CTA */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }}>
        <Section variant="dark" className="text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4 text-balance">Join 50+ organizations building better.</h2>
            <p className="text-white/60 text-lg mb-8 max-w-lg mx-auto">No consulting engagement needed. Your templates are ready now.</p>
            <Link to="/store">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button variant="accent" size="xl">Get Started Today <ArrowRight className="w-5 h-5" /></Button>
              </motion.div>
            </Link>
          </motion.div>
        </Section>
      </motion.section>
    </div>
  );
}
