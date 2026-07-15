import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Heart, Star, HeartOff } from 'lucide-react';
import { cn, formatPrice } from '../../lib/utils';
import type { Product } from '../../lib/types';
import { Button } from './Button';
import { useWishlistStore } from '../../lib/wishlistStore';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  featured?: boolean;
}

export function ProductCard({ product, onAddToCart, onQuickView, featured }: ProductCardProps) {
  const navigate = useNavigate();
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      onClick={() => navigate(`/product/${product.slug}`)}
      className={cn(
        'group relative bg-white rounded-lg border border-border overflow-hidden cursor-pointer',
        'transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1',
        featured ? 'col-span-2 md:col-span-1' : ''
      )}
    >
      <div className="relative aspect-[4/3] bg-section overflow-hidden">
        {product.thumbnail && product.thumbnail.startsWith('/') ? (
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted bg-gradient-to-br from-section to-section-alt">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
              </div>
              <p className="text-xs text-text-muted font-medium uppercase tracking-wider">{product.fileType}</p>
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3 z-20 flex gap-2">
          <span className="px-2.5 py-1 text-xs font-semibold rounded bg-primary/90 text-white backdrop-blur-sm">
            {product.category}
          </span>
          {product.salePrice && (
            <span className="px-2.5 py-1 text-xs font-semibold rounded bg-accent text-white">
              Sale
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); toggle(product); }}
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {wishlisted ? (
              <Heart className="w-4 h-4 text-error fill-error" />
            ) : (
              <Heart className="w-4 h-4 text-text-secondary" />
            )}
          </button>
        </div>
        <div className="flex gap-2 p-4 pt-0">
          <Button
            size="sm"
            variant="primary"
            fullWidth
            onClick={(e) => { e.stopPropagation(); onAddToCart?.(product); }}
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
          {onQuickView && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
              aria-label="Quick view"
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className={cn('w-3.5 h-3.5', star <= 4 ? 'text-accent fill-accent' : 'text-border fill-border')} />
          ))}
          <span className="text-xs text-text-muted ml-1">(12)</span>
        </div>
        <h3 className="font-heading text-lg font-bold text-text-primary mb-1.5 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-3">
          {product.shortDescription}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {product.salePrice ? (
              <>
                <span className="text-xl font-bold text-primary">{formatPrice(product.salePrice)}</span>
                <span className="text-sm text-text-muted line-through">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="text-xl font-bold text-primary">{formatPrice(product.price)}</span>
            )}
          </div>
          <span className="text-xs text-text-muted">{product.fileType}</span>
        </div>
      </div>
    </motion.div>
  );
}
