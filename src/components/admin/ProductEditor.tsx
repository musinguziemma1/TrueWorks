import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Upload, Plus, Trash2, Image } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';
import { Product } from '../../lib/types';

interface ProductEditorProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Product>) => void;
}

export function ProductEditor({ product, isOpen, onClose, onSave }: ProductEditorProps) {
  const [form, setForm] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    slug: product?.slug || '',
    shortDescription: product?.shortDescription || '',
    description: product?.description || '',
    price: product?.price || 0,
    salePrice: product?.salePrice || undefined,
    category: product?.category || '',
    industry: product?.industry || '',
    fileType: product?.fileType || 'Excel (.xlsx)',
    version: product?.version || '1.0',
    status: product?.status || 'draft' as const,
    featured: product?.featured || false,
    downloadLimit: product?.downloadLimit || 5,
    downloadExpiry: product?.downloadExpiry || 365,
    tags: product?.tags?.join(', ') || '',
  });
  const [faqList, setFaqList] = useState(product?.faq || []);

  const handleSave = () => {
    onSave({
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      faq: faqList,
      relatedProducts: [],
      images: [],
      thumbnail: '',
      downloadableFiles: [],
      changelog: '',
      seoTitle: form.name,
      seoDescription: form.shortDescription,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-white z-50 shadow-xl overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-border z-10 flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <h2 className="font-heading text-lg font-bold text-primary">
                  {product ? 'Edit Product' : 'New Product'}
                </h2>
                {product && <Badge variant={form.status === 'active' ? 'success' : 'warning'}>{form.status}</Badge>}
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="primary" onClick={handleSave}>
                  <Save className="w-4 h-4" /> Save
                </Button>
                <button onClick={onClose} className="p-2 rounded-md hover:bg-section transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-heading font-bold text-primary text-sm uppercase tracking-wider">Basic Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Product Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
                  <Input label="SKU" value={form.sku} onChange={(e) => setForm({...form, sku: e.target.value})} required />
                </div>
                <Input label="Slug" value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} />
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Short Description</label>
                  <textarea
                    rows={3}
                    value={form.shortDescription}
                    onChange={(e) => setForm({...form, shortDescription: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-md border border-border bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Full Description</label>
                  <textarea
                    rows={6}
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-md border border-border bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                  />
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-heading font-bold text-primary text-sm uppercase tracking-wider mb-4">Pricing</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Input label="Price (USD)" type="number" value={form.price} onChange={(e) => setForm({...form, price: Number(e.target.value)})} />
                  <Input label="Sale Price (USD)" type="number" value={form.salePrice || ''} onChange={(e) => setForm({...form, salePrice: e.target.value ? Number(e.target.value) : undefined})} />
                  <Input label="Version" value={form.version} onChange={(e) => setForm({...form, version: e.target.value})} />
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-heading font-bold text-primary text-sm uppercase tracking-wider mb-4">Classification</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Input label="Category" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} />
                  <Input label="Industry" value={form.industry} onChange={(e) => setForm({...form, industry: e.target.value})} />
                  <Input label="File Type" value={form.fileType} onChange={(e) => setForm({...form, fileType: e.target.value})} />
                </div>
                <div className="mt-4">
                  <Input label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({...form, tags: e.target.value})} />
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-heading font-bold text-primary text-sm uppercase tracking-wider mb-4">Download Settings</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Download Limit" type="number" value={form.downloadLimit} onChange={(e) => setForm({...form, downloadLimit: Number(e.target.value)})} />
                  <Input label="Download Expiry (days)" type="number" value={form.downloadExpiry} onChange={(e) => setForm({...form, downloadExpiry: Number(e.target.value)})} />
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-heading font-bold text-primary text-sm uppercase tracking-wider mb-4">Status</h3>
                <div className="flex items-center gap-4">
                  {(['active', 'draft', 'archived'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setForm({...form, status: s})}
                      className={cn(
                        'px-4 py-2 rounded-md text-sm font-semibold capitalize transition-colors',
                        form.status === s ? 'bg-primary text-white' : 'bg-section text-text-secondary hover:bg-section-alt'
                      )}
                    >
                      {s}
                    </button>
                  ))}
                  <label className="flex items-center gap-2 ml-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({...form, featured: e.target.checked})}
                      className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <span className="text-sm font-semibold text-primary">Featured</span>
                  </label>
                </div>
              </div>

              {/* FAQ */}
              <div className="border-t border-border pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-primary text-sm uppercase tracking-wider">FAQ</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setFaqList([...faqList, { question: '', answer: '' }])}
                  >
                    <Plus className="w-4 h-4" /> Add FAQ
                  </Button>
                </div>
                <div className="space-y-3">
                  {faqList.map((faq, idx) => (
                    <div key={idx} className="p-4 rounded-lg border border-border bg-section">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-semibold text-text-muted">FAQ #{idx + 1}</span>
                        <button onClick={() => setFaqList(faqList.filter((_, i) => i !== idx))} className="text-text-muted hover:text-error">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        placeholder="Question"
                        value={faq.question}
                        onChange={(e) => {
                          const updated = [...faqList];
                          updated[idx] = { ...updated[idx], question: e.target.value };
                          setFaqList(updated);
                        }}
                        className="w-full mb-2 px-3 py-2 rounded border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
                      />
                      <textarea
                        placeholder="Answer"
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => {
                          const updated = [...faqList];
                          updated[idx] = { ...updated[idx], answer: e.target.value };
                          setFaqList(updated);
                        }}
                        className="w-full px-3 py-2 rounded border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
