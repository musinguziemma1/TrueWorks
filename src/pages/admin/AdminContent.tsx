import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Edit, Trash2, Search, Eye, Globe, Layout } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

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
