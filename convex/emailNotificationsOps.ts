// convex/emailNotificationsOps.ts
// ============================================================
// EMAIL NOTIFICATIONS — DB OPS (no "use node")
// ============================================================
// Internal queries/mutations used by the emailActions module.
// Kept separate because "use node" restricts functions in the
// parent module to actions only.
// ============================================================

import { v } from "convex/values";
import { internalQuery } from "./_generated/server";

/** Fetch an order by id (used by the email action). */
export const fetchOrder = internalQuery({
    args: { orderId: v.id("orders") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.orderId);
    },
});

/** Fetch a customer by id (used by the email action). */
export const fetchCustomer = internalQuery({
    args: { customerId: v.id("customers") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.customerId);
    },
});
