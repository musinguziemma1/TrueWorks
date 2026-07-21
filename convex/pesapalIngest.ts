// convex/pesapalIngest.ts
// ============================================================
// PESAPAL API CLIENT (Node runtime)
// ============================================================
// Server-only actions that talk to the Pesapal API. Inside
// Node-runtime modules only `internalAction` is allowed, so
// all database writes fan out to mutations defined in
// `pesapalIngestOps.ts`.
//
// Flow:
//   1. Customer pays on Pesapal.
//   2. Pesapal posts to /api/pesapal/ipn (http.ts).
//   3. http.ts -> `processIPN` action below.
//   4. `processIPN` re-confirms status with Pesapal.
//   5. Maps status and dispatches `applyPaymentStatus` mutation
//      (idempotent via single index lookup + status check).
// ============================================================

"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------
interface PesapalAuthResponse {
    token: string;
    expiryDate: string;
}

interface PesapalOrderResponse {
    order_tracking_id: string;
    merchant_reference: string;
    redirect_url: string;
    error?: { message?: string };
}

interface PesapalStatusResponse {
    payment_status_description: string;
    payment_status_code: number;
    merchant_reference: string;
    order_tracking_id: string;
    payment_method?: string;
    amount?: number;
    confirmation_code?: string;
}

// ------------------------------------------------------------
// CONFIG — read secrets from typed env. NEVER seen by client.
// Set via `npx convex env set PESAPAL_*` commands.
// ------------------------------------------------------------
function getConfig() {
    const env = process.env as Record<string, string | undefined>;
    return {
        consumerKey: env.PESAPAL_CONSUMER_KEY ?? "",
        consumerSecret: env.PESAPAL_CONSUMER_SECRET ?? "",
        ipnId: env.PESAPAL_IPN_ID ?? "",
        env: env.PESAPAL_ENV ?? "sandbox",
        ipnUrl: env.PESAPAL_IPN_URL ?? "",
    };
}

const BASE_URLS = {
    sandbox: "https://cybqa.pesapal.com",
    live: "https://pay.pesapal.com",
} as const;

// Simple in-memory cache for the auth token (per-process).
let cachedToken: { token: string; expires: number } | null = null;
const TOKEN_SKEW_MS = 60_000;

// ------------------------------------------------------------
// AUTH — exchange credentials for a bearer token.
// ------------------------------------------------------------
export const requestAuthToken = internalAction({
    args: {},
    handler: async (): Promise<string> => {
        const cfg = getConfig();
        const base = BASE_URLS[(cfg.env as keyof typeof BASE_URLS)] ?? BASE_URLS.sandbox;

        if (cachedToken && cachedToken.expires - TOKEN_SKEW_MS > Date.now()) {
            return cachedToken.token;
        }

        const res = await fetch(`${base}/api/Auth/RequestToken`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
                consumer_key: cfg.consumerKey,
                consumer_secret: cfg.consumerSecret,
            }),
        });

        if (!res.ok) {
            throw new Error(`Pesapal auth failed: HTTP ${res.status}`);
        }
        const data = (await res.json()) as PesapalAuthResponse;
        cachedToken = { token: data.token, expires: new Date(data.expiryDate).getTime() };
        return data.token;
    },
});

// ------------------------------------------------------------
// SUBMIT ORDER — register an order with Pesapal, get redirect URL.
// ------------------------------------------------------------
export const submitOrderRequest = internalAction({
    args: {
        orderId: v.string(),
        amount: v.number(),
        currency: v.string(),
        description: v.string(),
        customerEmail: v.string(),
        customerPhone: v.optional(v.string()),
        firstName: v.string(),
        lastName: v.optional(v.string()),
        callbackUrl: v.string(),
    },
    handler: async (ctx, args): Promise<PesapalOrderResponse> => {
        const cfg = getConfig();
        const base = BASE_URLS[(cfg.env as keyof typeof BASE_URLS)] ?? BASE_URLS.sandbox;
        const token = await ctx.runAction(internal.pesapalIngest.requestAuthToken, {});

        const body = {
            id: args.orderId,
            currency: args.currency,
            amount: args.amount,
            description: args.description,
            callback_url: args.callbackUrl,
            notification_id: cfg.ipnId,
            billing_address: {
                email_address: args.customerEmail,
                phone_number: args.customerPhone ?? "",
                country_code: "US",
                first_name: args.firstName,
                last_name: args.lastName ?? "",
                line_1: "",
                city: "",
                state: "",
                postal_code: "",
                zip_code: "",
            },
        };

        const res = await fetch(`${base}/api/Transactions/SubmitOrderRequest`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        const data = (await res.json()) as PesapalOrderResponse;
        if (data.error) {
            throw new Error(`Pesapal submit failed: ${data.error.message}`);
        }
        return data;
    },
});

// ------------------------------------------------------------
// POLL STATUS — used by IPN re-confirmation and order page.
// ------------------------------------------------------------
export const getTransactionStatus = internalAction({
    args: { orderTrackingId: v.string() },
    handler: async (ctx, args): Promise<PesapalStatusResponse> => {
        const cfg = getConfig();
        const base = BASE_URLS[(cfg.env as keyof typeof BASE_URLS)] ?? BASE_URLS.sandbox;
        const token = await ctx.runAction(internal.pesapalIngest.requestAuthToken, {});

        const url = new URL(`${base}/api/Transactions/GetTransactionStatus`);
        url.searchParams.set("orderTrackingId", args.orderTrackingId);

        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error(`Pesapal status failed: HTTP ${res.status}`);
        }
        return (await res.json()) as PesapalStatusResponse;
    },
});

// ------------------------------------------------------------
// IPN PROCESSING — called by http.ts webhook.
//
// Re-confirms with Pesapal to prevent spoofing, then writes
// the canonical state via the `applyPaymentStatus` mutation
// (which is idempotent on the `by_reference` index).
// ------------------------------------------------------------
const VALID_STATUSES = ["COMPLETED", "FAILED", "REVERSED", "INVALID"] as const;
type ValidStatus = (typeof VALID_STATUSES)[number];

export const processIPN = internalAction({
    args: {
        orderTrackingId: v.string(),
        orderMerchantReference: v.string(),
        notificationType: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Step 1 — re-confirm so IPN isn't spoofable.
        let confirmed: PesapalStatusResponse;
        try {
            confirmed = await ctx.runAction(
                internal.pesapalIngest.getTransactionStatus,
                { orderTrackingId: args.orderTrackingId }
            );
        } catch (err) {
            console.error("[processIPN] status check failed", err);
            await ctx.runMutation(internal.pesapalIngestOps.logFailedIPN, {
                orderTrackingId: args.orderTrackingId,
                orderMerchantReference: args.orderMerchantReference,
                reason: "status_check_failed",
                notificationType: args.notificationType ?? null,
            });
            return;
        }

        const status = (confirmed.payment_status_description || "").toUpperCase();
        if (!status) {
            await ctx.runMutation(internal.pesapalIngestOps.logFailedIPN, {
                orderTrackingId: args.orderTrackingId,
                orderMerchantReference: args.orderMerchantReference,
                reason: "empty_status",
                notificationType: args.notificationType ?? null,
            });
            return;
        }

        // Step 2 — map Pesapal statuses to our internal set.
        let mapped: ValidStatus;
        if (status === "COMPLETED" || confirmed.payment_status_code === 1) {
            mapped = "COMPLETED";
        } else if (status === "FAILED" || confirmed.payment_status_code === 2) {
            mapped = "FAILED";
        } else if (status === "REVERSED" || confirmed.payment_status_code === 3) {
            mapped = "REVERSED";
        } else {
            mapped = "INVALID";
        }

        // Step 3 — apply.
        await ctx.runMutation(internal.pesapalIngestOps.applyPaymentStatus, {
            orderTrackingId: args.orderTrackingId,
            orderMerchantReference: args.orderMerchantReference,
            status: mapped,
            paymentMethod: confirmed.payment_method ?? null,
            amount: confirmed.amount ?? null,
            confirmationCode: confirmed.confirmation_code ?? null,
        });
    },
});
