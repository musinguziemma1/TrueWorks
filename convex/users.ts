import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: { role: v.optional(v.union(v.literal("admin"), v.literal("store_manager"), v.literal("content_editor"), v.literal("marketing"), v.literal("support"), v.literal("finance"))) },
  handler: async (ctx, args) => {
    let users = await ctx.db.query("users").collect();
    if (args.role) users = users.filter(u => u.role === args.role);
    return users;
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("users").withIndex("by_email", (q) => q.eq("email", args.email)).first();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("store_manager"), v.literal("content_editor"), v.literal("marketing"), v.literal("support"), v.literal("finance")),
    permissions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", { ...args, twoFactorEnabled: false });
  },
});

export const update = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    role: v.optional(v.union(v.literal("admin"), v.literal("store_manager"), v.literal("content_editor"), v.literal("marketing"), v.literal("support"), v.literal("finance"))),
    permissions: v.optional(v.array(v.string())),
    twoFactorEnabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const logActivity = mutation({
  args: {
    userId: v.optional(v.id("users")),
    action: v.string(),
    resource: v.string(),
    resourceId: v.optional(v.string()),
    details: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activityLogs", args);
  },
});

export const getActivityLogs = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    let logs = await ctx.db.query("activityLogs").collect();
    logs.sort((a, b) => b._creationTime - a._creationTime);
    if (args.limit) logs = logs.slice(0, args.limit);
    return logs;
  },
});
