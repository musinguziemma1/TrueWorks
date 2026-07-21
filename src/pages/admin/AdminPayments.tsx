import { useState } from 'react';
import { Search, CreditCard, Smartphone, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useAdminQuery } from '../../hooks/useAdminQuery';
import { api } from '../../../convex/_generated/api';
import { formatPrice } from '../../lib/utils';
import { Badge } from '../../components/ui/Badge';
import { DataTable, Column } from '../../components/admin/DataTable';

interface PaymentRow {
  id: string; order: string; amount: number; method: string;
  reference: string; status: string; date: string;
}

const methodIcons: Record<string, React.ElementType> = {
  mtn_momo: Smartphone, airtel_money: Smartphone, visa: CreditCard, mastercard: CreditCard, pesapal: CreditCard,
};

export function AdminPayments() {
  const payments = useAdminQuery(api.payments.list, {});
  const stats = useAdminQuery(api.payments.getStats);

  if (payments === undefined || stats === undefined) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const columns: Column<PaymentRow>[] = [
    { key: 'order', label: 'Order', render: (p) => <span className="font-semibold text-primary">{p.order}</span> },
    {
      key: 'method', label: 'Method',
      render: (p) => {
        const Icon = methodIcons[p.method] || CreditCard;
        return <div className="flex items-center gap-2"><Icon className="w-4 h-4 text-text-muted" /><span className="capitalize">{p.method.replace(/_/g, ' ')}</span></div>;
      },
    },
    { key: 'reference', label: 'Reference', className: 'hidden md:table-cell', render: (p) => <span className="text-xs font-mono text-text-muted">{p.reference}</span> },
    { key: 'amount', label: 'Amount', sortable: true, render: (p) => <span className="font-semibold">{formatPrice(p.amount)}</span> },
    { key: 'status', label: 'Status', render: (p) => <Badge variant={p.status === 'completed' ? 'success' : p.status === 'failed' ? 'error' : 'warning'}>{p.status}</Badge> },
  ];

  const rows: PaymentRow[] = (payments ?? []).map(p => ({
    id: p._id,
    order: p.orderNumber,
    amount: p.amount,
    method: p.method,
    reference: p.reference,
    status: p.status,
    date: new Date(p._creationTime).toLocaleDateString(),
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Payments</h1>
          <p className="text-sm text-text-muted">Transaction management and settlement tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg border border-border bg-white">
          <p className="text-xs text-text-muted">Total Collected</p>
          <p className="font-heading text-xl font-bold text-primary mt-1">{formatPrice(stats?.totalRevenue ?? 0)}</p>
        </div>
        <div className="p-4 rounded-lg border border-border bg-white">
          <p className="text-xs text-text-muted">Successful</p>
          <div className="flex items-center gap-2 mt-1"><CheckCircle className="w-4 h-4 text-success" /><span className="font-heading text-xl font-bold text-success">{stats?.completed ?? 0}</span></div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-white">
          <p className="text-xs text-text-muted">Failed</p>
          <div className="flex items-center gap-2 mt-1"><XCircle className="w-4 h-4 text-error" /><span className="font-heading text-xl font-bold text-error">{stats?.failed ?? 0}</span></div>
        </div>
        <div className="p-4 rounded-lg border border-border bg-white">
          <p className="text-xs text-text-muted">Pending</p>
          <div className="flex items-center gap-2 mt-1"><AlertCircle className="w-4 h-4 text-warning" /><span className="font-heading text-xl font-bold text-warning">{stats?.pending ?? 0}</span></div>
        </div>
      </div>

      <DataTable columns={columns} data={rows} keyExtractor={(p) => p.id} searchPlaceholder="Search transactions..." />
    </div>
  );
}
