import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const initiatePayment = mutation({
  args: {
    orderId: v.id("orders"),
    amount: v.number(),
    email: v.string(),
    phone: v.optional(v.string()),
    firstName: v.string(),
    lastName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    const trackingId = `PESAPAL-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    await ctx.db.insert("payments", {
      orderId: args.orderId,
      orderNumber: order.orderNumber,
      amount: args.amount,
      method: order.paymentMethod,
      status: "pending",
      reference: trackingId,
    });

    await ctx.db.patch(args.orderId, { paymentStatus: "pending" });

    await ctx.db.insert("notifications", {
      title: "Payment Initiated",
      message: `Payment ${trackingId} for order ${order.orderNumber}`,
      type: "payment",
      read: false,
    });

    return { trackingId, paymentUrl: `/checkout/payment/${trackingId}` };
  },
});

export const confirmPayment = mutation({
  args: {
    trackingId: v.string(),
    status: v.union(v.literal("completed"), v.literal("failed"), v.literal("pending")),
    transactionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const payments = await ctx.db
      .query("payments")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    const payment = payments.find(p => p.reference === args.trackingId);
    if (!payment) throw new Error("Payment not found");

    await ctx.db.patch(payment._id, {
      status: args.status,
      ...(args.transactionId ? { reference: args.transactionId } : {}),
    });

    const order = await ctx.db.get(payment.orderId);
    if (!order) return { success: true };

    if (args.status === "completed") {
      await ctx.db.patch(payment.orderId, {
        paymentStatus: "completed",
        orderStatus: "processing",
      });

      const downloadLinks = order.items.map(item => {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        return {
          productId: item.productId,
          productName: item.productName,
          url: `/api/download/${payment.orderId}/${item.productId}`,
          downloadCount: 0,
          remainingDownloads: 5,
          expiryDate: expiryDate.toISOString(),
          status: "active" as const,
        };
      });

      await ctx.db.patch(payment.orderId, { downloadLinks });

      for (const link of downloadLinks) {
        await ctx.db.insert("downloads", {
          productId: link.productId,
          customerId: order.customerId,
          orderId: payment.orderId,
          downloadCount: 0,
          remainingDownloads: 5,
          expiryDate: link.expiryDate,
          status: "active",
        });
      }

      const customer = await ctx.db.get(order.customerId);
      if (customer) {
        await ctx.db.patch(order.customerId, {
          totalOrders: customer.totalOrders + 1,
          lifetimeValue: customer.lifetimeValue + order.total,
          totalDownloads: customer.totalDownloads + downloadLinks.length,
        });
      }

      await ctx.db.insert("notifications", {
        title: "Payment Completed",
        message: `Payment confirmed for order ${order.orderNumber}`,
        type: "payment",
        read: false,
      });
    } else if (args.status === "failed") {
      await ctx.db.patch(payment.orderId, { paymentStatus: "failed" });
      await ctx.db.insert("notifications", {
        title: "Payment Failed",
        message: `Payment failed for order ${order.orderNumber}`,
        type: "payment",
        read: false,
      });
    }

    return { success: true };
  },
});

export const getPaymentStatus = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const payments = await ctx.db
      .query("payments")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .collect();
    return payments[payments.length - 1] || null;
  },
});
