import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Mail, ShoppingBag, MessageCircle, Clock, AlertCircle } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Section } from '../../components/ui/Section';
import { Button } from '../../components/ui/Button';
import { formatPrice, cn } from '../../lib/utils';
import type { Id } from '../../../convex/_generated/dataModel';

export function OrderConfirmation() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const stateId = (location.state as any)?.orderId;
    const paramId = searchParams.get('orderId');
    const id = stateId || paramId;

    if (id) {
      setOrderId(id);
    } else {
      const placed = sessionStorage.getItem('order_placed');
      if (!placed) {
        window.location.href = '/';
      }
      sessionStorage.removeItem('order_placed');
    }
  }, [location.state, searchParams]);

  const order = useQuery(api.orders.getById, orderId ? { id: orderId as Id<"orders"> } : "skip");
  const paymentStatus = useQuery(api.payments_integration.getPaymentStatus, orderId ? { orderId: orderId as Id<"orders"> } : "skip");

  const isValid = order?.paymentStatus === "completed" || order?.orderStatus === "processing";

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (!orderId || !order) {
    return (
      <div className="pt-28 min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-text-muted">Loading order details...</div>
      </div>
    );
  }

  return (
    <div className="pt-28 min-h-screen">
      <Section className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={cn(
            'w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center',
            isValid ? 'bg-success/10' : 'bg-warning/10'
          )}>
            {isValid ? (
              <CheckCircle className="w-10 h-10 text-success" />
            ) : (
              <Clock className="w-10 h-10 text-warning" />
            )}
          </div>

          <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-3">
            {isValid ? 'Order Confirmed!' : 'Payment Pending'}
          </h1>
          <p className="text-lg text-text-secondary mb-2">
            {isValid
              ? 'Thank you for your purchase. Your order has been received.'
              : 'We are waiting for payment confirmation.'}
          </p>
          <p className="text-sm text-text-muted mb-8">
            Order Number: <span className="font-semibold text-primary">{order.orderNumber}</span>
          </p>

          {paymentStatus && (
            <div className={cn(
              'max-w-lg mx-auto mb-8 p-4 rounded-lg border',
              paymentStatus.status === 'completed' ? 'bg-success/5 border-success/20' :
              paymentStatus.status === 'failed' ? 'bg-error/5 border-error/20' :
              'bg-warning/5 border-warning/20'
            )}>
              <p className="text-sm font-semibold flex items-center justify-center gap-2">
                {paymentStatus.status === 'completed' && <><CheckCircle className="w-4 h-4 text-success" /> Payment Completed</>}
                {paymentStatus.status === 'failed' && <><AlertCircle className="w-4 h-4 text-error" /> Payment Failed</>}
                {paymentStatus.status === 'pending' && <><Clock className="w-4 h-4 text-warning" /> Payment Pending</>}
              </p>
            </div>
          )}

          <div className="max-w-lg mx-auto space-y-4 mb-8">
            <div className="p-5 rounded-lg border border-border bg-white flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Download className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-primary">Instant Download Available</h3>
                <p className="text-sm text-text-secondary">Your templates are ready to download now.</p>
              </div>
            </div>
            <div className="p-5 rounded-lg border border-border bg-white flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-primary">Email Confirmation Sent</h3>
                <p className="text-sm text-text-secondary">Check your inbox for download links and receipt.</p>
              </div>
            </div>
          </div>

          {isValid && order.downloadLinks.length > 0 && (
            <div className="max-w-lg mx-auto mb-8">
              <h3 className="font-heading font-bold text-primary mb-4 text-left">Your Downloads</h3>
              <div className="space-y-3">
                {order.downloadLinks.map((link, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-border bg-white flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-semibold text-primary truncate">{link.productName}</p>
                      <p className="text-xs text-text-muted">
                        Downloads: {link.downloadCount} / {link.downloadCount + link.remainingDownloads} |
                        Expires: {formatDate(link.expiryDate)}
                      </p>
                      {link.remainingDownloads <= 1 && (
                        <p className="text-xs text-warning mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Only {link.remainingDownloads} download{link.remainingDownloads !== 1 ? 's' : ''} remaining
                        </p>
                      )}
                    </div>
                    <a
                      href={link.url}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors flex-shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/store">
              <Button variant="outline" size="lg">
                <ShoppingBag className="w-5 h-5" />
                Continue Shopping
              </Button>
            </Link>
          </div>

          <p className="text-sm text-text-muted mt-8 flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Need help? Contact us on WhatsApp or email hello@trueworks.ug
          </p>
        </motion.div>
      </Section>
    </div>
  );
}
