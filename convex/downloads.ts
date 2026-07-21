// convex/downloads.ts
// ============================================================
// DOWNLOADS — PUBLIC API (better path)
// ============================================================
// Public-facing Convex queries/mutations the client app uses.
// Internal helpers (signing, secure issuance) live in
// `downloadSecure.ts`.
// ============================================================

import { v } from "convex/values";
import { query, mutation, internalQuery, internalMutation } from "./_generated/server";

// ------------------------------------------------------------
// VALIDATE — used by the Download page to decide what to show.
// ------------------------------------------------------------
export const validate = query({
    args: {
        downloadId: v.id("downloads"),
    },
    handler: async (ctx, args) => {
        const dl = await ctx.db.get(args.downloadId);
        if (!dl) {
            return { valid: false, reason: "not_found" as const };
        }
        if (dl.status !== "active") {
            return { valid: false, reason: "inactive" as const };
        }
        const expiry = new Date(dl.expiryDate).getTime();
        if (expiry < Date.now()) {
            return { valid: false, reason: "expired" as const };
        }
        if (dl.remainingDownloads <= 0) {
            return { valid: false, reason: "limit_reached" as const };
        }
        const product = await ctx.db.get(dl.productId);
        return {
            valid: true as const,
            download: {
                productName: (product as { name?: string } | null)?.name ?? "Your template",
                remainingDownloads: dl.remainingDownloads,
                expiryDate: dl.expiryDate,
                files: [(product as { name?: string } | null)?.name ?? "template"],
            },
        };
    },
});

// ------------------------------------------------------------
// RECORD — invoked after a successful file-storage URL issue.
// ------------------------------------------------------------
export const recordDownload = mutation({
    args: {
        downloadId: v.id("downloads"),
        device: v.optional(v.string()),
        ipAddress: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const row = await ctx.db.get(args.downloadId);
        if (!row) {
            throw new Error("Download not found");
        }
        const next = Math.max(0, row.remainingDownloads - 1);
        await ctx.db.patch(row._id, {
            downloadCount: row.downloadCount + 1,
            remainingDownloads: next,
            ...(args.device ? { device: args.device } : {}),
            ...(args.ipAddress ? { ipAddress: args.ipAddress } : {}),
            status: next === 0 ? ("expired" as const) : row.status,
        });
        return { remaining: next };
    },
});

// ------------------------------------------------------------
// LIST — used by the "My Downloads" UI.
// ------------------------------------------------------------
export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("downloads").collect();
    },
});

export const getStats = query({
    args: {},
    handler: async (ctx) => {
        const downloads = await ctx.db.query("downloads").collect();
        const active = downloads.filter((d) => d.status === "active").length;
        const expired = downloads.filter((d) => d.status === "expired").length;
        const totalDownloads = downloads.reduce((sum, d) => sum + d.downloadCount, 0);
        const activeDownloads = downloads.filter((d) => d.status === "active" && d.remainingDownloads > 0).length;

        return {
            totalDownloads,
            active,
            expired,
            activeDownloads,
        };
    },
});

export const listForOrder = query({
    args: { orderId: v.id("orders") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("downloads")
            .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
            .collect();
    },
});

// ============================================================
// INTERNAL HELPERS — used by downloadSecure.ts (Node action)
// ============================================================

/** Returns true if the customer still has download quota. */
export const checkQuotaInternal = internalQuery({
    args: {
        orderId: v.string(),
        productId: v.string(),
    },
    handler: async (ctx, args) => {
        const downloads = await ctx.db
            .query("downloads")
            .withIndex("by_order", (q) => q.eq("orderId", args.orderId as any))
            .collect();
        const dl = downloads.find((d) => d.productId === args.productId);
        if (!dl) return false;
        if (dl.status !== "active") return false;

        const expiry = new Date(dl.expiryDate).getTime();
        if (expiry < Date.now()) {
            // Can't `patch` from a query — caller (action) handles the update.
            return false;
        }
        if (dl.remainingDownloads <= 0) {
            return false;
        }
        return true;
    },
});

/** Returns the file-storage id + filename for the download route. */
export const getFileForDownload = internalQuery({
    args: { productId: v.string() },
    handler: async (ctx, args) => {
        const product = await ctx.db.get(args.productId as any);
        if (!product) return null;
        return {
            slug: (product as any).slug ?? String((product as any)._id),
            fileStorageId: (product as any).fileStorageId ?? null,
        };
    },
});

/** Record one download attempt + decrement remaining quota. */
export const recordDownloadInternal = internalMutation({
    args: {
        orderId: v.string(),
        productId: v.string(),
        ipAddress: v.optional(v.string()),
        device: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const downloads = await ctx.db
            .query("downloads")
            .withIndex("by_order", (q) => q.eq("orderId", args.orderId as any))
            .collect();
        const dl = downloads.find((d) => d.productId === args.productId);
        if (!dl) return;
        await ctx.db.patch(dl._id, {
            downloadCount: dl.downloadCount + 1,
            remainingDownloads: Math.max(0, dl.remainingDownloads - 1),
            ...(args.ipAddress ? { ipAddress: args.ipAddress } : {}),
            ...(args.device ? { device: args.device } : {}),
        });
    },
});
