import { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

export function AdminCategories() {
  const [query, setQuery] = useState('');
  const categories = useQuery(api.categories.list);
  const createCategory = useMutation(api.categories.create);
  const updateCategory = useMutation(api.categories.update);
  const removeCategory = useMutation(api.categories.remove);

  if (categories === undefined) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Categories</h1>
          <p className="text-sm text-text-muted">{filtered.length} categories</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input type="text" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)}
              className="w-48 pl-10 pr-4 py-2 rounded-md border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20" />
          </div>
          <Button size="sm"><Plus className="w-4 h-4" /> Add Category</Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((cat, idx) => {
          const IconComponent = (Icons as any)[cat.icon] || Icons.Box;
          return (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="p-5 rounded-lg border border-border bg-white hover:shadow-card-hover transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-primary" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded hover:bg-section"><Edit className="w-3.5 h-3.5 text-text-muted" /></button>
                  <button className="p-1.5 rounded hover:bg-section"><Trash2 className="w-3.5 h-3.5 text-text-muted" /></button>
                </div>
              </div>
              <h3 className="font-heading font-bold text-primary mb-1">{cat.name}</h3>
              <p className="text-xs text-text-secondary mb-3 line-clamp-2">{cat.description}</p>
              <div className="flex items-center justify-between text-xs">
                <Badge variant="primary" size="sm">{cat.productCount} products</Badge>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
