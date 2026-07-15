import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    status: v.optional(v.union(v.literal("pending"), v.literal("completed"), v.literal("failed"), v.literal("refunded"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let payments = await ctx.db.query("payments").collect();
    if (args.status) payments = payments.filter(p => p.status === args.status);
    payments.sort((a, b) => b._creationTime - a._creationTime);
    if (args.limit) payments = payments.slice(0, args.limit);
    return payments;
  },
});

export const getById = query({
  args: { id: v.id("payments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByOrder = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .collect();
  },
});

export const create = mutation({
  args: {
    orderId: v.id("orders"),
    orderNumber: v.string(),
    amount: v.number(),
    method: v.union(
      v.literal("mtn_momo"),
      v.literal("airtel_money"),
      v.literal("visa"),
      v.literal("mastercard"),
      v.literal("pesapal")
    ),
    reference: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("payments", { ...args, status: "pending" });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("payments"),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed"), v.literal("refunded")),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    return await ctx.db.get(id);
  },
});

export const getStats = query({
  handler: async (ctx) => {
    const payments = await ctx.db.query("payments").collect();
    const completed = payments.filter(p => p.status === "completed");
    const totalRevenue = completed.reduce((sum, p) => sum + p.amount, 0);

    const methodMap = new Map<string, number>();
    for (const p of completed) {
      methodMap.set(p.method, (methodMap.get(p.method) || 0) + 1);
    }

    return {
      total: payments.length,
      completed: completed.length,
      pending: payments.filter(p => p.status === "pending").length,
      failed: payments.filter(p => p.status === "failed").length,
      refunded: payments.filter(p => p.status === "refunded").length,
      totalRevenue,
      averageValue: completed.length > 0 ? Math.round(totalRevenue / completed.length) : 0,
      byMethod: Array.from(methodMap.entries()).map(([method, count]) => ({ method, count })),
    };
  },
});
