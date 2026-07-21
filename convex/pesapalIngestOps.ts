// convex/pesapalIngestOps.ts
// ============================================================
// PESAPAL — DB OPS (no "use node")
// ============================================================
// Internal mutations used by the Node-runtime actions in
// `pesapalIngest.ts`. Kept separate so they can stay as
// mutations (which are NOT allowed in node-runtime modules).
// ============================================================

import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

// ------------------------------------------------------------
// APPLY PAYMENT STATUS — Idempotent status update.
// ------------------------------------------------------------
export const applyPaymentStatus = internalMutation({
    args: {
        orderTrackingId: v.string(),
        orderMerchantReference: v.string(),
        status: v.union(
            v.literal("COMPLETED"),
            v.literal("FAILED"),
            v.literal("REVERSED"),
            v.literal("INVALID")
        ),
        paymentMethod: v.union(v.string(), v.null()),
        amount: v.union(v.number(), v.null()),
        confirmationCode: v.union(v.string(), v.null()),
    },
    handler: async (ctx, args) => {
        // Step 1 — find the payment by reference.
        const payment = await ctx.db
            .query("payments")
            .withIndex("by_reference", (q) => q.eq("reference", args.orderTrackingId))
            .first();

        if (!payment) {
            // Pesapal sometimes sends IPNs for orders we don't
            // know about. Persist for manual review.
            await ctx.db.insert("notifications", {
                title: "Unknown Pesapal IPN",
                message: `Received IPN for tracking ${args.orderTrackingId} with no matching payment record`,
                type: "payment",
                read: false,
            });
            return;
        }

        // Step 2 — Idempotency: if the payment is already in this
        // terminal state, do nothing.
        const NEW_STATUS: any = args.status === "COMPLETED"
            ? "completed"
            : "failed";

        if (payment.status === NEW_STATUS) {
            return;
        }

        // Step 3 — update the payment row.
        await ctx.db.patch(payment._id, {
            status: NEW_STATUS,
            ...(args.confirmationCode
                ? { reference: args.confirmationCode }
                : {}),
        });

        // Step 4 — update the matching order.
        const order = await ctx.db.get(payment.orderId);
        if (!order) return;

        const isSuccess = args.status === "COMPLETED";

        await ctx.db.patch(payment.orderId, {
            paymentStatus: isSuccess ? "completed" : "failed",
            orderStatus: isSuccess ? "processing" : "cancelled",
        });

        // Step 5 — on success, generate download links.
        if (isSuccess) {
            const downloadLinks = order.items.map((item) => {
                // 7-day expiry from payment confirmation.
                const expiry = new Date();
                expiry.setDate(expiry.getDate() + 7);
                return {
                    productId: item.productId,
                    productName: item.productName,
                    url: `/api/download/file?orderId=${payment.orderId}&productId=${item.productId}`,
                    downloadCount: 0,
                    remainingDownloads: 5,
                    expiryDate: expiry.toISOString(),
                    status: "active" as const,
                };
            });
            await ctx.db.patch(payment.orderId, { downloadLinks });

            for (const link of downloadLinks) {
                await ctx.db.insert("downloads", {
                    productId: link.productId,
                    customerId: order.customerId,
                    orderId: payment.orderId,
                    downloadCount: 0,
                    remainingDownloads: 5,
                    expiryDate: link.expiryDate,
                    status: "active",
                });
            }

            // Bump customer counters.
            const customer = await ctx.db.get(order.customerId);
            if (customer) {
                await ctx.db.patch(order.customerId, {
                    totalOrders: customer.totalOrders + 1,
                    lifetimeValue: customer.lifetimeValue + order.total,
                    totalDownloads: customer.totalDownloads + downloadLinks.length,
                    lastPurchaseAt: new Date().toISOString(),
                });
            }

            // Schedule email receipt — fire-and-forget.
            await ctx.scheduler.runAfter(
                0,
                // re-imported via string to avoid TS import cycle
                (await import("./_generated/api.js")).internal.emailNotifications.sendOrderReceipt,
                { orderId: payment.orderId }
            );
        } else {
            // Schedule failure notice.
            await ctx.scheduler.runAfter(
                0,
                (await import("./_generated/api.js")).internal.emailNotifications.sendPaymentFailed,
                { orderId: payment.orderId, reason: args.status }
            );
        }

        await ctx.db.insert("notifications", {
            title: isSuccess ? "Payment Completed" : "Payment Failed",
            message: `Order ${order.orderNumber} ${isSuccess ? "confirmed" : "failed"} via ${args.paymentMethod ?? "Pesapal"}`,
            type: "payment",
            read: false,
        });
    },
});

// ------------------------------------------------------------
// LOG FAILED IPN — for ops observability.
// ------------------------------------------------------------
export const logFailedIPN = internalMutation({
    args: {
        orderTrackingId: v.string(),
        orderMerchantReference: v.string(),
        reason: v.string(),
        notificationType: v.union(v.string(), v.null()),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("notifications", {
            title: "Pesapal IPN Anomaly",
            message: `Could not process IPN ${args.orderTrackingId} (${args.reason})`,
            type: "payment",
            read: false,
        });
    },
});
