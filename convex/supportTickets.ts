import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    status: v.optional(v.union(v.literal("open"), v.literal("pending"), v.literal("resolved"), v.literal("closed"))),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent"))),
    search: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let tickets = await ctx.db.query("supportTickets").collect();

    if (args.status) tickets = tickets.filter(t => t.status === args.status);
    if (args.priority) tickets = tickets.filter(t => t.priority === args.priority);
    if (args.search) {
      const q = args.search.toLowerCase();
      tickets = tickets.filter(t =>
        t.subject.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.message.toLowerCase().includes(q)
      );
    }

    tickets.sort((a, b) => b._creationTime - a._creationTime);
    if (args.limit) tickets = tickets.slice(0, args.limit);
    return tickets;
  },
});

export const getById = query({
  args: { id: v.id("supportTickets") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    customerName: v.string(),
    customerEmail: v.string(),
    subject: v.string(),
    message: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    category: v.optional(v.string()),
    orderId: v.optional(v.id("orders")),
    attachments: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("supportTickets", {
      ...args,
      attachments: args.attachments || [],
      status: "open",
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("supportTickets"),
    status: v.union(v.literal("open"), v.literal("pending"), v.literal("resolved"), v.literal("closed")),
    resolution: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    return await ctx.db.get(id);
  },
});

export const updatePriority = mutation({
  args: {
    id: v.id("supportTickets"),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    return await ctx.db.get(id);
  },
});

export const assignTo = mutation({
  args: {
    id: v.id("supportTickets"),
    assignedTo: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    return await ctx.db.get(id);
  },
});
