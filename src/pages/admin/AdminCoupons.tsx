import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Search, Tag } from 'lucide-react';
import { useAdminQuery } from '../../hooks/useAdminQuery';
import { api } from '../../../convex/_generated/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DataTable, Column } from '../../components/admin/DataTable';

interface CouponRow {
  id: string; code: string; type: string; value: number;
  usage: string; expires: string; active: boolean;
}

export function AdminCoupons() {
  const coupons = useAdminQuery(api.coupons.list);

  const rows: CouponRow[] = useMemo(() => {
    if (!coupons) return [];
    return coupons.map(c => ({
      id: c._id,
      code: c.code,
      type: c.type.charAt(0).toUpperCase() + c.type.slice(1),
      value: c.value,
      usage: `${c.usageCount}/${c.usageLimit}`,
      expires: new Date(c.expiresAt).toLocaleDateString(),
      active: c.active,
    }));
  }, [coupons]);

  const stats = useMemo(() => {
    if (!coupons) return { active: 0, totalUsed: 0, discountGiven: 89000, avgDiscount: 0 };
    const active = coupons.filter(c => c.active);
    const totalUsed = coupons.reduce((s, c) => s + c.usageCount, 0);
    const avgDiscount = active.length > 0 ? Math.round(active.reduce((s, c) => s + c.value, 0) / active.length) : 0;
    return { active: active.length, totalUsed, discountGiven: 89000, avgDiscount };
  }, [coupons]);

  if (coupons === undefined) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const columns: Column<CouponRow>[] = [
    { key: 'code', label: 'Code', render: (c) => (
      <span className="font-mono font-bold text-primary bg-section px-2 py-1 rounded text-sm">{c.code}</span>
    )},
    { key: 'type', label: 'Type', render: (c) => <Badge variant="primary">{c.type}</Badge> },
    { key: 'value', label: 'Value', sortable: true, render: (c) => c.type === 'Percentage' ? `${c.value}%` : `$${c.value.toLocaleString()}` },
    { key: 'usage', label: 'Usage', className: 'hidden sm:table-cell' },
    { key: 'expires', label: 'Expires', className: 'hidden md:table-cell' },
    { key: 'active', label: 'Status', render: (c) => <Badge variant={c.active ? 'success' : 'error'}>{c.active ? 'Active' : 'Inactive'}</Badge> },
    { key: 'actions', label: '', render: () => (
      <div className="flex gap-1">
        <button className="p-1.5 rounded hover:bg-section"><Edit className="w-4 h-4 text-text-muted" /></button>
        <button className="p-1.5 rounded hover:bg-section"><Trash2 className="w-4 h-4 text-text-muted" /></button>
      </div>
    )},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Coupons</h1>
          <p className="text-sm text-text-muted">Create and manage discount coupons</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4" /> New Coupon</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active Coupons', value: stats.active.toString(), color: 'text-success' },
          { label: 'Total Used', value: stats.totalUsed.toString(), color: 'text-primary' },
          { label: 'Coupons Available', value: (coupons ?? []).length.toString(), color: 'text-primary' },
          { label: 'Avg Discount', value: stats.avgDiscount > 0 ? `${stats.avgDiscount}${(coupons ?? [])[0]?.type === 'percentage' ? '%' : ''}` : 'N/A', color: 'text-primary' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-lg border border-border bg-white">
            <p className="text-xs text-text-muted">{stat.label}</p>
            <p className={`font-heading text-xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <DataTable columns={columns} data={rows} keyExtractor={(c) => c.id} searchPlaceholder="Search coupons..." />
    </div>
  );
}
