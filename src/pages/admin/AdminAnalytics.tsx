import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingCart, Download, Globe, Smartphone, Monitor, Watch } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const trafficSources = [
  { name: 'Direct', value: 35, color: '#0B2545' },
  { name: 'Google', value: 28, color: '#4A6FA5' },
  { name: 'Social Media', value: 18, color: '#C9A227' },
  { name: 'Email', value: 12, color: '#2E7D32' },
  { name: 'Referral', value: 7, color: '#94A3B8' },
];

const deviceData = [
  { name: 'Mobile', users: 65, icon: Smartphone },
  { name: 'Desktop', users: 25, icon: Monitor },
  { name: 'Tablet', users: 10, icon: Watch },
];

const funnelData = [
  { stage: 'Visitors', count: 2500 },
  { stage: 'Product Views', count: 850 },
  { stage: 'Add to Cart', count: 320 },
  { stage: 'Checkout', count: 180 },
  { stage: 'Purchase', count: 95 },
];

export function AdminAnalytics() {
  const monthlyRevenue = useQuery(api.analytics.getMonthlyRevenue);
  const paymentMethods = useQuery(api.analytics.getPaymentMethodStats);

  if (monthlyRevenue === undefined || paymentMethods === undefined) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-primary">Analytics</h1>
        <p className="text-sm text-text-muted">Detailed business intelligence and performance metrics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Visitors', value: '12,450', icon: Users, trend: '+12%' },
          { label: 'Page Views', value: '38,200', icon: Globe, trend: '+8%' },
          { label: 'Bounce Rate', value: '32%', icon: TrendingUp, trend: '-3%', positive: false },
          { label: 'Avg. Session', value: '4m 32s', icon: Watch, trend: '+5%' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-lg border border-border bg-white">
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs text-text-muted">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-text-muted" />
            </div>
            <p className="font-heading text-xl font-bold text-primary">{stat.value}</p>
            <span className={`text-xs font-semibold ${stat.trend?.startsWith('+') ? 'text-success' : 'text-error'}`}>{stat.trend}</span>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-lg border border-border bg-white">
          <h3 className="font-heading font-bold text-primary mb-4">Monthly Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#4A6FA5" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-lg border border-border bg-white">
          <h3 className="font-heading font-bold text-primary mb-4">Traffic Sources</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={trafficSources} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" nameKey="name">
                  {trafficSources.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {trafficSources.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-text-secondary">{s.name}</span>
                <span className="ml-auto font-semibold">{s.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-lg border border-border bg-white">
          <h3 className="font-heading font-bold text-primary mb-4">Visitor Funnel</h3>
          <div className="space-y-3">
            {funnelData.map((stage, idx) => (
              <div key={stage.stage}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-secondary">{stage.stage}</span>
                  <span className="font-semibold">{stage.count.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full bg-section overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-accent to-secondary" style={{ width: `${(stage.count / funnelData[0].count) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 rounded-lg border border-border bg-white">
          <h3 className="font-heading font-bold text-primary mb-4">Device Analytics</h3>
          <div className="space-y-4">
            {deviceData.map((device) => (
              <div key={device.name} className="flex items-center gap-4 p-4 rounded-lg bg-section">
                <device.icon className="w-8 h-8 text-primary" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-primary">{device.name}</span>
                    <span className="font-bold text-primary">{device.users}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${device.users}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
