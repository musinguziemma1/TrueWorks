/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as analytics from "../analytics.js";
import type * as auth from "../auth.js";
import type * as categories from "../categories.js";
import type * as content from "../content.js";
import type * as coupons from "../coupons.js";
import type * as customers from "../customers.js";
import type * as downloadSecure from "../downloadSecure.js";
import type * as downloads from "../downloads.js";
import type * as emailNotifications from "../emailNotifications.js";
import type * as emailNotificationsOps from "../emailNotificationsOps.js";
import type * as http from "../http.js";
import type * as notifications from "../notifications.js";
import type * as orders from "../orders.js";
import type * as payments from "../payments.js";
import type * as payments_integration from "../payments_integration.js";
import type * as pesapalIngest from "../pesapalIngest.js";
import type * as pesapalIngestOps from "../pesapalIngestOps.js";
import type * as products from "../products.js";
import type * as reviews from "../reviews.js";
import type * as seed from "../seed.js";
import type * as settings from "../settings.js";
import type * as sitemap from "../sitemap.js";
import type * as supportTickets from "../supportTickets.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  analytics: typeof analytics;
  auth: typeof auth;
  categories: typeof categories;
  content: typeof content;
  coupons: typeof coupons;
  customers: typeof customers;
  downloadSecure: typeof downloadSecure;
  downloads: typeof downloads;
  emailNotifications: typeof emailNotifications;
  emailNotificationsOps: typeof emailNotificationsOps;
  http: typeof http;
  notifications: typeof notifications;
  orders: typeof orders;
  payments: typeof payments;
  payments_integration: typeof payments_integration;
  pesapalIngest: typeof pesapalIngest;
  pesapalIngestOps: typeof pesapalIngestOps;
  products: typeof products;
  reviews: typeof reviews;
  seed: typeof seed;
  settings: typeof settings;
  sitemap: typeof sitemap;
  supportTickets: typeof supportTickets;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
