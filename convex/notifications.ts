import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    unreadOnly: v.optional(v.boolean()),
    type: v.optional(v.union(v.literal("order"), v.literal("payment"), v.literal("review"), v.literal("support"), v.literal("system"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let notifications = await ctx.db.query("notifications").collect();

    if (args.unreadOnly) notifications = notifications.filter(n => !n.read);
    if (args.type) notifications = notifications.filter(n => n.type === args.type);

    notifications.sort((a, b) => b._creationTime - a._creationTime);
    if (args.limit) notifications = notifications.slice(0, args.limit);
    return notifications;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    message: v.string(),
    type: v.union(v.literal("order"), v.literal("payment"), v.literal("review"), v.literal("support"), v.literal("system")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", { ...args, read: false });
  },
});

export const markAsRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { read: true });
  },
});

export const markAllAsRead = mutation({
  handler: async (ctx) => {
    const notifications = await ctx.db.query("notifications").collect();
    for (const n of notifications) {
      if (!n.read) await ctx.db.patch(n._id, { read: true });
    }
  },
});

export const getUnreadCount = query({
  handler: async (ctx) => {
    const notifications = await ctx.db.query("notifications").collect();
    return notifications.filter(n => !n.read).length;
  },
});
