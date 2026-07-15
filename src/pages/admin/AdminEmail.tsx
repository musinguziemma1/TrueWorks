import { motion } from 'framer-motion';
import { Send, Users, TrendingUp, BarChart3, Plus, Mail, Settings, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Section } from '../../components/ui/Section';

const campaigns = [
  { name: 'New Template Release - Hospital Dashboard', sent: 128, opens: 64, clicks: 28, status: 'sent', date: '2 days ago' },
  { name: 'Monthly Newsletter - June 2025', sent: 115, opens: 47, clicks: 19, status: 'sent', date: '1 week ago' },
  { name: 'Free Template Download Promotion', sent: 0, opens: 0, clicks: 0, status: 'draft', date: 'Not sent' },
  { name: 'Customer Feedback Survey', sent: 95, opens: 52, clicks: 31, status: 'sent', date: '2 weeks ago' },
];

export function AdminEmail() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Email Marketing</h1>
          <p className="text-sm text-text-muted">Manage campaigns and subscriber communications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm"><Settings className="w-4 h-4" /> Settings</Button>
          <Button size="sm"><Plus className="w-4 h-4" /> New Campaign</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Subscribers', value: '128', icon: Users, trend: '+5 this month' },
          { label: 'Open Rate', value: '52%', icon: TrendingUp, trend: '+3%' },
          { label: 'Click Rate', value: '28%', icon: BarChart3, trend: '+2%' },
          { label: 'Campaigns Sent', value: '3', icon: Send, trend: '+2 this month' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-lg border border-border bg-white">
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs text-text-muted">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-text-muted" />
            </div>
            <p className="font-heading text-xl font-bold text-primary">{stat.value}</p>
            <span className="text-xs text-success">{stat.trend}</span>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-white overflow-hidden mb-6">
        <div className="p-4 border-b border-border">
          <h3 className="font-heading font-bold text-primary">Recent Campaigns</h3>
        </div>
        <div className="divide-y divide-border">
          {campaigns.map((camp, idx) => (
            <motion.div
              key={camp.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 hover:bg-section/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-primary">{camp.name}</p>
                  <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                    <span>{camp.date}</span>
                    <span>·</span>
                    <span>{camp.sent > 0 ? `${camp.sent} recipients` : 'Not sent'}</span>
                  </div>
                </div>
                <Badge variant={camp.status === 'sent' ? 'success' : 'warning'}>{camp.status}</Badge>
              </div>
              {camp.sent > 0 && (
                <div className="flex gap-4 text-xs text-text-secondary">
                  <span>Opens: {camp.opens} ({Math.round(camp.opens/camp.sent*100)}%)</span>
                  <span>Clicks: {camp.clicks} ({Math.round(camp.clicks/camp.sent*100)}%)</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-lg border border-border bg-white">
        <h3 className="font-heading font-bold text-primary mb-3">Quick Actions</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Mail className="w-4 h-4" /> Create Newsletter</Button>
          <Button variant="outline" size="sm"><Users className="w-4 h-4" /> Manage Segments</Button>
          <Button variant="outline" size="sm"><Eye className="w-4 h-4" /> View Templates</Button>
        </div>
      </div>
    </div>
  );
}
