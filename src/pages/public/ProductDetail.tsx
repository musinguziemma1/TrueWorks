import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingCart, Heart, Share2, ChevronDown, Download,
  FileType, Layers, Star, ShieldCheck, Clock, RefreshCw,
  Monitor, CheckCircle2, ExternalLink, FileText,
  Minus, Plus, ChevronRight
} from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Section, SectionHeader } from '../../components/ui/Section';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProductCard } from '../../components/ui/ProductCard';
import { TestimonialCard } from '../../components/ui/TestimonialCard';
import { useCartStore } from '../../lib/store';
import { formatPrice, cn } from '../../lib/utils';

export function ProductDetail() {
  const { slug } = useParams();
  const { addItem, items } = useCartStore();
  const product = useQuery(api.products.getBySlug, { slug: slug || '' });
  const [activeTab, setActiveTab] = useState<'features' | 'faq' | 'reviews'>('features');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const reviews = useQuery(api.reviews.list, product ? { productId: product._id } : 'skip');
  const relatedItems = useQuery(api.products.getRelated, product ? { productId: product._id } : 'skip');

  if (product === undefined || reviews === undefined || relatedItems === undefined) {
    return <div className="pt-28 min-h-screen"><div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div></div>;
  }

  if (!product) {
    return (
      <div className="pt-28 text-center py-20">
        <h1 className="font-heading text-3xl font-bold text-primary mb-4">Product Not Found</h1>
        <Link to="/store"><Button variant="primary">Back to Store</Button></Link>
      </div>
    );
  }

  const inCart = items.find(i => i.product._id === product._id);
  const images = product.images.length > 0 ? product.images : null;

  return (
    <div className="pt-24 md:pt-28">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/store" className="hover:text-primary">Store</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/store?category=${product.category}`} className="hover:text-primary">{product.category}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-text-primary font-medium">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-section to-section-alt border border-border overflow-hidden relative group">
              {images ? (
                <img
                  src={images[selectedImage]}
                  alt={`${product.name} screenshot ${selectedImage + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <FileType className="w-10 h-10 text-primary" />
                    </div>
                    <p className="text-sm text-text-muted font-medium">{product.fileType}</p>
                    <p className="text-xs text-text-muted mt-1">v{product.version}</p>
                  </div>
                </div>
              )}
              {product.salePrice && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="accent">Sale</Badge>
                </div>
              )}
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button className="p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-colors">
                  <Heart className="w-4 h-4 text-text-secondary" />
                </button>
                <button className="p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-colors">
                  <Share2 className="w-4 h-4 text-text-secondary" />
                </button>
              </div>
            </div>
            {images && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      'aspect-[4/3] rounded-lg border overflow-hidden transition-colors',
                      selectedImage === i ? 'border-secondary ring-2 ring-secondary/20' : 'border-border hover:border-secondary'
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Badge variant="primary" size="md" className="mb-3">{product.category}</Badge>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-3">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={cn('w-4 h-4', s <= 4 ? 'text-accent fill-accent' : 'text-border')} />
                ))}
                <span className="text-sm text-text-muted ml-1">(12 reviews)</span>
              </div>
              <span className="text-sm text-text-muted">{product.downloadLimit} downloads</span>
            </div>
            <p className="text-lg text-text-secondary leading-relaxed mb-6">{product.shortDescription}</p>

            <div className="flex items-baseline gap-3 mb-6">
              {product.salePrice ? (
                <>
                  <span className="text-4xl font-heading font-bold text-primary">{formatPrice(product.salePrice)}</span>
                  <span className="text-xl text-text-muted line-through">{formatPrice(product.price)}</span>
                  <Badge variant="accent">
                    Save {formatPrice(product.price - product.salePrice)}
                  </Badge>
                </>
              ) : (
                <span className="text-4xl font-heading font-bold text-primary">{formatPrice(product.price)}</span>
              )}
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center border border-border rounded-md">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-section transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-3 font-semibold min-w-[3rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-section transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {product.demoUrl && (
                <a href={product.demoUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg">
                    <Monitor className="w-5 h-5" />
                    Live Demo
                  </Button>
                </a>
              )}
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={() => {
                  for (let i = 0; i < quantity; i++) addItem(product as any);
                }}
              >
                <ShoppingCart className="w-5 h-5" />
                {inCart ? 'Add Again' : 'Add to Cart'}
              </Button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-section mb-6">
              <div className="text-center">
                <Download className="w-5 h-5 text-accent mx-auto mb-1" />
                <p className="text-xs font-semibold text-text-primary">Instant Download</p>
              </div>
              <div className="text-center">
                <ShieldCheck className="w-5 h-5 text-accent mx-auto mb-1" />
                <p className="text-xs font-semibold text-text-primary">Secure Payment</p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-5 h-5 text-accent mx-auto mb-1" />
                <p className="text-xs font-semibold text-text-primary">Free Updates</p>
              </div>
            </div>

            {/* Product Meta */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-text-secondary">
                <FileType className="w-4 h-4" />
                <span><strong className="text-text-primary">File Type:</strong> {product.fileType}</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <Monitor className="w-4 h-4" />
                <span><strong className="text-text-primary">Compatibility:</strong> {product.fileCompatibility || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <Layers className="w-4 h-4" />
                <span><strong className="text-text-primary">Version:</strong> {product.version}</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <Clock className="w-4 h-4" />
                <span><strong className="text-text-primary">Updated:</strong> {new Date(product._creationTime).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Downloadable Files */}
            {product.downloadableFiles.length > 0 && (
              <div className="mt-6 p-4 rounded-lg bg-white border border-border">
                <p className="text-sm font-semibold text-text-primary mb-2">Files Included ({product.downloadableFiles.length})</p>
                <ul className="space-y-1">
                  {product.downloadableFiles.map((file, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                      <FileText className="w-3.5 h-3.5 text-accent" />
                      {file}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <Section variant="section">
        <div className="max-w-4xl mx-auto">
          <div className="flex border-b border-border mb-8 overflow-x-auto">
            {(['features', 'faq', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-6 py-3 text-sm font-semibold capitalize border-b-2 whitespace-nowrap transition-colors',
                  activeTab === tab ? 'border-accent text-primary' : 'border-transparent text-text-muted hover:text-text-secondary'
                )}
              >
                {tab === 'faq' ? 'FAQ' : tab === 'features' ? "What's Included" : 'Reviews'}
              </button>
            ))}
          </div>

          {activeTab === 'features' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* What's Inside */}
              {product.whatsInside && product.whatsInside.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-heading text-lg font-bold text-primary mb-4">What's Inside</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {product.whatsInside.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white border border-border">
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-4">
                <h3 className="font-heading text-lg font-bold text-primary">Description</h3>
                <div className="text-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br/>') }} />
              </div>

              {product.changelog && (
                <div className="mt-6 p-4 rounded-lg bg-white border border-border">
                  <p className="text-sm font-semibold text-text-primary mb-1">Latest Update</p>
                  <p className="text-sm text-text-secondary">{product.changelog}</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'faq' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {product.faq.length === 0 ? (
                <p className="text-text-muted">No FAQs available for this product.</p>
              ) : (
                product.faq.map((faq, idx) => (
                  <details key={idx} className="group">
                    <summary className="flex items-center justify-between p-4 rounded-lg bg-white border border-border cursor-pointer hover:border-secondary transition-colors">
                      <span className="font-semibold text-primary">{faq.question}</span>
                      <ChevronDown className="w-4 h-4 text-text-muted group-open:rotate-180 transition-transform" />
                    </summary>
                    <p className="px-4 py-3 text-text-secondary text-sm">{faq.answer}</p>
                  </details>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {reviews.slice(0, 5).map((r) => (
                <TestimonialCard
                  key={r._id}
                  name={r.customerName}
                  role=""
                  company=""
                  quote={r.content}
                  rating={r.rating}
                />
              ))}
            </motion.div>
          )}
        </div>
      </Section>

      {/* Related Products */}
      {relatedItems && relatedItems.length > 0 && (
        <Section>
          <SectionHeader title="Related Templates" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedItems.filter((rp): rp is NonNullable<typeof rp> => rp != null).map((rp) => (
              <ProductCard key={rp._id} product={rp as any} onAddToCart={addItem} />
            ))}
          </div>
        </Section>
      )}

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border p-4 lg:hidden">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <span className="text-xl font-heading font-bold text-primary">
              {formatPrice(product.salePrice || product.price)}
            </span>
          </div>
          <Button size="md" onClick={() => addItem(product as any)}>
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
