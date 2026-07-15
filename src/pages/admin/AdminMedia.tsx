import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image, Folder, Trash2, Download, Search, Grid3X3, List } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/utils';

const mediaItems = [
  { id: '1', name: 'hospital-dashboard-thumb.jpg', type: 'image', size: '245 KB', date: '2 days ago', folder: 'Products' },
  { id: '2', name: 'financial-model-preview.png', type: 'image', size: '512 KB', date: '3 days ago', folder: 'Products' },
  { id: '3', name: 'ngo-system-screenshot.jpg', type: 'image', size: '328 KB', date: '5 days ago', folder: 'Products' },
  { id: '4', name: 'logo-trueworks.svg', type: 'image', size: '12 KB', date: '1 week ago', folder: 'Branding' },
  { id: '5', name: 'hero-bg.jpg', type: 'image', size: '1.2 MB', date: '2 weeks ago', folder: 'Backgrounds' },
  { id: '6', name: 'team-photo-2025.jpg', type: 'image', size: '4.8 MB', date: '3 weeks ago', folder: 'Team' },
];

const folders = ['All', 'Products', 'Branding', 'Backgrounds', 'Team', 'Blog'];

export function AdminMedia() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFolder, setActiveFolder] = useState('All');

  const filtered = activeFolder === 'All' ? mediaItems : mediaItems.filter(m => m.folder === activeFolder);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Media Library</h1>
          <p className="text-sm text-text-muted">{mediaItems.length} files</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center border border-border rounded-md">
            <button onClick={() => setViewMode('grid')} className={cn('p-2', viewMode === 'grid' ? 'bg-section' : '')}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={cn('p-2', viewMode === 'list' ? 'bg-section' : '')}>
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button size="sm"><Upload className="w-4 h-4" /> Upload</Button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {folders.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFolder(f)}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-semibold whitespace-nowrap transition-colors',
              activeFolder === f ? 'bg-primary text-white' : 'bg-section text-text-secondary hover:bg-section-alt'
            )}
          >
            {f === 'All' ? <Folder className="w-4 h-4 inline mr-1.5" /> : null}
            {f}
          </button>
        ))}
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group rounded-lg border border-border bg-white overflow-hidden hover:shadow-card-hover transition-all cursor-pointer"
            >
              <div className="aspect-square bg-gradient-to-br from-section to-section-alt flex items-center justify-center">
                <Image className="w-10 h-10 text-text-muted/40" />
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-primary truncate">{item.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-text-muted">{item.size}</span>
                  <button className="p-1 rounded hover:bg-section opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3 h-3 text-text-muted" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-white overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-section/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">File</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase hidden sm:table-cell">Folder</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase hidden md:table-cell">Size</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Date</th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-section/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-section flex items-center justify-center"><Image className="w-4 h-4 text-text-muted" /></div>
                      <span className="text-sm font-medium text-primary">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary hidden sm:table-cell">{item.folder}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary hidden md:table-cell">{item.size}</td>
                  <td className="px-4 py-3 text-sm text-text-muted">{item.date}</td>
                  <td className="px-4 py-3">
                    <button className="p-1.5 rounded hover:bg-section"><Trash2 className="w-4 h-4 text-text-muted" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
