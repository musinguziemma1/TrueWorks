import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listBlogPosts = query({
  args: {
    category: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    search: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let posts = await ctx.db.query("blogPosts").collect();

    if (args.featured !== undefined) {
      posts = posts.filter(p => p.featured === args.featured);
    }
    if (args.category) {
      posts = posts.filter(p => p.category === args.category);
    }
    if (args.search) {
      const q = args.search.toLowerCase();
      posts = posts.filter(p => p.title.toLowerCase().includes(q));
    }

    posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    if (args.limit) posts = posts.slice(0, args.limit);
    return posts;
  },
});

export const getBlogPost = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const createBlogPost = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    image: v.string(),
    author: v.string(),
    readingTime: v.number(),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("blogPosts", {
      ...args,
      publishedAt: new Date().toISOString(),
    });
  },
});

export const listResources = query({
  args: {
    category: v.optional(v.string()),
    type: v.optional(v.union(v.literal("article"), v.literal("guide"), v.literal("template"), v.literal("case_study"))),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let resources = await ctx.db.query("resources").collect();
    if (args.featured !== undefined) resources = resources.filter(r => r.featured === args.featured);
    if (args.category) resources = resources.filter(r => r.category === args.category);
    if (args.type) resources = resources.filter(r => r.type === args.type);
    return resources;
  },
});

export const createResource = mutation({
  args: {
    title: v.string(),
    type: v.union(v.literal("article"), v.literal("guide"), v.literal("template"), v.literal("case_study")),
    description: v.string(),
    image: v.string(),
    url: v.string(),
    featured: v.boolean(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("resources", args);
  },
});

export const updateBlogPost = mutation({
  args: {
    id: v.id("blogPosts"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    image: v.optional(v.string()),
    author: v.optional(v.string()),
    readingTime: v.optional(v.number()),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    return await ctx.db.get(id);
  },
});

export const removeBlogPost = mutation({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const updateResource = mutation({
  args: {
    id: v.id("resources"),
    title: v.optional(v.string()),
    type: v.optional(v.union(v.literal("article"), v.literal("guide"), v.literal("template"), v.literal("case_study"))),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    url: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    return await ctx.db.get(id);
  },
});

export const removeResource = mutation({
  args: { id: v.id("resources") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getPageSections = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("pageSections")
      .withIndex("by_order")
      .collect();
  },
});

export const updatePageSection = mutation({
  args: {
    id: v.id("pageSections"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    image: v.optional(v.string()),
    ctaText: v.optional(v.string()),
    ctaLink: v.optional(v.string()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const getNavigation = query({
  handler: async (ctx) => {
    const items = await ctx.db.query("navigation").collect();
    const topLevel = items.filter(i => !i.parentId).sort((a, b) => a.order - b.order);
    return topLevel.map(item => ({
      ...item,
      children: items.filter(i => i.parentId === item._id).sort((a, b) => a.order - b.order),
    }));
  },
});

export const updateNavigation = mutation({
  args: {
    id: v.id("navigation"),
    label: v.optional(v.string()),
    url: v.optional(v.string()),
    order: v.optional(v.number()),
    badge: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const listCategories = query({
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

export const createCategory = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    icon: v.string(),
    image: v.optional(v.string()),
    parent: v.optional(v.id("categories")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("categories", { ...args, productCount: 0 });
  },
});

export const updateCategory = mutation({
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
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    return await ctx.db.get(id);
  },
});

export const removeCategory = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const sendContactMessage = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("notifications", {
      title: `Contact: ${args.subject}`,
      message: `From ${args.name} (${args.email}): ${args.message.substring(0, 200)}`,
      type: "system",
      read: false,
    });
    return true;
  },
});
