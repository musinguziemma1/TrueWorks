import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Download, TrendingUp, Briefcase, Stethoscope, GraduationCap, Heart, Building2 } from 'lucide-react';
import { products } from '../../lib/data';
import { useUIStore } from '../../lib/store';
import { formatPrice } from '../../lib/utils';

const industryIcons: Record<string, typeof Download> = {
  healthcare: Stethoscope,
  business: Briefcase,
  finance: TrendingUp,
  schools: GraduationCap,
  ngo: Heart,
  hr: Building2,
};

export function SearchOverlay() {
  const { searchQuery, setSearchQuery } = useUIStore();
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((p) => !p);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const results = open && searchQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.industry.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : [];

  const handleSelect = (slug: string) => {
    setOpen(false);
    setSearchQuery('');
    navigate(`/product/${slug}`);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-md hover:bg-section transition-colors text-text-secondary"
        aria-label="Open search (Ctrl+K)"
      >
        <Search className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-[15%] inset-x-4 md:left-1/2 md:-translate-x-1/2 md:max-w-xl z-50 bg-white rounded-xl shadow-xl border border-border overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Search products"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search className="w-5 h-5 text-text-muted flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search templates, categories, industries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-sm bg-transparent border-none outline-none text-primary placeholder:text-text-muted"
                  aria-label="Search query"
                />
                <kbd className="hidden sm:inline-flex text-[10px] px-1.5 py-0.5 rounded border border-border bg-section text-text-muted font-mono">ESC</kbd>
                <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-section" aria-label="Close search">
                  <X className="w-4 h-4 text-text-muted" />
                </button>
              </div>

              <div className="max-h-[320px] overflow-y-auto">
                {searchQuery && results.length === 0 && (
                  <div className="p-8 text-center">
                    <Search className="w-8 h-8 text-text-muted mx-auto mb-2" />
                    <p className="text-sm text-text-muted">No results for <strong>"{searchQuery}"</strong></p>
                  </div>
                )}

                {results.map((product) => {
                  const Icon = industryIcons[product.industry] || Download;
                  return (
                    <button
                      key={product._id}
                      onClick={() => handleSelect(product.slug)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-section/50 transition-colors text-left border-b border-border last:border-0"
                      aria-label={`View ${product.name}`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-section flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-text-muted" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-primary truncate">{product.name}</p>
                        <p className="text-xs text-text-muted truncate">{product.category} · {product.industry}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-primary">{formatPrice(product.salePrice || product.price)}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-text-muted flex-shrink-0" />
                    </button>
                  );
                })}

                {!searchQuery && (
                  <div className="p-6 text-center">
                    <Search className="w-10 h-10 text-text-muted mx-auto mb-3" />
                    <p className="text-sm text-text-muted">Start typing to search across all templates</p>
                    <p className="text-xs text-text-muted mt-1">Try "hospital", "dashboard", "finance"</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
