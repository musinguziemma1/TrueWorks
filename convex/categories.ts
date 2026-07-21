import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireStaffUser } from "./auth.helpers";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    icon: v.string(),
    image: v.optional(v.string()),
    parent: v.optional(v.id("categories")),
  },
  handler: async (ctx, args) => {
    await requireStaffUser(ctx);
    return await ctx.db.insert("categories", { ...args, productCount: 0 });
  },
});

export const update = mutation({
  args: {
    id: v.id("categories"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    image: v.optional(v.string()),
    productCount: v.optional(v.number()),
    parent: v.optional(v.id("categories")),
  },
  handler: async (ctx, args) => {
    await requireStaffUser(ctx);
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    await requireStaffUser(ctx);
    await ctx.db.delete(args.id);
  },
});
