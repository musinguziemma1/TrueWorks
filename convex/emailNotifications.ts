// convex/emailNotifications.ts
// ============================================================
// TRANSACTIONAL EMAIL (Resend)
// ============================================================
// Sends customer-facing transactional emails using Resend.
// All functions are server-side actions so the API key
// stays in env, never the client.
//
// Wire up:
//   • Create a Resend account: https://resend.com
//   • Verify your domain
//   • `npx convex env set RESEND_API_KEY "..."`
//   • `npx convex env set RESEND_FROM_EMAIL "orders@trueworks.com"`
//
// When Resend is not configured, all functions log the message
// to the activity log so dev environments still see what
// would have been sent.
// ============================================================

"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Resend } from "resend";

// ------------------------------------------------------------
// CONFIG — read secrets from typed env. NEVER seen by client.
// ------------------------------------------------------------
function getClient() {
    const env = process.env as Record<string, string | undefined>;
    const key = env.RESEND_API_KEY;
    if (!key) return null;
    return new Resend(key);
}

function getFromAddress() {
    const env = process.env as Record<string, string | undefined>;
    return env.RESEND_FROM_EMAIL ?? "no-reply@trueworks.local";
}

function getBrand() {
    return {
        name: "TrueWorks Limited",
        logo: "https://trueworks.com/logo.png",
        supportEmail: "support@trueworks.com",
        baseUrl: process.env.SITE_URL ?? "https://trueworks.com",
    };
}

// The customer-facing helper shape expected by templates.
export interface OrderEmailData {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    total: number;
    items: { name: string; price: number }[];
    orderUrl: string;
}

// ============================================================
// TEMPLATES
// ============================================================
const TEMPLATES = {
    orderReceipt: (data: OrderEmailData) => `
<!doctype html><html lang="en"><head><meta charset="utf-8"></head>
<body style="font-family:Calibri,system-ui,sans-serif;background:#F2F5F9;margin:0;padding:32px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;border:1px solid #E5E7EB;">
    <div style="background:#0B2545;color:#fff;padding:24px;">
      <h1 style="margin:0;font-size:22px;">Your order is confirmed</h1>
      <p style="margin:8px 0 0;opacity:.8;">${data.orderNumber}</p>
    </div>
    <div style="padding:24px;">
      <p>Hi ${data.customerName},</p>
      <p>Your payment was successful. Below are your items. Each download can be used up to <strong>5 times</strong> and expires in <strong>7 days</strong>.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <thead><tr style="background:#F2F5F9;">
          <th style="text-align:left;padding:8px 12px;border:1px solid #E5E7EB;font-size:12px;">Item</th>
          <th style="text-align:right;padding:8px 12px;border:1px solid #E5E7EB;font-size:12px;">Price</th>
        </tr></thead>
        <tbody>
          ${data.items.map((i) => `<tr>
            <td style="padding:8px 12px;border:1px solid #E5E7EB;">${i.name}</td>
            <td style="padding:8px 12px;border:1px solid #E5E7EB;text-align:right;">$${i.price.toFixed(2)}</td>
          </tr>`).join("")}
        </tbody>
        <tfoot>
          <tr>
            <td style="padding:8px 12px;border:1px solid #E5E7EB;text-align:right;font-weight:bold;">Total</td>
            <td style="padding:8px 12px;border:1px solid #E5E7EB;text-align:right;font-weight:bold;">$${data.total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      <a href="${data.orderUrl}" style="display:inline-block;background:#C9A227;color:#0B2545;padding:10px 18px;border-radius:6px;font-weight:700;text-decoration:none;">
        View order & download files
      </a>
      <p style="font-size:12px;color:#94A3B8;margin-top:24px;">
        Need help? Reply to this email or contact us at ${getBrand().supportEmail}.
      </p>
    </div>
  </div>
</body></html>`,
    paymentFailed: (data: { orderNumber: string; reason: string }) => `
<!doctype html><html lang="en"><head><meta charset="utf-8"></head>
<body style="font-family:Calibri,system-ui,sans-serif;padding:32px;background:#F2F5F9;">
  <div style="max-width:560px;margin:0 auto;background:#fff;padding:24px;border-radius:10px;border:1px solid #E5E7EB;">
    <h1 style="color:#DC2626;margin-top:0;">Payment failed</h1>
    <p>We couldn't process your payment for order <strong>${data.orderNumber}</strong>.</p>
    <p>Reason: <code>${data.reason}</code></p>
    <p>You can retry the payment any time from your order page.</p>
  </div>
</body></html>`,
    welcome: (data: { name?: string }) => `
<!doctype html><html lang="en"><head><meta charset="utf-8"></head>
<body style="font-family:Calibri,sans-serif;padding:32px;background:#F2F5F9;">
<div style="max-width:560px;margin:0 auto;background:#fff;padding:32px;border-radius:10px;border:1px solid #E5E7EB;">
  <h1 style="color:#0B2545;margin-top:0;">Welcome to TrueWorks</h1>
  <p>Hi ${data.name ?? "there"},</p>
  <p>Your free Hospital KPI Dashboard template is on its way. Watch your inbox.</p>
  <p>In the meantime, browse our most popular templates:</p>
  <a href="${getBrand().baseUrl}/store" style="display:inline-block;background:#C9A227;color:#0B2545;padding:10px 18px;border-radius:6px;font-weight:700;text-decoration:none;">Open the store</a>
</div>
</body></html>`,
};

// ============================================================
// DISPATCH
// ============================================================
async function dispatch(args: { to: string; subject: string; html: string }) {
    const client = getClient();
    if (!client) {
        console.log("[email/dryrun]", JSON.stringify({ to: args.to, subject: args.subject }));
        return { sent: false, reason: "resend_not_configured" };
    }
    try {
        const result = await client.emails.send({
            from: getFromAddress(),
            to: args.to,
            subject: args.subject,
            html: args.html,
        });
        return { sent: true, id: (result as any)?.data?.id ?? null };
    } catch (err) {
        console.error("[email/send] error", err);
        return { sent: false, reason: String(err) };
    }
}

// ============================================================
// PUBLIC ACTIONS (callable via internal.emailNotifications.*)
// ============================================================

/** Send a receipt when an order is paid. */
export const sendOrderReceipt = internalAction({
    args: { orderId: v.id("orders") },
    handler: async (ctx, args) => {
        const order = await ctx.runQuery(internal.emailNotificationsOps.fetchOrder, {
            orderId: args.orderId,
        });
        if (!order) return { sent: false, reason: "order_not_found" };

        const customer = await ctx.runQuery(internal.emailNotificationsOps.fetchCustomer, {
            customerId: order.customerId,
        });
        if (!customer) return { sent: false, reason: "customer_not_found" };

        const data: OrderEmailData = {
            orderNumber: order.orderNumber,
            customerName: customer.name,
            customerEmail: customer.email,
            total: order.total,
            items: order.items.map((i: any) => ({
                name: i.productName,
                price: i.price,
            })),
            orderUrl: `${getBrand().baseUrl}/order-confirmation?orderId=${args.orderId}`,
        };
        return await dispatch({
            to: data.customerEmail,
            subject: `Order ${data.orderNumber} confirmed`,
            html: TEMPLATES.orderReceipt(data),
        });
    },
});

/** Send a failure notice. */
export const sendPaymentFailed = internalAction({
    args: {
        orderId: v.id("orders"),
        reason: v.string(),
    },
    handler: async (ctx, args): Promise<{ sent: boolean; reason?: string }> => {
        const order = await ctx.runQuery(internal.emailNotificationsOps.fetchOrder, {
            orderId: args.orderId,
        });
        if (!order) return { sent: false, reason: "order_not_found" };

        const customer = await ctx.runQuery(internal.emailNotificationsOps.fetchCustomer, {
            customerId: order.customerId,
        });
        if (!customer) return { sent: false };
        return await dispatch({
            to: customer.email,
            subject: `Payment failed for ${order.orderNumber}`,
            html: TEMPLATES.paymentFailed({ orderNumber: order.orderNumber, reason: args.reason }),
        });
    },
});

/** Welcome email for new newsletter subscribers. */
export const sendWelcome = internalAction({
    args: {
        email: v.string(),
        name: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await dispatch({
            to: args.email,
            subject: "Welcome to TrueWorks",
            html: TEMPLATES.welcome({ name: args.name }),
        });
    },
});
