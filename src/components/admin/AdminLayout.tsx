import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Download, LayoutGrid,
  FileText, Image, Mail, Star, BarChart3, CreditCard, FileSpreadsheet,
  Shield, Settings, HelpCircle, ChevronLeft, ChevronRight, Bell, Search,
  Menu, X, GraduationCap, Briefcase, Users2, Newspaper, Globe, Sun, Moon
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarItem {
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: string;
  disabled?: boolean;
}

const sidebarGroups: { title?: string; items: SidebarItem[] }[] = [
  {
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    ],
  },
  {
    title: 'Store Management',
    items: [
      { label: 'Products', icon: Package, path: '/admin/products' },
      { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
      { label: 'Customers', icon: Users, path: '/admin/customers' },
      { label: 'Downloads', icon: Download, path: '/admin/downloads' },
      { label: 'Categories', icon: LayoutGrid, path: '/admin/categories' },
      { label: 'Coupons', icon: CreditCard, path: '/admin/coupons' },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Content', icon: FileText, path: '/admin/content' },
      { label: 'Resources', icon: Newspaper, path: '/admin/resources' },
      { label: 'Media Library', icon: Image, path: '/admin/media' },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { label: 'Email Marketing', icon: Mail, path: '/admin/email' },
      { label: 'Reviews', icon: Star, path: '/admin/reviews' },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
      { label: 'Reports', icon: FileSpreadsheet, path: '/admin/reports' },
      { label: 'Payments', icon: CreditCard, path: '/admin/payments' },
    ],
  },
  {
    title: 'Administration',
    items: [
      { label: 'Users & Roles', icon: Shield, path: '/admin/users' },
      { label: 'Settings', icon: Settings, path: '/admin/settings' },
      { label: 'Support', icon: HelpCircle, path: '/admin/support' },
    ],
  },
  {
    title: 'Coming Soon',
    items: [
      { label: 'Academy', icon: GraduationCap, path: '#', disabled: true, badge: 'Soon' },
      { label: 'Consulting', icon: Briefcase, path: '#', disabled: true, badge: 'Soon' },
      { label: 'Memberships', icon: Users2, path: '#', disabled: true, badge: 'Soon' },
      { label: 'Client Portal', icon: Globe, path: '#', disabled: true, badge: 'Soon' },
    ],
  },
];

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('admin-dark-mode') === 'true');
  const location = useLocation();

  const toggleDark = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('admin-dark-mode', String(!darkMode));
    document.documentElement.classList.toggle('admin-dark', !darkMode);
  };

  return (
    <div className={cn('min-h-screen bg-section', darkMode && 'admin-dark')}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 h-full bg-primary text-white z-50 transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
              <span className="font-heading font-bold text-xs text-white">TW</span>
            </div>
            {!collapsed && (
              <div>
                <span className="font-heading font-bold text-sm text-white">TrueWorks</span>
                <span className="block text-[9px] text-white/50 tracking-widest uppercase">Admin</span>
              </div>
            )}
          </Link>
          <button
            onClick={() => { setCollapsed(!collapsed); setMobileOpen(false); }}
            className="p-1.5 rounded-md hover:bg-white/10 transition-colors hidden lg:block"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-md hover:bg-white/10 transition-colors lg:hidden">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-hide py-4 px-2 space-y-4">
          {sidebarGroups.map((group) => (
            <div key={group.title || 'main'}>
              {group.title && !collapsed && (
                <p className="px-3 text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1">
                  {group.title}
                </p>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.disabled ? '#' : item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm group',
                      active
                        ? 'bg-accent/20 text-accent font-semibold'
                        : item.disabled
                          ? 'text-white/30 cursor-not-allowed'
                          : 'text-white/60 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <Icon className={cn('w-5 h-5 flex-shrink-0', active && 'text-accent')} />
                    {!collapsed && (
                      <>
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto px-1.5 py-0.5 rounded bg-accent/20 text-accent text-[10px] font-semibold">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-md text-white/50 hover:bg-white/10 transition-colors text-sm">
            <Globe className="w-4 h-4" />
            {!collapsed && <span>View Site</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn('transition-all duration-300', collapsed ? 'lg:ml-16' : 'lg:ml-64')}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between h-14 px-4 md:px-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-section transition-colors">
                <Menu className="w-5 h-5" />
              </button>
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search products, orders, customers..."
                  className="w-80 pl-10 pr-4 py-1.5 rounded-md border border-border bg-section text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={toggleDark} className="p-2 rounded-md hover:bg-section transition-colors" title={darkMode ? 'Light mode' : 'Dark mode'}>
                {darkMode ? <Sun className="w-5 h-5 text-text-secondary" /> : <Moon className="w-5 h-5 text-text-secondary" />}
              </button>
              <button className="relative p-2 rounded-md hover:bg-section transition-colors">
                <Bell className="w-5 h-5 text-text-secondary" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
              </button>
              <div className="flex items-center gap-2 pl-3 border-l border-border">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white text-sm font-bold">
                  A
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-primary">Admin</p>
                  <p className="text-xs text-text-muted">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
