import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { navigation } from '../../lib/data';
import { useCartStore, useUIStore } from '../../lib/store';
import { Button } from '../ui/Button';
import { SearchOverlay } from '../ui/SearchOverlay';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobileMenuOpen, setMobileMenuOpen, setNewsletterOpen } = useUIStore();
  const { totalItems } = useCartStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMegaOpen(false);
  }, [location.pathname, setMobileMenuOpen]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      {/* Gold accent line */}
      <div className={cn(
        'h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent transition-opacity duration-300',
        scrolled ? 'opacity-0' : 'opacity-100'
      )} />
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full border-2 border-accent bg-primary flex items-center justify-center">
              <span className="text-accent font-heading font-bold text-sm">TW</span>
            </div>
            <div>
              <span className="font-heading font-bold text-lg text-primary">TrueWorks</span>
              <span className="hidden md:block text-[10px] text-text-muted tracking-widest uppercase -mt-1">Limited</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.id}
                to={item.url}
                className={cn(
                  'nav-link text-sm font-semibold',
                  location.pathname === item.url ? 'text-primary active' : 'text-text-secondary hover:text-primary'
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="relative">
              <button
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
                className="flex items-center gap-1 text-sm font-semibold text-text-secondary hover:text-primary transition-colors"
              >
                Industries
                <ChevronDown className={cn('w-4 h-4 transition-transform', megaOpen && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    onMouseEnter={() => setMegaOpen(true)}
                    onMouseLeave={() => setMegaOpen(false)}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] p-6 rounded-lg bg-white border border-border shadow-xl"
                  >
                    <div className="grid grid-cols-3 gap-4">
                      {['Healthcare', 'Business', 'Finance', 'NGO', 'HR', 'Schools', 'Churches', 'Agriculture', 'SME'].map((ind) => (
                        <Link
                          key={ind}
                          to={`/store?industry=${ind.toLowerCase()}`}
                          className="p-3 rounded-md hover:bg-section transition-colors text-sm font-medium text-text-secondary hover:text-primary"
                        >
                          {ind}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <SearchOverlay />
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 rounded-md hover:bg-section transition-colors text-text-secondary"
              aria-label={`Shopping cart (${totalItems()} items)`}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center" aria-hidden="true">
                  {totalItems()}
                </span>
              )}
            </button>
            <button onClick={() => setNewsletterOpen(true)} className="hidden sm:block text-sm font-semibold text-accent hover:text-accent-light transition-colors" aria-label="Get free template">
              Free Template
            </button>
            <Link to="/store" className="hidden sm:block">
              <Button size="sm" variant="primary">Browse Store</Button>
            </Link>
            <button
              className="lg:hidden p-2 rounded-md hover:bg-section transition-colors"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-white"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.id}
                  to={item.url}
                  className={cn(
                    'block px-4 py-3 rounded-md text-sm font-semibold transition-colors',
                    location.pathname === item.url
                      ? 'bg-primary/5 text-primary'
                      : 'text-text-secondary hover:bg-section hover:text-primary'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-2 space-y-2">
                <p className="px-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Industries</p>
                {['Healthcare', 'Business', 'Finance', 'NGO', 'HR', 'Schools'].map((ind) => (
                  <Link
                    key={ind}
                    to={`/store?industry=${ind.toLowerCase()}`}
                    className="block px-4 py-2 rounded-md text-sm text-text-secondary hover:bg-section hover:text-primary transition-colors"
                  >
                    {ind}
                  </Link>
                ))}
              </div>
              <button
                onClick={() => { setMobileMenuOpen(false); setNewsletterOpen(true); }}
                className="block w-full text-left px-4 py-3 rounded-md text-sm font-semibold text-accent hover:bg-section transition-colors"
              >
                Free Template
              </button>
              <Link to="/store" className="block px-4 py-3 rounded-md text-sm font-semibold text-primary bg-accent/10 hover:bg-accent/20 transition-colors text-center" onClick={() => setMobileMenuOpen(false)}>
                Browse Store
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
