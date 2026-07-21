import { motion } from 'framer-motion';
import { MessageCircle, Mail, Search, Filter, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { useAdminQuery } from '../../hooks/useAdminQuery';
import { api } from '../../../convex/_generated/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../lib/utils';
import { useState, useMemo } from 'react';

interface Ticket {
  id: string; subject: string; customer: string; email: string;
  status: 'open' | 'pending' | 'resolved' | 'closed'; priority: 'low' | 'medium' | 'high' | 'urgent';
  date: string; messages: number;
}

const statusIcon = { open: AlertCircle, pending: Clock, resolved: CheckCircle, closed: CheckCircle };
const statusColor = { open: 'warning', pending: 'primary', resolved: 'success', closed: 'default' } as const;
const priorityColor = { low: 'default', medium: 'warning', high: 'error', urgent: 'error' } as const;

export function AdminSupport() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const ticketsData = useQuery(api.supportTickets.list, {});
  const updateTicketStatus = useMutation(api.supportTickets.updateStatus);

  const tickets: Ticket[] = useMemo(() => {
    if (!ticketsData) return [];
    return ticketsData.map(t => ({
      id: t._id,
      subject: t.subject,
      customer: t.customerName,
      email: t.customerEmail,
      status: t.status,
      priority: t.priority,
      date: new Date(t._creationTime).toLocaleDateString(),
      messages: 0,
    }));
  }, [ticketsData]);

  if (ticketsData === undefined) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const filtered = tickets.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return !search || t.subject.toLowerCase().includes(search.toLowerCase()) || t.customer.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Support</h1>
          <p className="text-sm text-text-muted">{tickets.filter((t) => t.status !== 'resolved' && t.status !== 'closed').length} unresolved tickets</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input type="text" placeholder="Search tickets..." value={search}
              onChange={(e) => setSearch(e.target.value)} aria-label="Search support tickets"
              className="w-48 pl-10 pr-4 py-2 rounded-md border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20" />
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {['all', 'open', 'pending', 'resolved', 'closed'].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={cn('px-4 py-2 rounded-md text-sm font-semibold capitalize whitespace-nowrap transition-colors',
              statusFilter === s ? 'bg-primary text-white' : 'bg-section text-text-secondary hover:bg-section-alt')}
            aria-pressed={statusFilter === s}>
            {s} {s !== 'all' && `(${tickets.filter((t) => t.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((ticket, idx) => {
          const StatusIcon = statusIcon[ticket.status];
          return (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="p-5 rounded-lg border border-border bg-white hover:shadow-card transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-secondary to-primary flex items-center justify-center text-white text-sm font-bold">
                    {ticket.customer.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">{ticket.subject}</h3>
                    <p className="text-xs text-text-muted">{ticket.customer} · {ticket.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={priorityColor[ticket.priority]} size="sm" className="capitalize">{ticket.priority}</Badge>
                  <span className="group-hover:opacity-100 opacity-0 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-text-muted" />
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-text-muted">
                <StatusIcon className={cn('w-3.5 h-3.5', ticket.status === 'resolved' ? 'text-success' : ticket.status === 'open' ? 'text-warning' : 'text-primary')} />
                <span className="capitalize">{ticket.status}</span>
                <span>·</span>
                <span>{ticket.date}</span>
                <span>·</span>
                <span>{ticket.messages} messages</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
