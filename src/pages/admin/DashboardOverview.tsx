import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Download, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { formatPrice } from '../../lib/utils';

const COLORS = ['#C9A227', '#4A6FA5', '#0B2545'];

export function DashboardOverview() {
  const dashboardData = useQuery(api.analytics.getDashboardData);
  const salesTrends = useQuery(api.analytics.getSalesTrends);
  const monthlyRevenue = useQuery(api.analytics.getMonthlyRevenue);
  const paymentMethods = useQuery(api.analytics.getPaymentMethodStats);

  if (dashboardData === undefined || salesTrends === undefined || monthlyRevenue === undefined || paymentMethods === undefined) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const kpiCards = [
    { label: 'Total Revenue', value: formatPrice(dashboardData.totalRevenue), icon: DollarSign, trend: { value: '12.5%', positive: true } },
    { label: 'Revenue Today', value: formatPrice(dashboardData.revenueToday), icon: TrendingUp, trend: { value: '8.2%', positive: true } },
    { label: 'Total Orders', value: dashboardData.totalOrders.toString(), icon: ShoppingCart, trend: { value: '25%', positive: true } },
    { label: 'Pending Orders', value: dashboardData.pendingOrders.toString(), icon: Activity, trend: { value: '1', positive: false } },
    { label: 'Products Sold', value: dashboardData.productsSold.toString(), icon: TrendingUp, trend: { value: '33%', positive: true } },
    { label: 'Active Customers', value: dashboardData.activeCustomers.toString(), icon: Users, trend: { value: '20%', positive: true } },
    { label: 'Total Downloads', value: dashboardData.totalDownloads.toString(), icon: Download, trend: { value: '50%', positive: true } },
    { label: 'Avg Order Value', value: formatPrice(dashboardData.averageOrderValue), icon: DollarSign, trend: { value: '5.3%', positive: true } },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Dashboard</h1>
          <p className="text-sm text-text-muted">Store Performance Overview</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span>All time</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="p-4 rounded-lg border border-border bg-white hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-text-muted uppercase tracking-wider">{kpi.label}</span>
                <Icon className="w-4 h-4 text-text-muted" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-xl font-bold text-primary">{kpi.value}</span>
                {kpi.trend && (
                  <span className={`text-xs font-semibold flex items-center gap-0.5 ${kpi.trend.positive ? 'text-success' : 'text-error'}`}>
                    {kpi.trend.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {kpi.trend.value}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-lg border border-border bg-white"
        >
          <h3 className="font-heading font-bold text-primary mb-4">Revenue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '6px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.06)' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#C9A227" strokeWidth={2} dot={{ fill: '#C9A227' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Monthly Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-lg border border-border bg-white"
        >
          <h3 className="font-heading font-bold text-primary mb-4">Monthly Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '6px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.06)' }}
                />
                <Bar dataKey="revenue" fill="#4A6FA5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-lg border border-border bg-white"
        >
          <h3 className="font-heading font-bold text-primary mb-4">Payment Methods</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentMethods} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="percentage" nameKey="name">
                  {paymentMethods.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {paymentMethods.map((pm, idx) => (
              <div key={pm.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                  <span>{pm.name}</span>
                </div>
                <span className="font-semibold">{pm.percentage}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-lg border border-border bg-white"
        >
          <h3 className="font-heading font-bold text-primary mb-4">Store Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">Conversion Rate</span>
                <span className="font-semibold">{dashboardData.conversionRate}%</span>
              </div>
              <div className="h-2 rounded-full bg-section overflow-hidden">
                <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${dashboardData.conversionRate * 10}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">Performance Score</span>
                <span className="font-semibold">{dashboardData.storePerformanceScore}%</span>
              </div>
              <div className="h-2 rounded-full bg-section overflow-hidden">
                <div className="h-full rounded-full bg-success transition-all" style={{ width: `${dashboardData.storePerformanceScore}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">Newsletter Subscribers</span>
                <span className="font-semibold">{dashboardData.newsletterSubscribers}</span>
              </div>
              <div className="h-2 rounded-full bg-section overflow-hidden">
                <div className="h-full rounded-full bg-secondary transition-all" style={{ width: '42%' }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-lg border border-border bg-white"
        >
          <h3 className="font-heading font-bold text-primary mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { text: 'New order from Grace Akello', time: '2 hours ago', type: 'order' },
              { text: 'Hospital KPI Dashboard downloaded', time: '4 hours ago', type: 'download' },
              { text: 'New customer registered', time: '6 hours ago', type: 'customer' },
              { text: 'Payment received via Airtel Money', time: '8 hours ago', type: 'payment' },
              { text: 'Product review submitted', time: '12 hours ago', type: 'review' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-primary">{activity.text}</p>
                  <p className="text-xs text-text-muted">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
