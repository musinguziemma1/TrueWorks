// convex/http.ts
// ============================================================
// HTTP ROUTES (Pesapal IPN WEBHOOKS)
// ============================================================
// Pesapal POSTs the Instant Payment Notification (IPN) to this
// endpoint when a customer's payment status changes. The flow:
//
//   1. Customer pays on Pesapal.
//   2. Pesapal posts { OrderTrackingId, OrderMerchantReference,
//      Status, ... } to /api/pesapal/ipn.
//   3. We re-confirm the status with Pesapal's API (prevents
//      spoofed IPNs).
//   4. We mark the matching payment + order as completed/failed
//      (idempotent — using the `reference` as a unique key).
//
// Pesapal expects a 200 OK with `{"orderNotificationId":"..."}` to
// acknowledge receipt.
// ============================================================

import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { auth } from "./auth";

// Boundary between structure types defined in `_generated`.
const http = httpRouter();

// Mount the auth routes — JWT verification, OAuth callbacks,
// `/.well-known/openid-configuration`, etc. Always required
// when using Convex Auth, even for password-only.
auth.addHttpRoutes(http);

// ------------------------------------------------------------
// POST /api/pesapal/ipn
// Called by Pesapal whenever a payment status changes.
// ------------------------------------------------------------
http.route({
    path: "/api/pesapal/ipn",
    method: "POST",
    handler: httpAction(async (ctx, req) => {
        // Step 1 — parse incoming webhook payload. Pesapal sends
        // application/x-www-form-urlencoded by default.
        let payload: Record<string, string>;
        try {
            const form = await req.formData();
            payload = Object.fromEntries(form as unknown as Iterable<[string, string]>);
        } catch {
            // Fall back to JSON — newer Pesapal API versions accept JSON.
            try {
                payload = (await req.json()) as Record<string, string>;
            } catch {
                return new Response(
                    JSON.stringify({ error: "Failed to parse IPN payload" }),
                    { status: 400, headers: { "Content-Type": "application/json" } }
                );
            }
        }

        const orderTrackingId = payload.OrderTrackingId;
        const orderMerchantReference = payload.OrderMerchantReference;
        const notificationType = payload.OrderNotificationType;

        if (!orderTrackingId || !orderMerchantReference) {
            return new Response(
                JSON.stringify({ error: "Missing tracking id" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Step 2 — call into an internal action that handles the
        // re-confirmation + DB writes (kept out of httpAction to
        // share state-changes via TypeScript types).
        try {
            await ctx.runAction(internal.pesapalIngest.processIPN, {
                orderTrackingId,
                orderMerchantReference,
                notificationType,
            });
        } catch (err) {
            // Log but ACK: Pesapal will retry on non-200; we don't
            // want to spam-retry on apps that are temporarily
            // down for unrelated reasons. Internal logs cover
            // observability.
            console.error("[pesapal/ipn] processing failed", err);
        }

        // Step 3 — ACK with our expected shape so Pesapal stops
        // re-delivering.
        return new Response(
            JSON.stringify({ orderNotificationId: notificationType }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    }),
});

// ------------------------------------------------------------
// GET /api/health — orchestrator health check.
// Useful for uptime monitoring.
// ------------------------------------------------------------
http.route({
    path: "/api/health",
    method: "GET",
    handler: httpAction(async () => {
        return new Response(
            JSON.stringify({ ok: true, ts: Date.now() }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    }),
});

// ------------------------------------------------------------
// GET /robots.txt — public crawl directives.
// Sitemap pointer lives here so search engines find it
// automatically.
// ------------------------------------------------------------
http.route({
    path: "/robots.txt",
    method: "GET",
    handler: httpAction(async () => {
        const siteUrl = process.env.SITE_URL ?? "https://trueworks.com";
        const body = [
            "# TrueWorks robots.txt",
            "User-agent: *",
            "Allow: /",
            "Disallow: /admin",
            "Disallow: /admin/",
            "Disallow: /api/download",
            "Disallow: /api/pesapal",
            "Sitemap: " + siteUrl + "/sitemap.xml",
            "",
        ].join("\n");
        return new Response(body, {
            status: 200,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
    }),
});

// ------------------------------------------------------------
// GET /sitemap.xml — dynamic sitemap of public pages +
// products. Search-engine friendly; admin endpoints are
// excluded.
// ------------------------------------------------------------
http.route({
    path: "/sitemap.xml",
    method: "GET",
    handler: httpAction(async (ctx) => {
        const siteUrl = (process.env.SITE_URL ?? "https://trueworks.com").replace(/\/$/, "");
        const urls: string[] = [
            `${siteUrl}/`,
            `${siteUrl}/store`,
            `${siteUrl}/about`,
            `${siteUrl}/resources`,
            `${siteUrl}/contact`,
            `${siteUrl}/FAQ`,
            `${siteUrl}/terms`,
            `${siteUrl}/privacy`,
            `${siteUrl}/refund-policy`,
        ];

        try {
            const products = (await ctx.runQuery(internal.sitemap.listProductSlugs, {})) as Array<{ slug: string; updatedAt?: string }>;
            const blogPosts = (await ctx.runQuery(internal.sitemap.listBlogSlugs, {})) as Array<{ slug: string; publishedAt?: string }>;
            for (const p of products) {
                urls.push(`${siteUrl}/product/${p.slug}`);
            }
            for (const b of blogPosts) {
                urls.push(`${siteUrl}/resources/${b.slug}`);
            }
        } catch (err) {
            console.error("[sitemap] failed to fetch slugs", err);
        }

        const now = new Date().toISOString();
        const xml =
            `<?xml version="1.0" encoding="UTF-8"?>\n` +
            `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
            urls.map((u) => `  <url><loc>${u}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`).join("\n") +
            `\n</urlset>`;

        return new Response(xml, {
            status: 200,
            headers: { "Content-Type": "application/xml; charset=utf-8" },
        });
    }),
});

// ------------------------------------------------------------
// GET /api/download/:token — secure file delivery.
//
// The flow:
//   1. Customer clicks a download link from their order.
//   2. We validate the JWT-like token (signed in downloads.ts).
//   3. We issue a Convex file-storage URL for the exact file.
//
// This route is never hit directly; callers should always go
// through `validateDownloadToken` first.
// ------------------------------------------------------------
http.route({
    path: "/api/download/file",
    method: "POST",
    handler: httpAction(async (ctx, req) => {
        const body = await req.json().catch(() => null) as {
            token?: string;
            productId?: string;
        } | null;
        if (!body?.token || !body?.productId) {
            return new Response(
                JSON.stringify({ error: "Missing token or product id" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        try {
            const result = (await ctx.runAction(
                internal.downloadSecure.issueDownloadUrl,
                { token: body.token, productId: body.productId }
            )) as { url?: string; filename?: string } | null;

            if (!result?.url) {
                return new Response(
                    JSON.stringify({ error: "Invalid token" }),
                    { status: 403, headers: { "Content-Type": "application/json" } }
                );
            }
            return new Response(JSON.stringify(result), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (err) {
            console.error("[download/file] error", err);
            return new Response(
                JSON.stringify({ error: "Internal error" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }
    }),
});

// Re-export validator for downstream consumption.
export { v };

export default http;
