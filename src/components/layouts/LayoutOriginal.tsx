import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Download, ShieldCheck, Zap, Building2, HeartPulse,
  TrendingUp, HandHeart, GraduationCap, Church,
  CheckCircle, FileText
} from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Section, SectionHeader } from '../../components/ui/Section';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ProductCard } from '../../components/ui/ProductCard';
import { FeatureCard } from '../../components/ui/FeatureCard';
import { IndustryCard } from '../../components/ui/IndustryCard';
import { TestimonialCard } from '../../components/ui/TestimonialCard';
import { StatCard } from '../../components/ui/StatCard';
import { industries } from '../../lib/data';
import { useCartStore } from '../../lib/store';
import type { Product } from '../../lib/types';

const trustedIndustries = [
  { name: 'Hospitals', icon: HeartPulse },
  { name: 'NGOs', icon: HandHeart },
  { name: 'Finance Teams', icon: TrendingUp },
  { name: 'Schools', icon: GraduationCap },
  { name: 'Churches', icon: Church },
  { name: 'SMEs', icon: Building2 },
];

const features = [
  {
    icon: Download,
    title: 'Instant Download',
    description: 'Access your templates immediately after purchase. No shipping, no waiting. Start building better organizations right away.',
  },
  {
    icon: ShieldCheck,
    title: 'Built by Professionals',
    description: 'Every template is designed by finance and business experts with years of industry experience across East Africa.',
  },
  {
    icon: Zap,
    title: 'Secure Payments',
    description: 'Pay securely with MTN Mobile Money, Airtel Money, Visa, or Mastercard. Your transaction is protected.',
  },
];

const showcaseProducts = [
  { name: 'Hospital KPI Dashboard', metrics: ['Bed Occupancy', 'Revenue/Bed', 'Patient Satisfaction', 'Staff Efficiency'], color: 'from-blue-500 to-indigo-600' },
  { name: 'Financial Model Toolkit', metrics: ['DCF Valuation', 'Sensitivity Analysis', '3-Statement Model', 'Scenario Planning'], color: 'from-emerald-500 to-teal-600' },
  { name: 'NGO Grant System', metrics: ['Donor Tracking', 'Budget vs Actual', 'Compliance Reports', 'Grant Pipeline'], color: 'from-purple-500 to-violet-600' },
];

const heroSlides = [
  {
    badge: 'Premium institutional templates',
    title: (
      <>
        The workbook your board{' '}
        <em className="text-accent not-italic" style={{ fontStyle: 'italic' }}>thinks</em>{' '}
        you paid a firm to build.
      </>
    ),
    description: 'Institution-grade Excel templates, financial models, dashboards and business systems. Built for hospitals, NGOs, churches, schools and growing businesses across East Africa.',
    cta: 'Explore collections',
    visual: 'table' as const,
  },
  {
    badge: 'Healthcare analytics suite',
    title: 'Hospital dashboards that give you real-time control.',
    description: 'Track bed occupancy, revenue per bed, patient satisfaction, and staff productivity ÔÇö all from one Excel dashboard built for Ugandan healthcare facilities.',
    cta: 'View hospital templates',
    visual: 'healthcare' as const,
  },
  {
    badge: 'Non-profit financial tools',
    title: 'Grant management systems donors trust.',
    description: 'Track multiple grants, manage donor relationships, and generate USAID/EU/UN compliance reports without expensive ERP software.',
    cta: 'Explore NGO solutions',
    visual: 'ngo' as const,
  },
  {
    badge: 'Built for growing businesses',
    title: 'Financial models that scale with your SME.',
    description: 'Professional budgeting, forecasting, cash flow management, and HR systems purpose-built for East African businesses.',
    cta: 'Browse business templates',
    visual: 'business' as const,
  },
];

export function LayoutOriginal() {
  const { addItem } = useCartStore();
  const [freeName, setFreeName] = useState('');
  const [email, setEmail] = useState('');
  const [slide, setSlide] = useState(0);
  const featuredProducts = useQuery(api.products.getFeatured, { limit: 4 });
  const testimonials = useQuery(api.reviews.list, { approved: true, featured: true, limit: 3 });
  const reviewStats = useQuery(api.reviews.getStats);

  const nextSlide = useCallback(() => setSlide(p => (p + 1) % heroSlides.length), []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 15000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #060D1A 0%, #0B1A35 35%, #0F2244 65%, #0B2545 100%)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(74,111,165,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,162,39,0.06),transparent_50%)]" />
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 border border-white/[0.04] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 border border-white/[0.04] rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-48 h-48 border border-accent/[0.03] rounded-full"
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{ rotate: { duration: 30, repeat: Infinity, ease: 'linear' }, scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
        />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-16 md:pt-32 md:pb-20 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
            >
              <div>
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.07] border border-white/[0.08] mb-6"
                  animate={{ borderColor: ['rgba(255,255,255,0.08)', 'rgba(201,162,39,0.3)', 'rgba(255,255,255,0.08)'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <motion.span
                    className="w-2 h-2 rounded-full bg-accent"
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <span className="text-sm text-white/70 font-medium">{heroSlides[slide].badge}</span>
                </motion.div>
                <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight text-balance">
                  {heroSlides[slide].title}
                </h1>
                <p className="text-lg md:text-xl text-white/60 leading-relaxed mb-8 max-w-xl">
                  {heroSlides[slide].description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/store">
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button variant="accent" size="lg">
                        {heroSlides[slide].cta}
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to="/store">
                    <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                      Browse all templates
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative hidden lg:block">
                {heroSlides[slide].visual === 'table' && (
                  <motion.div
                    className="rounded-xl bg-white/[0.04] border border-white/[0.08] overflow-hidden backdrop-blur-sm"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="px-5 py-3 border-b border-white/[0.08] flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <div className="w-2 h-2 rounded-full bg-yellow-400" />
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="ml-3 text-xs text-white/40 font-medium">FY 2025 / 26</span>
                    </div>
                    <div className="p-0">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/[0.08]">
                            <th className="text-left px-5 py-3 text-white/50 font-medium text-xs uppercase tracking-wider">Service Line</th>
                            <th className="text-right px-5 py-3 text-white/50 font-medium text-xs uppercase tracking-wider">Revenue</th>
                            <th className="text-right px-5 py-3 text-white/50 font-medium text-xs uppercase tracking-wider">Margin</th>
                            <th className="text-center px-5 py-3 text-white/50 font-medium text-xs uppercase tracking-wider">RAG</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { name: 'Advisory', revenue: '4,250,000', margin: '72%', rag: 'green' },
                            { name: 'Templates', revenue: '2,800,000', margin: '85%', rag: 'green' },
                            { name: 'Training', revenue: '1,600,000', margin: '58%', rag: 'amber' },
                            { name: 'Retainers', revenue: '3,100,000', margin: '64%', rag: 'green' },
                            { name: 'Custom Builds', revenue: '5,400,000', margin: '51%', rag: 'amber' },
                          ].map((row, i) => (
                            <motion.tr
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
                              className="border-b border-white/[0.05] hover:bg-white/[0.05] transition-colors"
                            >
                              <td className="px-5 py-3 text-white/80 font-medium">{row.name}</td>
                              <td className="px-5 py-3 text-white/60 text-right font-mono">UGX {row.revenue}</td>
                              <td className="px-5 py-3 text-white/60 text-right font-mono">{row.margin}</td>
                              <td className="px-5 py-3 text-center">
                                <motion.span
                                  className="inline-block w-2.5 h-2.5 rounded-full"
                                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                                  transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                                  style={{ backgroundColor: row.rag === 'green' ? '#34d399' : row.rag === 'amber' ? '#fbbf24' : '#f87171' }}
                                />
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t border-white/[0.1]">
                            <td className="px-5 py-3 text-white font-semibold">Total</td>
                            <td className="px-5 py-3 text-accent text-right font-mono font-semibold">UGX 17,150,000</td>
                            <td className="px-5 py-3 text-white/60 text-right font-mono">65%</td>
                            <td />
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </motion.div>
                )}
                {heroSlides[slide].visual === 'healthcare' && (
                  <motion.div
                    className="rounded-xl bg-white/[0.04] border border-white/[0.08] overflow-hidden backdrop-blur-sm p-6"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <HeartPulse className="w-8 h-8 text-accent" />
                      <span className="text-white/50 text-xs uppercase tracking-wider font-semibold">Live KPI Dashboard</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: 'Bed Occupancy', value: '78%', change: '+5%', up: true },
                        { label: 'Revenue per Bed', value: 'UGX 840K', change: '+12%', up: true },
                        { label: 'Patient Satisfaction', value: '92%', change: '+3%', up: true },
                        { label: 'Staff Efficiency', value: '86%', change: '-2%', up: false },
                      ].map((metric, i) => (
                        <motion.div
                          key={metric.label}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + i * 0.08 }}
                          className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0"
                        >
                          <span className="text-white/70 text-sm">{metric.label}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-white font-semibold font-mono text-sm">{metric.value}</span>
                            <span className={`text-xs font-medium ${metric.up ? 'text-emerald-400' : 'text-red-400'}`}>{metric.change}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {heroSlides[slide].visual === 'ngo' && (
                  <motion.div
                    className="rounded-xl bg-white/[0.04] border border-white/[0.08] overflow-hidden backdrop-blur-sm p-6"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <HandHeart className="w-8 h-8 text-accent" />
                      <span className="text-white/50 text-xs uppercase tracking-wider font-semibold">Grant Overview</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {[
                        { label: 'Active Grants', value: '12' },
                        { label: 'Total Funding', value: 'UGX 4.2B' },
                        { label: 'Compliance Rate', value: '96%' },
                        { label: 'Disbursed', value: 'UGX 3.1B' },
                      ].map((stat, i) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.08 }}
                          className="p-3 rounded-lg bg-white/[0.06]"
                        >
                          <p className="text-white/50 text-xs">{stat.label}</p>
                          <p className="text-white font-bold font-heading text-lg">{stat.value}</p>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      Next reporting deadline: 15 Aug 2026
                    </div>
                  </motion.div>
                )}
                {heroSlides[slide].visual === 'business' && (
                  <motion.div
                    className="rounded-xl bg-white/[0.04] border border-white/[0.08] overflow-hidden backdrop-blur-sm p-6"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <Building2 className="w-8 h-8 text-accent" />
                      <span className="text-white/50 text-xs uppercase tracking-wider font-semibold">Financial Snapshot</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: 'Revenue (YTD)', value: 'UGX 286M' },
                        { label: 'Gross Margin', value: '64%' },
                        { label: 'Cash on Hand', value: 'UGX 42M' },
                        { label: 'Budget Utilization', value: '73%' },
                      ].map((fin, i) => (
                        <motion.div
                          key={fin.label}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 + i * 0.08 }}
                          className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0"
                        >
                          <span className="text-white/70 text-sm">{fin.label}</span>
                          <span className="text-white font-semibold font-mono text-sm">{fin.value}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  i === slide ? 'bg-accent w-6' : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Feature Badges Banner */}
      <section className="bg-[#0A1529] border-b border-white/[0.06] overflow-hidden relative">
        <motion.div
          className="absolute inset-0 w-full h-full"
          animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(201,162,39,0.04) 50%, transparent 100%)', backgroundSize: '200% 100%' }}
        />
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/[0.08]">
            {[
              'Formula-audited',
              'Driver-based',
              'Board-finished',
              'Yours outright',
            ].map((badge, i) => (
              <motion.div
                key={badge}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-center gap-2.5 py-4 md:py-5"
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, delay: i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                </motion.div>
                <span className="text-sm text-white/70 font-medium">{badge}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <Section variant="section">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-text-muted uppercase tracking-widest">Trusted by Professional Organizations</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6 md:gap-8">
          {trustedIndustries.map((industry) => (
            <div key={industry.name} className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-white transition-colors">
              <industry.icon className="w-8 h-8 text-text-muted/60" />
              <span className="text-xs font-medium text-text-muted text-center">{industry.name}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Featured Products */}
      <Section>
        <SectionHeader
          title="Premium Templates for Every Need"
          subtitle="Professional business systems designed for organizations that demand excellence."
        />
        {featuredProducts === undefined ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse rounded-lg border border-border bg-white overflow-hidden">
                <div className="aspect-[4/3] bg-section" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-section rounded w-1/3" />
                  <div className="h-5 bg-section rounded w-3/4" />
                  <div className="h-3 bg-section rounded w-full" />
                  <div className="h-6 bg-section rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product as unknown as Product} onAddToCart={addItem} />
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link to="/store">
            <Button variant="outline" size="lg">
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </Section>

      {/* Shop by Industry */}
      <Section variant="section">
        <SectionHeader
          title="Solutions for Your Industry"
          subtitle="Purpose-built templates for every sector, designed with domain expertise."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {industries.map((industry) => (
            <IndustryCard key={industry.id} industry={industry} />
          ))}
        </div>
      </Section>

      {/* Why TrueWorks */}
      <Section>
        <SectionHeader
          title="Why Organizations Choose TrueWorks"
          subtitle="Professional business systems built by experts who understand your challenges."
        />
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </Section>

      {/* Product Showcase */}
      <Section variant="section">
        <SectionHeader
          title="See Your Data Come Alive"
          subtitle="Interactive dashboards and financial models that give you real-time visibility into your organization."
        />
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
            {showcaseProducts.map((showcase, idx) => (
              <motion.div
                key={showcase.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex-shrink-0 w-[350px] md:w-[450px] rounded-xl border border-border bg-white overflow-hidden hover:shadow-card-hover transition-shadow"
              >
                <div className={`h-48 bg-gradient-to-br ${showcase.color} p-6 flex flex-col justify-end`}>
                  <h3 className="font-heading text-xl font-bold text-white">{showcase.name}</h3>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-3">
                    {showcase.metrics.map((metric) => (
                      <div key={metric} className="flex items-center gap-2 text-sm text-text-secondary">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                        {metric}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section>
        <SectionHeader
          title="Trusted by Business Leaders"
          subtitle="Hear from organizations that have transformed their operations with TrueWorks."
        />
        <div className="text-center mb-6">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-widest">[PLACEHOLDER - replace with real testimonials at launch]</p>
        </div>
        {testimonials === undefined ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse p-8 rounded-lg border border-border bg-white">
                <div className="h-4 bg-section rounded w-1/4 mb-4" />
                <div className="h-3 bg-section rounded w-full mb-2" />
                <div className="h-3 bg-section rounded w-3/4 mb-6" />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-section" />
                  <div className="space-y-2">
                    <div className="h-4 bg-section rounded w-24" />
                    <div className="h-3 bg-section rounded w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              {[...testimonials, ...testimonials].map((t, i) => (
                <div key={`${t._id}-${i}`} className="flex-shrink-0 w-[350px]">
                  <TestimonialCard
                    name={t.customerName}
                    role="Customer"
                    company="TrueWorks"
                    quote={t.content}
                    rating={t.rating}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </Section>

      {/* Stats */}
      <Section variant="section">
        <div className="text-center mb-6">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-widest">[PLACEHOLDER - replace with real numbers at launch]</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard label="Templates Available" value="45+" />
          <StatCard label="Active Organizations" value="50+" />
          <StatCard label="Downloads" value="1,200+" />
          <StatCard label="Customer Satisfaction" value="98%" />
        </div>
      </Section>

      {/* Free Resource */}
      <Section variant="dark">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm mb-4">
              <FileText className="w-4 h-4" />
              Free Resource
            </div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
              Get a Free Hospital KPI Dashboard
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-6">
              Download our premium Hospital KPI Dashboard template for free. Track 20+ essential healthcare metrics and start making data-driven decisions today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
              <Input
                placeholder="Your name"
                value={freeName}
                onChange={(e) => setFreeName(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
              <Input
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
              <Button variant="accent">
                Download Free
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-white/40 text-sm mt-3">No credit card required. Instant download.</p>
          </div>
          <div className="hidden md:block relative">
            <div className="aspect-[4/3] rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
              <div className="absolute inset-4 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center">
                <FileText className="w-16 h-16 text-accent/40" />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section className="text-center">
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 text-balance">
          Ready to improve your organization?
        </h2>
        <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
          Join 50+ organizations already building better with TrueWorks premium business systems.
        </p>
        <Link to="/store">
          <Button variant="primary" size="xl">
            Browse Premium Templates
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </Section>
    </div>
  );
}
