import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, Download, ChevronDown } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { formatPrice, cn } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

const statusColors = {
  completed: 'success' as const,
  pending: 'warning' as const,
  failed: 'error' as const,
  processing: 'primary' as const,
  refunded: 'default' as const,
  cancelled: 'error' as const,
};

const paymentStatusColors = {
  completed: 'success' as const,
  pending: 'warning' as const,
  failed: 'error' as const,
  refunded: 'default' as const,
};

export function AdminOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const orders = useQuery(api.orders.list, {});
  const updateOrderStatus = useMutation(api.orders.updateStatus);

  if (orders === undefined) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const filtered = orders.filter(o =>
    o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = async (id: string, orderStatus: 'processing' | 'completed' | 'cancelled') => {
    await updateOrderStatus({ id: id as any, orderStatus });
    toast.success(`Order status changed to ${orderStatus}`);
  };

  const handlePaymentChange = async (id: string, paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded') => {
    await updateOrderStatus({ id: id as any, paymentStatus });
    toast.success(`Payment status changed to ${paymentStatus}`);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Orders</h1>
          <p className="text-sm text-text-muted">{filtered.length} orders</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-60 pl-10 pr-4 py-2 rounded-md border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
            />
          </div>
          <Button variant="ghost" size="sm"><Filter className="w-4 h-4" /> Filter</Button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-section/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Order</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase hidden sm:table-cell">Customer</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Products</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase hidden md:table-cell">Total</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Payment</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Status</th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((order, idx) => (
              <motion.tr
                key={order._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
                className="border-b border-border last:border-0 hover:bg-section/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <p className="text-sm font-semibold text-primary">{order.orderNumber}</p>
                  <p className="text-xs text-text-muted">{new Date(order._creationTime).toLocaleDateString()}</p>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <p className="text-sm font-medium text-primary">{order.customer.name}</p>
                  <p className="text-xs text-text-muted">{order.customer.email}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-primary">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                  <p className="text-xs text-text-muted truncate max-w-[120px]">{order.items.map(i => i.productName).join(', ')}</p>
                </td>
                <td className="px-4 py-3 text-sm font-semibold hidden md:table-cell">{formatPrice(order.total)}</td>
                <td className="px-4 py-3">
                  <div className="relative inline-block">
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => handlePaymentChange(order._id, e.target.value as any)}
                      className={cn(
                        'appearance-none text-xs font-medium px-2.5 py-1 rounded-full border pr-6 cursor-pointer focus:outline-none focus:ring-2',
                        order.paymentStatus === 'completed' ? 'bg-success/10 text-success border-success/20' :
                        order.paymentStatus === 'pending' ? 'bg-warning/10 text-warning border-warning/20' :
                        order.paymentStatus === 'failed' ? 'bg-error/10 text-error border-error/20' :
                        'bg-section text-text-secondary border-border'
                      )}
                      aria-label="Change payment status"
                    >
                      <option value="pending">pending</option>
                      <option value="completed">completed</option>
                      <option value="failed">failed</option>
                      <option value="refunded">refunded</option>
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="relative inline-block">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value as any)}
                      className={cn(
                        'appearance-none text-xs font-medium px-2.5 py-1 rounded-full border pr-6 cursor-pointer focus:outline-none focus:ring-2',
                        order.orderStatus === 'completed' ? 'bg-success/10 text-success border-success/20' :
                        order.orderStatus === 'processing' ? 'bg-primary/10 text-primary border-primary/20' :
                        order.orderStatus === 'cancelled' ? 'bg-error/10 text-error border-error/20' :
                        'bg-warning/10 text-warning border-warning/20'
                      )}
                      aria-label="Change order status"
                    >
                      <option value="pending">pending</option>
                      <option value="processing">processing</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded hover:bg-section"><Eye className="w-4 h-4 text-text-muted" /></button>
                    <button className="p-1.5 rounded hover:bg-section"><Download className="w-4 h-4 text-text-muted" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
