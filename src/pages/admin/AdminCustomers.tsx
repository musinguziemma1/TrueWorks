import { useAdminQuery } from '../../hooks/useAdminQuery';
import { api } from '../../../convex/_generated/api';
import { formatDate, formatPrice } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useState } from 'react';

export function AdminCustomers() {
  const [query, setQuery] = useState('');
  const customers = useAdminQuery(api.customers.list, {});

  if (customers === undefined) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const filtered = (customers ?? []).filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Customers</h1>
          <p className="text-sm text-text-muted">{filtered.length} customers</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input type="text" placeholder="Search customers..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-60 pl-10 pr-4 py-2 rounded-md border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary" />
        </div>
      </div>
      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-section/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Customer</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase hidden md:table-cell">Company</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase hidden sm:table-cell">Orders</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">LTV</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase hidden lg:table-cell">Since</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Newsletter</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, idx) => (
              <motion.tr key={c._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }} className="border-b border-border last:border-0 hover:bg-section/50 transition-colors cursor-pointer">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-secondary to-primary flex items-center justify-center text-white text-sm font-bold">{c.name.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                      <p className="text-sm font-semibold text-primary">{c.name}</p>
                      <p className="text-xs text-text-muted">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary hidden md:table-cell">{c.company || '-'}</td>
                <td className="px-4 py-3 text-sm text-text-secondary hidden sm:table-cell">{c.totalOrders}</td>
                <td className="px-4 py-3 text-sm font-semibold">{formatPrice(c.lifetimeValue)}</td>
                <td className="px-4 py-3 text-sm text-text-muted hidden lg:table-cell">{formatDate(new Date(c._creationTime))}</td>
                <td className="px-4 py-3"><Badge variant={c.newsletter ? 'success' : 'default'} size="sm">{c.newsletter ? 'Subscribed' : 'Unsubscribed'}</Badge></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
