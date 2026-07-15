import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
  hideOn?: 'sm' | 'md' | 'lg';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  emptyMessage?: string;
  loading?: boolean;
}

export function DataTable<T>({
  columns, data, keyExtractor, onRowClick,
  searchable = true, searchPlaceholder = 'Search...',
  pageSize = 10, emptyMessage = 'No data found', loading,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);

  const filtered = data.filter(item => {
    if (!search) return true;
    const q = search.toLowerCase();
    return columns.some(col => {
      const val = (item as any)[col.key];
      return val && String(val).toLowerCase().includes(q);
    });
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = (a as any)[sortKey];
    const bVal = (b as any)[sortKey];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return sortDir === 'asc'
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="rounded-lg border border-border bg-white overflow-hidden">
      {searchable && (
        <div className="p-4 border-b border-border">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-section text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-section/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => {
                    if (col.sortable) {
                      if (sortKey === col.key) {
                        setSortDir(d => d === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortKey(col.key);
                        setSortDir('asc');
                      }
                    }
                  }}
                  className={cn(
                    'text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider',
                    col.sortable && 'cursor-pointer hover:text-primary select-none',
                    col.hideOn === 'sm' && 'hidden sm:table-cell',
                    col.hideOn === 'md' && 'hidden md:table-cell',
                    col.hideOn === 'lg' && 'hidden lg:table-cell',
                    col.className
                  )}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12">
                  <div className="flex items-center justify-center gap-2 text-text-muted">
                    <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12">
                  <p className="text-text-muted">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              paginated.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    'border-b border-border last:border-0 transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-section/50'
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 py-3 text-sm',
                        col.hideOn === 'sm' && 'hidden sm:table-cell',
                        col.hideOn === 'md' && 'hidden md:table-cell',
                        col.hideOn === 'lg' && 'hidden lg:table-cell'
                      )}
                    >
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-text-muted">
            Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-md hover:bg-section disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  'w-8 h-8 rounded-md text-sm font-semibold transition-colors',
                  p === page ? 'bg-primary text-white' : 'hover:bg-section text-text-secondary'
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-md hover:bg-section disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
