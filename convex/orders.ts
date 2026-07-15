import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const list = query({
  args: {
    status: v.optional(v.union(v.literal("processing"), v.literal("completed"), v.literal("cancelled"))),
    paymentStatus: v.optional(v.union(v.literal("pending"), v.literal("completed"), v.literal("failed"), v.literal("refunded"))),
    customerId: v.optional(v.id("customers")),
    search: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let orders = await ctx.db.query("orders").collect();

    if (args.status) orders = orders.filter(o => o.orderStatus === args.status);
    if (args.paymentStatus) orders = orders.filter(o => o.paymentStatus === args.paymentStatus);
    if (args.customerId) orders = orders.filter(o => o.customerId === args.customerId);
    if (args.search) {
      const q = args.search.toLowerCase();
      orders = orders.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q)
      );
    }

    orders.sort((a, b) => b._creationTime - a._creationTime);
    if (args.limit) orders = orders.slice(0, args.limit);
    return orders;
  },
});

export const getById = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByOrderNumber = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_orderNumber", (q) => q.eq("orderNumber", args.orderNumber))
      .first();
  },
});

export const create = mutation({
  args: {
    customerId: v.id("customers"),
    customer: v.object({ name: v.string(), email: v.string(), phone: v.optional(v.string()) }),
    items: v.array(v.object({
      productId: v.id("products"),
      productName: v.string(),
      quantity: v.number(),
      price: v.number(),
    })),
    subtotal: v.number(),
    total: v.number(),
    discount: v.optional(v.number()),
    coupon: v.optional(v.string()),
    paymentMethod: v.union(v.literal("mtn_momo"), v.literal("airtel_money"), v.literal("visa"), v.literal("mastercard"), v.literal("pesapal")),
  },
  handler: async (ctx, args) => {
    const orderNumber = `TW-${new Date().getFullYear()}-${String(await ctx.db.query("orders").collect().then(o => o.length + 1)).padStart(4, "0")}`;

    const orderId = await ctx.db.insert("orders", {
      ...args,
      orderNumber,
      paymentStatus: "pending",
      orderStatus: "processing",
      downloadLinks: [],
    });

    // Update sales count for purchased products
    for (const item of args.items) {
      const product = await ctx.db.get(item.productId);
      if (product) {
        await ctx.db.patch(item.productId, { salesCount: product.salesCount + item.quantity });
      }
    }

    return orderId;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    orderStatus: v.optional(v.union(v.literal("processing"), v.literal("completed"), v.literal("cancelled"))),
    paymentStatus: v.optional(v.union(v.literal("pending"), v.literal("completed"), v.literal("failed"), v.literal("refunded"))),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    return await ctx.db.get(id);
  },
});

export const addDownloadLink = mutation({
  args: {
    orderId: v.id("orders"),
    productId: v.id("products"),
    productName: v.string(),
    url: v.string(),
    downloadLimit: v.number(),
    expiryDays: v.number(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + args.expiryDays);

    const newLink = {
      productId: args.productId,
      productName: args.productName,
      url: args.url,
      downloadCount: 0,
      remainingDownloads: args.downloadLimit,
      expiryDate: expiryDate.toISOString(),
      status: "active" as const,
    };

    await ctx.db.patch(args.orderId, {
      downloadLinks: [...order.downloadLinks, newLink],
    });
  },
});

export const resendDownloadLink = mutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    // In production, this would trigger an email send
    // For now, we just return the download links
    return order.downloadLinks;
  },
});

export const resetDownloads = mutation({
  args: {
    orderId: v.id("orders"),
    productId: v.id("products"),
    newLimit: v.number(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    const updatedLinks = order.downloadLinks.map(link =>
      link.productId === args.productId
        ? { ...link, remainingDownloads: args.newLimit, downloadCount: 0, status: "active" as const }
        : link
    );

    await ctx.db.patch(args.orderId, { downloadLinks: updatedLinks });
  },
});
