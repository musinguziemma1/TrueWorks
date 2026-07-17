import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConvexProvider } from 'convex/react';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AdminLayout } from './components/admin/AdminLayout';
import { NewsletterModal } from './components/ui/NewsletterModal';
import { convexClient } from './lib/convexClient';
import { useAnalytics } from './hooks/useAnalytics';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy-loaded public pages
const Home = lazy(() => import('./pages/public/Home').then(m => ({ default: m.Home })));
const BlogPost = lazy(() => import('./pages/public/BlogPost').then(m => ({ default: m.BlogPost })));
const Store = lazy(() => import('./pages/public/Store').then(m => ({ default: m.Store })));
const ProductDetail = lazy(() => import('./pages/public/ProductDetail').then(m => ({ default: m.ProductDetail })));
const About = lazy(() => import('./pages/public/About').then(m => ({ default: m.About })));
const Resources = lazy(() => import('./pages/public/Resources').then(m => ({ default: m.Resources })));
const Contact = lazy(() => import('./pages/public/Contact').then(m => ({ default: m.Contact })));
const Cart = lazy(() => import('./pages/public/Cart').then(m => ({ default: m.Cart })));
const Checkout = lazy(() => import('./pages/public/Checkout').then(m => ({ default: m.Checkout })));
const OrderConfirmation = lazy(() => import('./pages/public/OrderConfirmation').then(m => ({ default: m.OrderConfirmation })));
const Terms = lazy(() => import('./pages/public/Terms').then(m => ({ default: m.Terms })));
const Privacy = lazy(() => import('./pages/public/Privacy').then(m => ({ default: m.Privacy })));
const RefundPolicy = lazy(() => import('./pages/public/RefundPolicy').then(m => ({ default: m.RefundPolicy })));
const FAQPage = lazy(() => import('./pages/public/FAQ').then(m => ({ default: m.FAQ })));
const DownloadPage = lazy(() => import('./pages/public/DownloadPage').then(m => ({ default: m.DownloadPage })));
const NotFound = lazy(() => import('./pages/public/NotFound').then(m => ({ default: m.NotFound })));

// Lazy-loaded admin pages
const DashboardOverview = lazy(() => import('./pages/admin/DashboardOverview').then(m => ({ default: m.DashboardOverview })));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts').then(m => ({ default: m.AdminProducts })));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders').then(m => ({ default: m.AdminOrders })));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers').then(m => ({ default: m.AdminCustomers })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then(m => ({ default: m.AdminSettings })));
const AdminDownloads = lazy(() => import('./pages/admin/AdminDownloads').then(m => ({ default: m.AdminDownloads })));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories').then(m => ({ default: m.AdminCategories })));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons').then(m => ({ default: m.AdminCoupons })));
const AdminContent = lazy(() => import('./pages/admin/AdminContent').then(m => ({ default: m.AdminContent })));
const AdminMedia = lazy(() => import('./pages/admin/AdminMedia').then(m => ({ default: m.AdminMedia })));
const AdminEmail = lazy(() => import('./pages/admin/AdminEmail').then(m => ({ default: m.AdminEmail })));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews').then(m => ({ default: m.AdminReviews })));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics').then(m => ({ default: m.AdminAnalytics })));
const AdminReports = lazy(() => import('./pages/admin/AdminReports').then(m => ({ default: m.AdminReports })));
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments').then(m => ({ default: m.AdminPayments })));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers').then(m => ({ default: m.AdminUsers })));
const AdminResources = lazy(() => import('./pages/admin/AdminResources').then(m => ({ default: m.AdminResources })));
const AdminSupport = lazy(() => import('./pages/admin/AdminSupport').then(m => ({ default: m.AdminSupport })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-text-muted">Loading...</p>
      </div>
    </div>
  );
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function AnalyticsTracker() {
  useAnalytics();
  return null;
}

function AppContent() {
  return (
    <BrowserRouter>
      <AnalyticsTracker />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '6px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.08)',
            fontFamily: '"Calibri", system-ui, sans-serif',
          },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/store" element={<PublicLayout><Store /></PublicLayout>} />
          <Route path="/product/:slug" element={<PublicLayout><ProductDetail /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/resources" element={<PublicLayout><Resources /></PublicLayout>} />
          <Route path="/resources/:slug" element={<PublicLayout><BlogPost /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
          <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />
          <Route path="/order-confirmation" element={<PublicLayout><OrderConfirmation /></PublicLayout>} />
          <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />
          <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
          <Route path="/refund-policy" element={<PublicLayout><RefundPolicy /></PublicLayout>} />
          <Route path="/faq" element={<PublicLayout><FAQPage /></PublicLayout>} />
          <Route path="/download" element={<PublicLayout><DownloadPage /></PublicLayout>} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="downloads" element={<AdminDownloads />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="coupons" element={<ErrorBoundary><AdminCoupons /></ErrorBoundary>} />
            <Route path="content" element={<AdminContent />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="email" element={<AdminEmail />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="resources" element={<AdminResources />} />
            <Route path="support" element={<AdminSupport />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <NewsletterModal />
    </BrowserRouter>
  );
}

function App() {
  if (!convexClient) {
    return <AppContent />;
  }
  return (
    <ConvexProvider client={convexClient}>
      <AppContent />
    </ConvexProvider>
  );
}

export default App;
