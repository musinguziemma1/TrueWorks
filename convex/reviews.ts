import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireStaffUser } from "./auth.helpers";

export const list = query({
  args: {
    productId: v.optional(v.id("products")),
    approved: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let reviews = await ctx.db.query("reviews").collect();

    if (args.productId) reviews = reviews.filter(r => r.productId === args.productId);
    if (args.approved !== undefined) reviews = reviews.filter(r => r.approved === args.approved);
    if (args.featured !== undefined) reviews = reviews.filter(r => r.featured === args.featured);

    reviews.sort((a, b) => b._creationTime - a._creationTime);
    if (args.limit) reviews = reviews.slice(0, args.limit);
    return reviews;
  },
});

export const create = mutation({
  args: {
    productId: v.id("products"),
    customerName: v.string(),
    rating: v.number(),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reviews", {
      ...args,
      customerId: undefined,
      featured: false,
      approved: false,
    });
  },
});

export const approve = mutation({
  args: { id: v.id("reviews") },
  handler: async (ctx, args) => {
    await requireStaffUser(ctx);
    await ctx.db.patch(args.id, { approved: true });
  },
});

export const reject = mutation({
  args: { id: v.id("reviews") },
  handler: async (ctx, args) => {
    await requireStaffUser(ctx);
    await ctx.db.delete(args.id);
  },
});

export const toggleFeatured = mutation({
  args: { id: v.id("reviews") },
  handler: async (ctx, args) => {
    await requireStaffUser(ctx);
    const review = await ctx.db.get(args.id);
    if (review) {
      await ctx.db.patch(args.id, { featured: !review.featured });
    }
  },
});

export const getStats = query({
  handler: async (ctx) => {
    const reviews = await ctx.db.query("reviews").collect();
    return {
      total: reviews.length,
      approved: reviews.filter(r => r.approved).length,
      pending: reviews.filter(r => !r.approved).length,
      averageRating: reviews.length > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0,
    };
  },
});
