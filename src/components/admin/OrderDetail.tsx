import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, RefreshCw, Mail, Printer, FileText, CreditCard, Smartphone, CheckCircle, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatPrice, formatDate, cn } from '../../lib/utils';
import { Order } from '../../lib/types';

interface OrderDetailProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (orderId: string, status: string) => void;
  onResendDownload?: (orderId: string) => void;
  onResetDownloads?: (orderId: string) => void;
}

const paymentIcons: Record<string, React.ElementType> = {
  mtn_momo: Smartphone,
  airtel_money: Smartphone,
  visa: CreditCard,
  mastercard: CreditCard,
};

export function OrderDetail({ order, isOpen, onClose }: OrderDetailProps) {
  if (!order) return null;

  const PaymentIcon = paymentIcons[order.paymentMethod] || CreditCard;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-white z-50 shadow-xl overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-border z-10 flex items-center justify-between p-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-primary">{order.orderNumber}</h2>
                <p className="text-sm text-text-muted">{formatDate(order.createdAt)}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-md hover:bg-section transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-lg border border-border">
                  <p className="text-xs text-text-muted mb-1">Payment Status</p>
                  <Badge variant={order.paymentStatus === 'completed' ? 'success' : order.paymentStatus === 'failed' ? 'error' : 'warning'}>
                    {order.paymentStatus}
                  </Badge>
                </div>
                <div className="p-4 rounded-lg border border-border">
                  <p className="text-xs text-text-muted mb-1">Order Status</p>
                  <Badge variant={order.orderStatus === 'completed' ? 'success' : order.orderStatus === 'cancelled' ? 'error' : 'primary'}>
                    {order.orderStatus}
                  </Badge>
                </div>
              </div>

              {/* Customer Info */}
              <div className="p-4 rounded-lg border border-border">
                <h3 className="font-heading font-bold text-primary text-sm mb-3">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Name</span>
                    <span className="font-medium text-primary">{order.customer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Email</span>
                    <span className="font-medium text-primary">{order.customer.email}</span>
                  </div>
                  {order.customer.phone && (
                    <div className="flex justify-between">
                      <span className="text-text-muted">Phone</span>
                      <span className="font-medium text-primary">{order.customer.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Info */}
              <div className="p-4 rounded-lg border border-border">
                <h3 className="font-heading font-bold text-primary text-sm mb-3">Payment Information</h3>
                <div className="flex items-center gap-3 mb-3">
                  <PaymentIcon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary capitalize">
                    {order.paymentMethod.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="font-medium">{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.discount && (
                    <div className="flex justify-between">
                      <span className="text-text-muted">Discount</span>
                      <span className="font-medium text-success">-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-2 flex justify-between font-heading font-bold text-primary text-base">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="p-4 rounded-lg border border-border">
                <h3 className="font-heading font-bold text-primary text-sm mb-3">Purchased Items</h3>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-medium text-primary">{item.productName}</p>
                        <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download Links */}
              {order.downloadLinks.length > 0 && (
                <div className="p-4 rounded-lg border border-border">
                  <h3 className="font-heading font-bold text-primary text-sm mb-3">Download Links</h3>
                  <div className="space-y-2">
                    {order.downloadLinks.map((link, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-md bg-section text-sm">
                        <div>
                          <p className="font-medium text-primary">{link.productName}</p>
                          <p className="text-xs text-text-muted">
                            {link.downloadCount} / {link.downloadCount + link.remainingDownloads} downloads
                          </p>
                        </div>
                        <Badge variant={link.status === 'active' ? 'success' : 'error'}>
                          {link.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="ghost"><Mail className="w-4 h-4" /> Resend</Button>
                    <Button size="sm" variant="ghost"><RefreshCw className="w-4 h-4" /> Reset</Button>
                  </div>
                </div>
              )}

              {/* Notes */}
              {order.notes && (
                <div className="p-4 rounded-lg border border-border">
                  <h3 className="font-heading font-bold text-primary text-sm mb-2">Notes</h3>
                  <p className="text-sm text-text-secondary">{order.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" fullWidth>
                  <Printer className="w-4 h-4" /> Print Invoice
                </Button>
                <Button variant="outline" size="sm" fullWidth>
                  <FileText className="w-4 h-4" /> Download PDF
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
