import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, ShieldCheck } from 'lucide-react';
import { Section } from '../../components/ui/Section';
import { Button } from '../../components/ui/Button';
import { useCartStore } from '../../lib/store';
import { formatPrice } from '../../lib/utils';

export function Cart() {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="pt-28 min-h-screen">
        <Section className="text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ShoppingBag className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h1 className="font-heading text-3xl font-bold text-primary mb-2">Your Cart is Empty</h1>
            <p className="text-text-secondary mb-6">Browse our premium templates and add some to your cart.</p>
            <Link to="/store">
              <Button variant="primary" size="lg">
                Browse Templates
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </Section>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-28 min-h-screen">
      <Section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary">Shopping Cart</h1>
            <p className="text-text-secondary mt-1">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={clearCart}>
            <Trash2 className="w-4 h-4" /> Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.product._id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex gap-4 p-4 rounded-lg border border-border bg-white hover:shadow-card transition-all"
              >
                <div className="w-24 h-24 rounded-lg bg-section flex-shrink-0 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-text-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.slug}`} className="font-heading font-bold text-primary hover:text-accent transition-colors">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-text-muted mt-0.5">{item.product.category}</p>
                  <p className="text-sm font-semibold text-primary mt-1">
                    {formatPrice((item.product.salePrice || item.product.price))}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center border border-border rounded-md">
                    <button
                      onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                      className="p-2 hover:bg-section transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 py-2 text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="p-2 hover:bg-section transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="text-xs text-text-muted hover:text-error transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="p-6 rounded-lg border border-border bg-white sticky top-28">
              <h2 className="font-heading text-xl font-bold text-primary mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Download Fee</span>
                  <span className="font-semibold text-success">Free</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between text-lg">
                  <span className="font-heading font-bold text-primary">Total</span>
                  <span className="font-heading font-bold text-primary">{formatPrice(subtotal())}</span>
                </div>
              </div>
              <Link to="/checkout">
                <Button variant="primary" size="lg" fullWidth>
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-text-muted">
                <ShieldCheck className="w-4 h-4 text-accent" />
                Secure checkout with Mobile Money & Card
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
