import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

const HOME_LAYOUT_KEY = "home_layout";
type HomeLayout = "original" | "showroom" | "editorial" | "trust";

export const getHomeLayout = query({
  args: {},
  handler: async (ctx) => {
    const setting = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", HOME_LAYOUT_KEY))
      .first();
    return (setting?.value ?? "showroom") as HomeLayout;
  },
});

export const updateHomeLayout = mutation({
  args: {
    layout: v.union(
      v.literal("original"),
      v.literal("showroom"),
      v.literal("editorial"),
      v.literal("trust"),
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", HOME_LAYOUT_KEY))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { value: args.layout });
    } else {
      await ctx.db.insert("settings", { key: HOME_LAYOUT_KEY, value: args.layout });
    }
  },
});
