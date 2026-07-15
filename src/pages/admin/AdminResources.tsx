import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, FileText, BookOpen, Download, BarChart3, Eye } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../lib/utils';
import { useState } from 'react';

const typeIcons = { article: BookOpen, guide: FileText, template: Download, case_study: BarChart3 };
const typeColors = { article: 'primary', guide: 'accent', template: 'success', case_study: 'warning' } as const;

export function AdminResources() {
  const [search, setSearch] = useState('');
  const resources = useQuery(api.content.listResources, {});

  if (resources === undefined) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const filtered = resources.filter((r) =>
    !search || r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Resources</h1>
          <p className="text-sm text-text-muted">{resources.length} resources</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text" placeholder="Search resources..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-48 pl-10 pr-4 py-2 rounded-md border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
              aria-label="Search resources"
            />
          </div>
          <Button size="sm"><Plus className="w-4 h-4" /> Add Resource</Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((resource, idx) => {
          const Icon = typeIcons[resource.type] || FileText;
          return (
            <motion.div
              key={resource._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="group relative p-5 rounded-lg border border-border bg-white hover:shadow-card-hover transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded hover:bg-section" aria-label="Edit"><Edit className="w-3.5 h-3.5 text-text-muted" /></button>
                  <button className="p-1.5 rounded hover:bg-section" aria-label="Delete"><Trash2 className="w-3.5 h-3.5 text-text-muted" /></button>
                </div>
              </div>
              <Badge variant={typeColors[resource.type]} size="sm" className="mb-2 capitalize">
                {resource.type.replace('_', ' ')}
              </Badge>
              <h3 className="font-heading font-bold text-primary mb-1">{resource.title}</h3>
              <p className="text-xs text-text-secondary mb-3 line-clamp-2">{resource.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">{resource.category}</span>
                <Badge variant={resource.featured ? 'success' : 'default'} size="sm">
                  {resource.featured ? 'Featured' : 'Standard'}
                </Badge>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
