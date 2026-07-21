// convex/users.ts
// ============================================================
// STAFF USERS / ROLES / ACTIVITY LOGS
// ============================================================
// Mutating staff records (create/update/delete) requires the
// caller to be an authenticated admin. Queries for activity
// logs require at minimum "marketing" so finance and support
// can also review them.
// ============================================================

import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireStaffUser, requireSignedIn, getStaffUserId, getStaffUserOrNull } from "./auth.helpers";

// ------------------------------------------------------------
// Staff list & lookup
// ------------------------------------------------------------
export const list = query({
  args: {
    role: v.optional(v.union(
      v.literal("admin"),
      v.literal("store_manager"),
      v.literal("content_editor"),
      v.literal("marketing"),
      v.literal("support"),
      v.literal("finance")
    )),
  },
  handler: async (ctx, args) => {
    const caller = await getStaffUserOrNull(ctx);
    if (!caller) return null;
    const staff = await ctx.db.query("users").collect();
    return args.role ? staff.filter((s) => s.role === args.role) : staff;
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // Public-safe — used by Contact/Newsletter forms to find an
    // existing customer. Don't leak staff fields.
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (!user) return null;
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
  },
});

// ------------------------------------------------------------
// Mutations — admin only
// ------------------------------------------------------------
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("admin"),
      v.literal("store_manager"),
      v.literal("content_editor"),
      v.literal("marketing"),
      v.literal("support"),
      v.literal("finance")
    ),
    permissions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const actor = await requireStaffUser(ctx, "admin");
    const id = await ctx.db.insert("users", {
      ...args,
      twoFactorEnabled: false,
    });
    await ctx.db.insert("activityLogs", {
      userId: actor._id,
      action: "staff.create",
      resource: "users",
      resourceId: id,
      details: `Created staff ${args.email} as ${args.role}`,
    });
    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    role: v.optional(v.union(
      v.literal("admin"),
      v.literal("store_manager"),
      v.literal("content_editor"),
      v.literal("marketing"),
      v.literal("support"),
      v.literal("finance")
    )),
    permissions: v.optional(v.array(v.string())),
    twoFactorEnabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const actor = await requireStaffUser(ctx, "admin");
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    await ctx.db.insert("activityLogs", {
      userId: actor._id,
      action: "staff.update",
      resource: "users",
      resourceId: id,
      details: `Updated staff ${id}`,
    });
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const actor = await requireStaffUser(ctx, "admin");
    await ctx.db.delete(args.id);
    await ctx.db.insert("activityLogs", {
      userId: actor._id,
      action: "staff.delete",
      resource: "users",
      resourceId: args.id,
      details: `Deleted staff ${args.id}`,
    });
  },
});

// ------------------------------------------------------------
// Activity logs
// ------------------------------------------------------------
export const logActivity = mutation({
  args: {
    action: v.string(),
    resource: v.string(),
    resourceId: v.optional(v.string()),
    details: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireSignedIn(ctx);
    const staffId = await getStaffUserId(ctx);
    return await ctx.db.insert("activityLogs", {
      userId: staffId as any,
      ...args,
    });
  },
});

export const getActivityLogs = query({
  args: {
    limit: v.optional(v.number()),
    resource: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const staff = await getStaffUserOrNull(ctx, "admin", "finance");
    if (!staff) return null;
    let logs = await ctx.db.query("activityLogs").collect();
    if (args.resource) {
      logs = logs.filter((l) => l.resource === args.resource);
    }
    logs.sort((a, b) => b._creationTime - a._creationTime);
    if (args.limit) logs = logs.slice(0, args.limit);
    return logs;
  },
});

export const getStaffByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const staff = await getStaffUserOrNull(ctx, "admin");
    if (!staff) return null;
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Helper for activity log metadata on public-facing mutations
// (orders, downloads, etc). Exposed via this module so callers
// don't have a circular dep on `auth.helpers`.
export async function resolveActor(ctx: any, identity: any) {
  if (!identity?.email) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_email", (q: any) => q.eq("email", identity!.email))
    .first();
}
