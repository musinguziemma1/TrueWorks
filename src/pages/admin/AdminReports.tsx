import { useState } from 'react';
import { FileSpreadsheet, Download, BarChart3, TrendingUp, Users, ShoppingCart, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion';

const reports = [
  { title: 'Sales Report', description: 'Complete sales data with product-level breakdown', icon: ShoppingCart, date: 'Monthly' },
  { title: 'Revenue Summary', description: 'Revenue analysis with trends and projections', icon: TrendingUp, date: 'Monthly' },
  { title: 'Product Performance', description: 'Best and worst selling products analysis', icon: BarChart3, date: 'Weekly' },
  { title: 'Customer Report', description: 'Customer acquisition, retention, and LTV analysis', icon: Users, date: 'Monthly' },
  { title: 'Downloads Report', description: 'Digital download tracking and usage metrics', icon: Download, date: 'Weekly' },
  { title: 'Tax Summary', description: 'Tax liability report for accounting and compliance', icon: FileSpreadsheet, date: 'Quarterly' },
  { title: 'Coupon Performance', description: 'Coupon usage, redemption rates, and discount analysis', icon: TrendingUp, date: 'Monthly' },
  { title: 'Marketing Report', description: 'Campaign performance and channel attribution', icon: BarChart3, date: 'Monthly' },
];

export function AdminReports() {
  const [selectedRange, setSelectedRange] = useState('This Month');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Reports</h1>
          <p className="text-sm text-text-muted">Generate and download business reports</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="px-3 py-2 rounded-md border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
          >
            {['Today', 'This Week', 'This Month', 'This Quarter', 'This Year', 'Custom'].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {reports.map((report, idx) => (
          <motion.div
            key={report.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className="p-5 rounded-lg border border-border bg-white hover:shadow-card-hover transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center mb-3">
              <report.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-primary mb-1">{report.title}</h3>
            <p className="text-xs text-text-secondary mb-3">{report.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-text-muted font-semibold uppercase">{report.date}</span>
              <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Download className="w-3.5 h-3.5" /> Export
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
