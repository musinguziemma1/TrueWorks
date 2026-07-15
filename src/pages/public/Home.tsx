import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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

export function Home() {
  const { addItem } = useCartStore();
  const [freeName, setFreeName] = useState('');
  const [email, setEmail] = useState('');
  const featuredProducts = useQuery(api.products.getFeatured, { limit: 4 });
  const testimonials = useQuery(api.reviews.list, { approved: true, featured: true, limit: 3 });
  const reviewStats = useQuery(api.reviews.getStats);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-primary via-primary-light to-[#0A1E3D] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(74,111,165,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,162,39,0.08),transparent_50%)]" />
        <div className="absolute top-20 left-10 w-72 h-72 border border-white/5 rounded-full" />
        <div className="absolute bottom-20 right-10 w-96 h-96 border border-white/5 rounded-full" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-16 md:pt-32 md:pb-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 mb-6">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-sm text-white/80 font-medium">Trusted by 50+ organizations</span>
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight text-balance">
                Building Better{' '}
                <span className="text-accent">Organizations</span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8 max-w-xl">
                Premium Excel templates, financial models, dashboards and business systems built for hospitals, NGOs, churches, schools and growing businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/store">
                  <Button variant="accent" size="lg">
                    Browse Store
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                  <Download className="w-5 h-5" />
                  Free Template
                </Button>
              </div>
              <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/10">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary border-2 border-primary flex items-center justify-center text-[10px] text-white font-bold">
                      U{i}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-white/50">Join <span className="text-white font-semibold">50+</span> organizations already building better</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-[4/3] rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-transparent" />
                <div className="absolute inset-4 rounded-xl bg-white/10 border border-white/10 overflow-hidden">
                  <div className="h-8 bg-white/10 flex items-center px-3 gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <div className="ml-4 flex gap-1">
                      <div className="w-16 h-2 rounded bg-white/10" />
                      <div className="w-12 h-2 rounded bg-white/10" />
                    </div>
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex gap-2">
                      <div className="flex-1 space-y-2">
                        <div className="h-4 rounded bg-accent/20 w-3/4" />
                        <div className="h-3 rounded bg-white/10 w-1/2" />
                        <div className="grid grid-cols-3 gap-2 mt-4">
                          {[45, 92, 78].map((v, i) => (
                            <div key={i} className="p-2 rounded bg-white/5">
                              <div className="h-6 font-heading font-bold text-accent text-sm">{v}%</div>
                              <div className="h-2 rounded bg-white/10 mt-1" />
                            </div>
                          ))}
                        </div>
                        <div className="h-20 rounded bg-white/5 mt-2" />
                      </div>
                      <div className="w-24 space-y-2">
                        <div className="h-3 rounded bg-white/10" />
                        <div className="h-3 rounded bg-white/10" />
                        <div className="h-3 rounded bg-white/10" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-20 rounded-lg bg-accent/20 border border-accent/30 backdrop-blur-sm p-3">
                  <div className="text-accent font-heading font-bold text-lg">+45%</div>
                  <div className="text-white/60 text-[10px]">Efficiency Gain</div>
                </div>
                <div className="absolute -top-4 -left-4 w-28 h-16 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm p-3">
                  <div className="text-white font-heading font-bold text-sm">98%</div>
                  <div className="text-white/60 text-[10px]">Accuracy</div>
                </div>
              </div>
            </motion.div>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <TestimonialCard
                key={t._id}
                name={t.customerName}
                role="Customer"
                company="TrueWorks"
                quote={t.content}
                rating={t.rating}
              />
            ))}
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
