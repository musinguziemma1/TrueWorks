import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireStaffUser, getStaffUserOrNull } from "./auth.helpers";

export const list = query({
  args: {
    search: v.optional(v.string()),
    newsletter: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const staff = await getStaffUserOrNull(ctx);
    if (!staff) return null;
    let customers = await ctx.db.query("customers").collect();

    if (args.newsletter !== undefined) {
      customers = customers.filter(c => c.newsletter === args.newsletter);
    }
    if (args.search) {
      const q = args.search.toLowerCase();
      customers = customers.filter(c =>
        c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
      );
    }

    customers.sort((a, b) => b._creationTime - a._creationTime);
    if (args.limit) customers = customers.slice(0, args.limit);
    return customers;
  },
});

export const getById = query({
  args: { id: v.id("customers") },
  handler: async (ctx, args) => {
    const staff = await getStaffUserOrNull(ctx);
    if (!staff) return null;
    return await ctx.db.get(args.id);
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const staff = await getStaffUserOrNull(ctx);
    if (!staff) return null;
    return await ctx.db
      .query("customers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    industry: v.optional(v.string()),
    newsletter: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("customers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        totalOrders: existing.totalOrders + 1,
        lastPurchaseAt: new Date().toISOString(),
      });
      return existing._id;
    }

    return await ctx.db.insert("customers", {
      ...args,
      favoriteCategories: [],
      lifetimeValue: 0,
      totalOrders: 1,
      totalDownloads: 0,
      lastPurchaseAt: new Date().toISOString(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("customers"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    industry: v.optional(v.string()),
    newsletter: v.optional(v.boolean()),
    favoriteCategories: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await requireStaffUser(ctx);
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    return await ctx.db.get(id);
  },
});

export const getStats = query({
  handler: async (ctx) => {
    const staff = await getStaffUserOrNull(ctx);
    if (!staff) return null;
    const customers = await ctx.db.query("customers").collect();
    return {
      total: customers.length,
      active: customers.filter(c => c.totalOrders > 0).length,
      newsletter: customers.filter(c => c.newsletter).length,
      totalLTV: customers.reduce((sum, c) => sum + c.lifetimeValue, 0),
      averageLTV: customers.length > 0
        ? customers.reduce((sum, c) => sum + c.lifetimeValue, 0) / customers.length
        : 0,
    };
  },
});
