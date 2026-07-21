import { useState, useMemo } from 'react';
import { Search, Download, RefreshCw, Clock, Link, ExternalLink, Filter } from 'lucide-react';
import { useAdminQuery } from '../../hooks/useAdminQuery';
import { api } from '../../../convex/_generated/api';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { DataTable, Column } from '../../components/admin/DataTable';

interface DownloadRecord {
  id: string;
  product: string;
  customer: string;
  count: number;
  remaining: number;
  expiry: string;
  status: 'active' | 'expired' | 'disabled';
}

export function AdminDownloads() {
  const downloads = useAdminQuery(api.downloads.list, {});
  const stats = useAdminQuery(api.downloads.getStats);
  const products = useAdminQuery(api.products.list, {});

  const records: DownloadRecord[] = useMemo(() => {
    if (!downloads || !products) return [];
    return downloads.map(d => {
      const product = products.find(p => p._id === d.productId);
      return {
        id: d._id,
        product: product?.name || 'Unknown Product',
        customer: 'Customer',
        count: d.downloadCount,
        remaining: d.remainingDownloads,
        expiry: new Date(d.expiryDate).toLocaleDateString(),
        status: d.status,
      };
    });
  }, [downloads, products]);

  if (downloads === undefined || stats === undefined || products === undefined) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const columns: Column<DownloadRecord>[] = [
    { key: 'product', label: 'Product', render: (d) => <span className="font-medium text-primary">{d.product}</span> },
    { key: 'customer', label: 'Customer', className: 'hidden sm:table-cell' },
    { key: 'count', label: 'Downloads', sortable: true, render: (d) => <span>{d.count}/{d.count + d.remaining}</span> },
    { key: 'expiry', label: 'Expires', className: 'hidden md:table-cell' },
    { key: 'status', label: 'Status', render: (d) => <Badge variant={d.status === 'active' ? 'success' : 'error'}>{d.status}</Badge> },
    {
      key: 'actions', label: '',
      render: () => (
        <div className="flex gap-1">
          <button className="p-1.5 rounded hover:bg-section"><RefreshCw className="w-4 h-4 text-text-muted" /></button>
          <button className="p-1.5 rounded hover:bg-section"><Link className="w-4 h-4 text-text-muted" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Downloads</h1>
          <p className="text-sm text-text-muted">Track and manage digital downloads</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm"><Filter className="w-4 h-4" /> Filter</Button>
          <Button variant="outline" size="sm"><Download className="w-4 h-4" /> Export</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg border border-border bg-white">
          <p className="text-xs text-text-muted">Total Downloads</p>
          <p className="font-heading text-2xl font-bold text-primary mt-1">{stats.totalDownloads.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-lg border border-border bg-white">
          <p className="text-xs text-text-muted">Active Links</p>
          <p className="font-heading text-2xl font-bold text-success mt-1">{stats.active}</p>
        </div>
        <div className="p-4 rounded-lg border border-border bg-white">
          <p className="text-xs text-text-muted">Expired Links</p>
          <p className="font-heading text-2xl font-bold text-warning mt-1">{stats.expired}</p>
        </div>
        <div className="p-4 rounded-lg border border-border bg-white">
          <p className="text-xs text-text-muted">Active Downloads</p>
          <p className="font-heading text-2xl font-bold text-primary mt-1">{stats.activeDownloads}</p>
        </div>
      </div>
      <DataTable columns={columns} data={records} keyExtractor={(d) => d.id} searchPlaceholder="Search downloads..." />
    </div>
  );
}
