import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    status: v.optional(v.union(v.literal("active"), v.literal("expired"), v.literal("disabled"))),
    productId: v.optional(v.id("products")),
    customerId: v.optional(v.id("customers")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let downloads = await ctx.db.query("downloads").collect();

    if (args.status) downloads = downloads.filter(d => d.status === args.status);
    if (args.productId) downloads = downloads.filter(d => d.productId === args.productId);
    if (args.customerId) downloads = downloads.filter(d => d.customerId === args.customerId);

    downloads.sort((a, b) => b._creationTime - a._creationTime);
    if (args.limit) downloads = downloads.slice(0, args.limit);
    return downloads;
  },
});

export const getById = query({
  args: { id: v.id("downloads") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const validate = mutation({
  args: { downloadId: v.id("downloads") },
  handler: async (ctx, args) => {
    const download = await ctx.db.get(args.downloadId);
    if (!download) {
      return { valid: false, reason: "Download not found" };
    }

    if (download.status === "disabled") {
      return { valid: false, reason: "This download link has been disabled" };
    }

    if (download.status === "expired") {
      return { valid: false, reason: "This download link has expired" };
    }

    // Check expiry date
    const expiryDate = new Date(download.expiryDate);
    if (expiryDate < new Date()) {
      // Auto-expire the download
      await ctx.db.patch(args.downloadId, { status: "expired" });
      return { valid: false, reason: "This download link has expired" };
    }

    // Check remaining downloads
    if (download.remainingDownloads <= 0) {
      await ctx.db.patch(args.downloadId, { status: "disabled" });
      return { valid: false, reason: "Download limit reached" };
    }

    // Get product info
    const product = await ctx.db.get(download.productId);
    if (!product) {
      return { valid: false, reason: "Product not found" };
    }

    return {
      valid: true,
      download: {
        ...download,
        productName: product.name,
        files: product.downloadableFiles,
      },
    };
  },
});

export const recordDownload = mutation({
  args: { downloadId: v.id("downloads") },
  handler: async (ctx, args) => {
    const download = await ctx.db.get(args.downloadId);
    if (!download) {
      throw new Error("Download not found");
    }

    if (download.status !== "active") {
      throw new Error("This download link is no longer active");
    }

    if (download.remainingDownloads <= 0) {
      await ctx.db.patch(args.downloadId, { status: "disabled" });
      throw new Error("Download limit reached");
    }

    // Check expiry
    const expiryDate = new Date(download.expiryDate);
    if (expiryDate < new Date()) {
      await ctx.db.patch(args.downloadId, { status: "expired" });
      throw new Error("This download link has expired");
    }

    // Increment download count and decrement remaining
    await ctx.db.patch(args.downloadId, {
      downloadCount: download.downloadCount + 1,
      remainingDownloads: download.remainingDownloads - 1,
    });

    return {
      success: true,
      remainingDownloads: download.remainingDownloads - 1,
    };
  },
});

export const create = mutation({
  args: {
    productId: v.id("products"),
    customerId: v.id("customers"),
    orderId: v.id("orders"),
    downloadLimit: v.number(),
    expiryDays: v.number(),
  },
  handler: async (ctx, args) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + args.expiryDays);

    return await ctx.db.insert("downloads", {
      productId: args.productId,
      customerId: args.customerId,
      orderId: args.orderId,
      downloadCount: 0,
      remainingDownloads: args.downloadLimit,
      expiryDate: expiryDate.toISOString(),
      status: "active",
    });
  },
});

export const getStats = query({
  handler: async (ctx) => {
    const downloads = await ctx.db.query("downloads").collect();
    return {
      total: downloads.length,
      active: downloads.filter(d => d.status === "active").length,
      expired: downloads.filter(d => d.status === "expired").length,
      disabled: downloads.filter(d => d.status === "disabled").length,
      totalDownloads: downloads.reduce((sum, d) => sum + d.downloadCount, 0),
      activeDownloads: downloads
        .filter(d => d.status === "active")
        .reduce((sum, d) => sum + d.remainingDownloads, 0),
    };
  },
});
