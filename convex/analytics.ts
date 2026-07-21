import { query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getDashboardData = query({
  handler: async (ctx) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) return null;
    const [orders, products, customers, downloads, payments] = await Promise.all([
      ctx.db.query("orders").collect(),
      ctx.db.query("products").collect(),
      ctx.db.query("customers").collect(),
      ctx.db.query("downloads").collect(),
      ctx.db.query("payments").collect(),
    ]);

    const completedOrders = orders.filter(o => o.paymentStatus === "completed");
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    const revenueToday = completedOrders
      .filter(o => o._creationTime >= todayStart)
      .reduce((sum, o) => sum + o.total, 0);

    const revenueThisMonth = completedOrders
      .filter(o => o._creationTime >= monthStart)
      .reduce((sum, o) => sum + o.total, 0);

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.orderStatus === "processing").length;
    const successfulPayments = payments.filter(p => p.status === "completed").length;
    const productsSold = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);
    const activeProducts = products.filter(p => p.status === "active").length;
    const totalDownloads = downloads.filter(d => d.status === "active").reduce((sum, d) => sum + d.downloadCount, 0);
    const activeCustomers = customers.filter(c => c.totalOrders > 0).length;
    const newsletterSubscribers = customers.filter(c => c.newsletter).length;

    const totalVisitors = orders.length * 30; // approximate
    const conversionRate = totalVisitors > 0 ? (totalOrders / totalVisitors) * 100 : 0;
    const averageOrderValue = completedOrders.length > 0
      ? totalRevenue / completedOrders.length
      : 0;

    return {
      totalRevenue,
      revenueToday,
      revenueThisMonth,
      totalOrders,
      pendingOrders,
      successfulPayments,
      productsSold,
      activeProducts,
      totalDownloads,
      activeCustomers,
      newsletterSubscribers,
      conversionRate: Math.round(conversionRate * 10) / 10,
      averageOrderValue: Math.round(averageOrderValue),
      storePerformanceScore: Math.min(100, Math.round(
        (conversionRate * 20) +
        (activeProducts * 5) +
        (activeCustomers * 10) +
        (newsletterSubscribers > 100 ? 20 : 10)
      )),
    };
  },
});

export const getSalesTrends = query({
  handler: async (ctx) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) return null;
    const orders = await ctx.db.query("orders").collect();
    const completed = orders.filter(o => o.paymentStatus === "completed");

    const monthlyMap = new Map<string, { revenue: number; orders: number }>();

    for (const order of completed) {
      const date = new Date(order._creationTime);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const existing = monthlyMap.get(key) || { revenue: 0, orders: 0 };
      monthlyMap.set(key, {
        revenue: existing.revenue + order.total,
        orders: existing.orders + 1,
      });
    }

    return Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({ date, ...data }));
  },
});

export const getMonthlyRevenue = query({
  handler: async (ctx) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) return null;
    const orders = await ctx.db.query("orders").collect();
    const completed = orders.filter(o => o.paymentStatus === "completed");

    const monthlyMap = new Map<string, number>();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (const order of completed) {
      const date = new Date(order._creationTime);
      const key = months[date.getMonth()];
      monthlyMap.set(key, (monthlyMap.get(key) || 0) + order.total);
    }

    return months.map(month => ({
      month,
      revenue: monthlyMap.get(month) || 0,
    }));
  },
});

export const getProductPerformance = query({
  handler: async (ctx) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) return null;
    const products = await ctx.db.query("products").collect();
    return products
      .filter(p => p.status === "active")
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 10)
      .map(p => ({
        name: p.name,
        sales: p.salesCount,
        revenue: p.salesCount * (p.salePrice || p.price),
      }));
  },
});

export const getPaymentMethodStats = query({
  handler: async (ctx) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) return null;
    const payments = await ctx.db.query("payments").collect();
    const completed = payments.filter(p => p.status === "completed");
    const total = completed.reduce((s, p) => s + p.amount, 0);

    const methodMap = new Map<string, number>();
    for (const payment of completed) {
      methodMap.set(payment.method, (methodMap.get(payment.method) || 0) + payment.amount);
    }

    return Array.from(methodMap.entries()).map(([name, amount]) => ({
      name: name.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
    }));
  },
});

export const getDownloadStats = query({
  handler: async (ctx) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) return null;
    const downloads = await ctx.db.query("downloads").collect();
    const productMap = new Map<string, { downloads: number; productName: string }>();

    for (const d of downloads) {
      const product = await ctx.db.get(d.productId);
      const name = product?.name || "Unknown";
      const existing = productMap.get(d.productId) || { downloads: 0, productName: name };
      productMap.set(d.productId, {
        downloads: existing.downloads + d.downloadCount,
        productName: name,
      });
    }

    return Array.from(productMap.entries())
      .map(([productId, data]) => ({ product: data.productName, downloads: data.downloads }))
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 10);
  },
});
