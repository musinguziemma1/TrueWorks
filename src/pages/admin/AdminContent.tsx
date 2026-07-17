import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Edit, Trash2, Search, Eye, Globe, Layout, Store, BookOpen, ShieldCheck, Sparkles, CheckCircle, LayoutDashboard } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const layouts = [
  {
    id: 'original' as const,
    label: 'Original',
    icon: LayoutDashboard,
    description: 'The original homepage: full hero carousel, badge bar, trusted by, featured products, industries, testimonials, stats, and CTA sections.',
    color: 'from-slate-600 to-slate-700',
  },
  {
    id: 'showroom' as const,
    label: 'Showroom',
    icon: Store,
    description: 'Product-first layout with compact hero, category grid, and stacked sections. Best for driving sales.',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'editorial' as const,
    label: 'Editorial',
    icon: BookOpen,
    description: 'Narrative-driven layout with storytelling flow, case study, and "why now" closing. Best for brand building.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'trust' as const,
    label: 'Trust & Authority',
    icon: ShieldCheck,
    description: 'Credibility-first layout with prominent testimonials, stats wall, and trust markers. Best for conversions.',
    color: 'from-purple-500 to-violet-600',
  },
];

const sections = [
  { id: 'hero', label: 'Hero Section', type: 'Homepage Hero', status: 'published', lastEdited: '2 days ago' },
  { id: 'about', label: 'About Page', type: 'Page Content', status: 'published', lastEdited: '1 week ago' },
  { id: 'resources', label: 'Resources Page', type: 'Page Content', status: 'published', lastEdited: '3 days ago' },
  { id: 'faq', label: 'FAQ Page', type: 'Page Content', status: 'draft', lastEdited: '2 weeks ago' },
  { id: 'announcement', label: 'Announcement Bar', type: 'Banner', status: 'draft', lastEdited: 'Never' },
  { id: 'newsletter', label: 'Newsletter Popup', type: 'Popup', status: 'published', lastEdited: '5 days ago' },
];

export function AdminContent() {
  const [query, setQuery] = useState('');
  const currentLayout = useQuery(api.settings.getHomeLayout);
  const updateLayout = useMutation(api.settings.updateHomeLayout);
  const [saving, setSaving] = useState(false);

  const handleSelectLayout = async (id: 'original' | 'showroom' | 'editorial' | 'trust') => {
    setSaving(true);
    try {
      await updateLayout({ layout: id });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Content</h1>
          <p className="text-sm text-text-muted">Manage website content and pages</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm"><Globe className="w-4 h-4" /> View Site</Button>
          <Button size="sm"><Plus className="w-4 h-4" /> New Page</Button>
        </div>
      </div>

      {/* Home Page Layout Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 rounded-xl border border-border bg-white"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Layout className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-primary">Home Page Layout</h2>
            <p className="text-sm text-text-muted">Choose how your homepage appears to visitors</p>
          </div>
          {currentLayout && (
            <Badge variant="success" className="ml-auto">
              <Sparkles className="w-3 h-3" />
              Active: {layouts.find(l => l.id === currentLayout)?.label ?? currentLayout}
            </Badge>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {layouts.map((layout) => {
            const active = currentLayout === layout.id;
            return (
              <motion.button
                key={layout.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectLayout(layout.id)}
                disabled={saving}
                className={`relative text-left p-5 rounded-xl border-2 transition-all ${
                  active
                    ? 'border-accent bg-accent/[0.04] shadow-sm'
                    : 'border-border bg-section/50 hover:border-accent/40'
                }`}
              >
                {active && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${layout.color} flex items-center justify-center`}>
                  <layout.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-bold text-primary text-sm mb-1">{layout.label}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{layout.description}</p>
                {active && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs font-semibold text-accent mt-3 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Currently active
                  </motion.p>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {sections.filter(s => s.label.toLowerCase().includes(query.toLowerCase())).map((section, idx) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="p-4 rounded-lg border border-border bg-white hover:shadow-card transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center">
                  {section.id === 'hero' ? <Layout className="w-5 h-5 text-primary" /> : <FileText className="w-5 h-5 text-primary" />}
                </div>
                <div>
                  <p className="font-semibold text-primary">{section.label}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-text-muted">{section.type}</span>
                    <span className="text-xs text-text-muted">·</span>
                    <span className="text-xs text-text-muted">Edited {section.lastEdited}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={section.status === 'published' ? 'success' : 'warning'}>{section.status}</Badge>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded hover:bg-section"><Eye className="w-4 h-4 text-text-muted" /></button>
                  <button className="p-1.5 rounded hover:bg-section"><Edit className="w-4 h-4 text-text-muted" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-lg border border-border bg-white">
            <h3 className="font-heading font-bold text-primary text-sm mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" fullWidth>Edit Homepage Hero</Button>
              <Button variant="outline" size="sm" fullWidth>Update Navigation</Button>
              <Button variant="outline" size="sm" fullWidth>Manage Footer</Button>
              <Button variant="outline" size="sm" fullWidth>SEO Settings</Button>
            </div>
          </div>

          <div className="p-5 rounded-lg border border-border bg-white">
            <h3 className="font-heading font-bold text-primary text-sm mb-3">Page Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Published</span>
                <span className="font-semibold text-success">4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Drafts</span>
                <span className="font-semibold text-warning">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Total Pages</span>
                <span className="font-semibold">6</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
