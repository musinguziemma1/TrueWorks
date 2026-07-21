import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Grid3X3, List, X } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Section } from '../../components/ui/Section';
import { Button } from '../../components/ui/Button';
import { ProductCard } from '../../components/ui/ProductCard';
import { useCartStore, useFilterStore } from '../../lib/store';
import { cn } from '../../lib/utils';
import { SEO } from '../../components/SEO';
import { getFilteredProducts } from '../../lib/productFilters';

const fileTypes = ['Excel (.xlsx)', 'Excel (.xlsm)', 'PowerPoint (.pptx)', 'Word (.docx)', 'PDF'];
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
];

export function Store() {
  const { addItem } = useCartStore();
  const {
    selectedCategory, selectedIndustry, selectedFileType, sortBy,
    setCategory, setIndustry, setFileType, setSortBy, resetFilters,
  } = useFilterStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const products = useQuery(api.products.list, {});
  const categories = useQuery(api.categories.list, {});

  const filteredProducts = useMemo(() => getFilteredProducts(products || [], {
    searchQuery,
    selectedCategory,
    selectedIndustry,
    selectedFileType,
    sortBy,
    priceRange: [0, 1000000],
  }), [products, searchQuery, selectedCategory, selectedIndustry, selectedFileType, sortBy]);

  if (products === undefined || categories === undefined) {
    return <div className="pt-28 min-h-screen"><div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div></div>;
  }

  return (
    <>
      <SEO
        title="Premium Excel Templates & Business Systems"
        description="Browse our complete collection of institution-grade Excel templates, financial models, dashboards and business systems for hospitals, NGOs, schools, churches and growing businesses."
        canonical="/store"
        jsonLd={{
          '@type': 'CollectionPage',
          name: 'TrueWorks Store',
          description: 'Premium Excel templates and business systems',
        }}
      />
    <div className="pt-24 md:pt-28">
      <Section variant="section" className="pt-12 pb-0">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary">Premium Templates</h1>
            <p className="text-text-secondary mt-1">
              {filteredProducts.length === 0 ? 'No matching templates right now' : `${filteredProducts.length} product${filteredProducts.length === 1 ? '' : 's'} available`}
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
            <div className="hidden sm:flex items-center border border-border rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={cn('p-2', viewMode === 'grid' ? 'bg-section text-primary' : 'text-text-muted')}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn('p-2', viewMode === 'list' ? 'bg-section text-primary' : 'text-text-muted')}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Section>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <motion.aside
            initial={false}
            animate={{ width: showFilters ? 260 : 0, opacity: showFilters ? 1 : 0 }}
            className="hidden md:block overflow-hidden shrink-0"
          >
            {showFilters && (
              <div className="w-65 pr-8 space-y-6 pt-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading font-bold text-sm text-primary">Categories</h3>
                    {selectedCategory && (
                      <button onClick={() => setCategory('')} className="text-xs text-text-muted hover:text-primary">Clear</button>
                    )}
                  </div>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => setCategory(cat.name === selectedCategory ? '' : cat.name)}
                        className={cn(
                          'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                          cat.name === selectedCategory ? 'bg-primary/10 text-primary font-semibold' : 'text-text-secondary hover:bg-section'
                        )}
                      >
                        {cat.name}
                        <span className="float-right text-xs text-text-muted">({cat.productCount})</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-primary mb-3">File Type</h3>
                  <div className="space-y-1">
                    {fileTypes.map((ft) => (
                      <button
                        key={ft}
                        onClick={() => setFileType(ft === selectedFileType ? '' : ft)}
                        className={cn(
                          'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                          ft === selectedFileType ? 'bg-primary/10 text-primary font-semibold' : 'text-text-secondary hover:bg-section'
                        )}
                      >
                        {ft}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-primary mb-3">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-md border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {(selectedCategory || selectedIndustry || selectedFileType) && (
                  <Button variant="ghost" size="sm" fullWidth onClick={resetFilters}>
                    <X className="w-4 h-4" /> Reset Filters
                  </Button>
                )}
              </div>
            )}
          </motion.aside>

          {/* Products */}
          <div className="flex-1 min-w-0 py-6">
            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center shadow-sm">
                <p className="text-primary text-lg font-semibold mb-2">No templates match your current filters</p>
                <p className="text-text-muted text-sm mb-4">Try a broader search, clear one filter, or browse featured templates instead.</p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" onClick={resetFilters}>Clear Filters</Button>
                  <Button variant="primary" onClick={() => setSearchQuery('')}>Show All Templates</Button>
                </div>
              </div>
            ) : (
              <div className={cn(
                'grid gap-6',
                viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              )}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product as any} onAddToCart={addItem} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
