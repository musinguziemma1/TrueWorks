import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("coupons").collect();
  },
});

export const getByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
      .first();
  },
});

export const create = mutation({
  args: {
    code: v.string(),
    type: v.union(v.literal("percentage"), v.literal("fixed"), v.literal("bundle")),
    value: v.number(),
    minPurchase: v.optional(v.number()),
    usageLimit: v.number(),
    expiresAt: v.string(),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("coupons", {
      ...args,
      code: args.code.toUpperCase(),
      usageCount: 0,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("coupons"),
    code: v.optional(v.string()),
    value: v.optional(v.number()),
    minPurchase: v.optional(v.number()),
    usageLimit: v.optional(v.number()),
    expiresAt: v.optional(v.string()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    if (fields.code) fields.code = fields.code.toUpperCase();
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("coupons") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const validate = query({
  args: { code: v.string(), orderTotal: v.number() },
  handler: async (ctx, args) => {
    const coupon = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
      .first();

    if (!coupon) return { valid: false, reason: "Coupon not found" };
    if (!coupon.active) return { valid: false, reason: "Coupon is inactive" };
    if (coupon.usageCount >= coupon.usageLimit) return { valid: false, reason: "Usage limit reached" };
    if (new Date(coupon.expiresAt) < new Date()) return { valid: false, reason: "Coupon has expired" };
    if (coupon.minPurchase && args.orderTotal < coupon.minPurchase) {
      return { valid: false, reason: `Minimum purchase of UGX ${coupon.minPurchase.toLocaleString()} required` };
    }

    let discount = 0;
    if (coupon.type === "percentage") {
      discount = Math.round(args.orderTotal * (coupon.value / 100));
    } else {
      discount = coupon.value;
    }

    return {
      valid: true,
      coupon,
      discount: Math.min(discount, args.orderTotal),
    };
  },
});
