import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Grid3X3, List, Edit, Copy, Trash2, Download } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { formatPrice, cn } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProductEditor } from '../../components/admin/ProductEditor';
import { DataTable, Column } from '../../components/admin/DataTable';
import { Product } from '../../lib/types';
import toast from 'react-hot-toast';

export function AdminProducts() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const products = useQuery(api.products.list, {});
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const deleteProduct = useMutation(api.products.remove);
  const duplicateProduct = useMutation(api.products.duplicate);

  if (products === undefined) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: Column<Product>[] = [
    {
      key: 'name',
      label: 'Product',
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-section flex items-center justify-center flex-shrink-0">
            <Download className="w-5 h-5 text-text-muted" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">{p.name}</p>
            <p className="text-xs text-text-muted">{p.fileType} · v{p.version}</p>
          </div>
        </div>
      ),
    },
    { key: 'sku', label: 'SKU', className: 'hidden md:table-cell' },
    {
      key: 'category',
      label: 'Category',
      render: (p) => <Badge variant="primary" size="sm">{p.category}</Badge>,
    },
    {
      key: 'price',
      label: 'Price',
      className: 'hidden lg:table-cell',
      sortable: true,
      render: (p) => p.salePrice ? (
        <div className="flex items-center gap-1">
          <span className="font-semibold">{formatPrice(p.salePrice)}</span>
          <span className="text-xs text-text-muted line-through">{formatPrice(p.price)}</span>
        </div>
      ) : <span className="font-semibold">{formatPrice(p.price)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (p) => (
        <Badge variant={p.status === 'active' ? 'success' : p.status === 'draft' ? 'warning' : 'error'} size="sm">
          {p.status}
        </Badge>
      ),
    },
    {
      key: 'salesCount',
      label: 'Sales',
      sortable: true,
      className: 'hidden sm:table-cell',
      render: (p) => <span className="text-text-secondary">{p.salesCount}</span>,
    },
    {
      key: 'actions',
      label: '',
      className: 'w-20',
      render: (p) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => { setEditingProduct(p as any); setEditorOpen(true); }}
            className="p-1.5 rounded hover:bg-section transition-colors"
            aria-label="Edit product"
          >
            <Edit className="w-4 h-4 text-text-muted" />
          </button>
          <button
            onClick={async () => { await duplicateProduct({ id: p._id as any }); toast.success('Product duplicated'); }}
            className="p-1.5 rounded hover:bg-section transition-colors"
            aria-label="Duplicate product"
          >
            <Copy className="w-4 h-4 text-text-muted" />
          </button>
          <button
            onClick={async () => { await deleteProduct({ id: p._id as any }); toast.success('Product deleted'); }}
            className="p-1.5 rounded hover:bg-section transition-colors"
            aria-label="Delete product"
          >
            <Trash2 className="w-4 h-4 text-text-muted" />
          </button>
        </div>
      ),
    },
  ];

  const handleSave = async (data: Partial<Product>) => {
    if (editingProduct) {
      await updateProduct({ id: editingProduct._id as any, ...data, relatedProducts: (data.relatedProducts || []) as any, faq: (data.faq || []) as any });
      toast.success('Product updated');
    } else {
      await createProduct({
        name: data.name || '',
        sku: data.sku || `SKU-${Date.now()}`,
        slug: (data.name || '').toLowerCase().replace(/\s+/g, '-'),
        shortDescription: data.shortDescription || '',
        description: data.description || '',
        price: data.price || 0,
        salePrice: data.salePrice,
        category: data.category || '',
        industry: data.industry || '',
        fileType: data.fileType || '',
        tags: data.tags || [],
        images: data.images || [],
        thumbnail: data.thumbnail || '',
        downloadableFiles: data.downloadableFiles || [],
        version: data.version || '1.0',
        changelog: data.changelog || '',
        demoUrl: data.demoUrl,
        faq: data.faq || [],
        seoTitle: data.seoTitle || '',
        seoDescription: data.seoDescription || '',
        downloadLimit: data.downloadLimit || 5,
        downloadExpiry: data.downloadExpiry || 365,
        status: 'draft',
        featured: data.featured || false,
      });
      toast.success('Product created');
    }
    setEditorOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Products</h1>
          <p className="text-sm text-text-muted">{filtered.length} products</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-60 pl-10 pr-4 py-2 rounded-md border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>
          <div className="hidden sm:flex items-center border border-border rounded-md">
            <button onClick={() => setViewMode('list')} className={cn('p-2', viewMode === 'list' ? 'bg-section text-primary' : 'text-text-muted')}>
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('grid')} className={cn('p-2', viewMode === 'grid' ? 'bg-section text-primary' : 'text-text-muted')}>
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
          <Button size="sm" onClick={() => { setEditingProduct(null); setEditorOpen(true); }}>
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <DataTable
          columns={columns}
          data={filtered as any}
          keyExtractor={(p: any) => p._id}
          searchable={false}
          emptyMessage="No products found matching your search."
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <motion.div
              key={product._id as any}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg border border-border bg-white hover:shadow-card-hover transition-all group"
            >
              <div className="aspect-[4/3] rounded-md bg-section mb-3 flex items-center justify-center relative overflow-hidden">
                <Download className="w-8 h-8 text-text-muted" />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
              </div>
              <Badge variant={product.status === 'active' ? 'success' : product.status === 'draft' ? 'warning' : 'error'} size="sm" className="mb-1">{product.status}</Badge>
              <p className="text-sm font-semibold text-primary truncate">{product.name}</p>
              <p className="text-xs text-text-muted mb-2">{product.sku}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary">{formatPrice(product.salePrice || product.price)}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingProduct(product as any); setEditorOpen(true); }} className="p-1.5 rounded hover:bg-section" aria-label="Edit product"><Edit className="w-3.5 h-3.5 text-text-muted" /></button>
                  <button onClick={async () => { await duplicateProduct({ id: product._id as any }); toast.success('Product duplicated'); }} className="p-1.5 rounded hover:bg-section" aria-label="Duplicate product"><Copy className="w-3.5 h-3.5 text-text-muted" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ProductEditor
        product={editingProduct}
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
