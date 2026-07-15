import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const list = query({
  args: {
    category: v.optional(v.string()),
    industry: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("draft"), v.literal("archived"))),
    featured: v.optional(v.boolean()),
    search: v.optional(v.string()),
    sortBy: v.optional(v.union(v.literal("newest"), v.literal("popular"), v.literal("price_low"), v.literal("price_high"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let products = await ctx.db.query("products").collect();

    if (args.status) {
      products = products.filter(p => p.status === args.status);
    }
    if (args.featured !== undefined) {
      products = products.filter(p => p.featured === args.featured);
    }
    if (args.category) {
      products = products.filter(p => p.category === args.category);
    }
    if (args.industry) {
      products = products.filter(p => p.industry === args.industry);
    }
    if (args.search) {
      const q = args.search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
      );
    }

    switch (args.sortBy) {
      case "popular":
        products.sort((a, b) => b.salesCount - a.salesCount);
        break;
      case "price_low":
        products.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case "price_high":
        products.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      default:
        products.sort((a, b) => b._creationTime - a._creationTime);
    }

    if (args.limit) {
      products = products.slice(0, args.limit);
    }

    return products;
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    let products = await ctx.db
      .query("products")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .collect();
    if (args.limit) products = products.slice(0, args.limit);
    return products;
  },
});

export const getRelated = query({
  args: { productId: v.id("products"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) return [];
    const ids = product.relatedProducts;
    const related = (await Promise.all(ids.map(id => ctx.db.get(id)))).filter(Boolean);
    if (args.limit) return related.slice(0, args.limit);
    return related;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    sku: v.string(),
    slug: v.string(),
    shortDescription: v.string(),
    description: v.string(),
    price: v.number(),
    salePrice: v.optional(v.number()),
    category: v.string(),
    industry: v.string(),
    fileType: v.string(),
    tags: v.array(v.string()),
    images: v.array(v.string()),
    thumbnail: v.string(),
    downloadableFiles: v.array(v.string()),
    version: v.string(),
    changelog: v.string(),
    demoUrl: v.optional(v.string()),
    faq: v.array(v.object({ question: v.string(), answer: v.string() })),
    seoTitle: v.string(),
    seoDescription: v.string(),
    downloadLimit: v.number(),
    downloadExpiry: v.number(),
    status: v.union(v.literal("active"), v.literal("draft"), v.literal("archived")),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", { ...args, salesCount: 0, relatedProducts: [] });
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    sku: v.optional(v.string()),
    shortDescription: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    salePrice: v.optional(v.number()),
    category: v.optional(v.string()),
    industry: v.optional(v.string()),
    fileType: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    images: v.optional(v.array(v.string())),
    thumbnail: v.optional(v.string()),
    version: v.optional(v.string()),
    changelog: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    downloadLimit: v.optional(v.number()),
    downloadExpiry: v.optional(v.number()),
    status: v.optional(v.union(v.literal("active"), v.literal("draft"), v.literal("archived"))),
    featured: v.optional(v.boolean()),
    demoUrl: v.optional(v.string()),
    faq: v.optional(v.array(v.object({ question: v.string(), answer: v.string() }))),
    relatedProducts: v.optional(v.array(v.id("products"))),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const duplicate = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const original = await ctx.db.get(args.id);
    if (!original) throw new Error("Product not found");
    const { _id, _creationTime, ...data } = original;
    return await ctx.db.insert("products", {
      ...data,
      name: `${data.name} (Copy)`,
      sku: `${data.sku}-COPY`,
      slug: `${data.slug}-copy`,
      status: "draft",
      salesCount: 0,
    });
  },
});

export const getCategories = query({
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

export const getIndustries = query({
  handler: async (ctx) => {
    return await ctx.db.query("industries").collect();
  },
});
