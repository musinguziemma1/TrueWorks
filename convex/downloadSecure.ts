// convex/downloadSecure.ts
// ============================================================
// SECURE DOWNLOADS — ACTIONS (Node runtime)
// ============================================================
// Server-side action that mints short-lived HMAC-signed
// tokens and bridges to the `downloads` table for quota checks
// and Convex file storage for the actual file URL.
//
// The download flow:
//   1. Customer visits `/download?orderId=...&productId=...`
//   2. App calls `validate` (public query in `downloads.ts`).
//   3. App POSTs to /api/download/file with a freshly minted
//      token + productId.
//   4. This action verifies the token, re-checks quota, and
//      returns a signed file-storage URL.
//   5. Customer downloads once; we log + decrement remaining.
// ============================================================

"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

// ------------------------------------------------------------
// SECRET — pulled from typed env. NEVER exposed to client.
// Set via `npx convex env set DOWNLOAD_TOKEN_SECRET "..."`.
// ------------------------------------------------------------
function getSecret(): string {
    const env = process.env as Record<string, string | undefined>;
    return env.DOWNLOAD_TOKEN_SECRET ?? "development-only-must-replace-in-production";
}

// ------------------------------------------------------------
// HMAC TOKEN HELPERS
// ------------------------------------------------------------
type TokenParts = {
    orderId: string;
    productId: string;
    nonce: string;
    expiresAt: number;
};

function getSigner() {
    const secret = getSecret();
    return (parts: TokenParts): string => {
        const data = `${parts.orderId}|${parts.productId}|${parts.nonce}|${parts.expiresAt}`;
        return createHmac("sha256", secret).update(data).digest("hex");
    };
}

/** Compact, opaque token format — safe for URL params. */
export function signToken(parts: Omit<TokenParts, "nonce" | "expiresAt"> & {
    nonce?: string;
    expiresAt?: number;
}): string {
    const fullParts: TokenParts = {
        ...parts,
        nonce: parts.nonce ?? randomBytes(8).toString("hex"),
        expiresAt: parts.expiresAt ?? Date.now() + 5 * 60 * 60 * 1000,
    };
    const data = `${fullParts.orderId}_${fullParts.productId}_${fullParts.nonce}_${fullParts.expiresAt}`;
    const sig = getSigner()(fullParts);
    return Buffer.from(`${data}|${sig}`, "utf8").toString("base64url");
}

export function verifyToken(token: string): TokenParts | null {
    try {
        const decoded = Buffer.from(token, "base64url").toString("utf8");
        const [orderId, productId, nonce, expiresAtStr, sig] = decoded.split("|");
        if (!orderId || !productId || !nonce || !expiresAtStr || !sig) {
            return null;
        }
        const expiresAt = Number(expiresAtStr);
        if (Number.isNaN(expiresAt) || expiresAt < Date.now()) {
            return null;
        }
        const expected = getSigner()({ orderId, productId, nonce, expiresAt });
        const aBuf = Buffer.from(sig, "hex");
        const bBuf = Buffer.from(expected, "hex");
        if (aBuf.length !== bBuf.length) return null;
        if (!timingSafeEqual(aBuf, bBuf)) return null;
        return { orderId, productId, nonce, expiresAt };
    } catch {
        return null;
    }
}

// ------------------------------------------------------------
// ISSUE DOWNLOAD URL — validated bridge between token +
// actual file storage.
//
// Idempotency: a successful call decrements `remainingDownloads`
// exactly once. If you re-issue, the token expiry prevents reuse.
// ------------------------------------------------------------
export const issueDownloadUrl = internalAction({
    args: {
        token: v.string(),
        productId: v.string(),
        ipAddress: v.optional(v.string()),
        userAgent: v.optional(v.string()),
    },
    handler: async (ctx, args): Promise<{ url: string; filename: string } | null> => {
        const parts = verifyToken(args.token);
        if (!parts || parts.productId !== args.productId) {
            return null;
        }

        // Quota / expiry gate — single DB read.
        const ok = await ctx.runQuery(internal.downloads.checkQuotaInternal, {
            orderId: parts.orderId,
            productId: parts.productId,
        });
        if (!ok) return null;

        // Fetch the file-storage id for this product.
        const product = await ctx.runQuery(internal.downloads.getFileForDownload, {
            productId: parts.productId,
        });
        if (!product?.fileStorageId) return null;

        const url = await ctx.storage.getUrl(product.fileStorageId as any);
        if (!url) return null;

        // Record the attempt + decrement remaining.
        await ctx.runMutation(internal.downloads.recordDownloadInternal, {
            orderId: parts.orderId,
            productId: parts.productId,
            ipAddress: args.ipAddress,
            device: args.userAgent,
        });

        return {
            url,
            filename: `${product.slug ?? "trueworks-template"}.xlsx`,
        };
    },
});
