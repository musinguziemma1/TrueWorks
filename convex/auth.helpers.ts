// convex/auth.helpers.ts
// ============================================================
// AUTH HELPER UTILITIES
// ============================================================
// Reusable helpers for enforcing authentication and role-based
// authorization inside Convex queries & mutations.
//
// Usage:
//   const me = await requireStaffUser(ctx, "admin");
//   // `me` is the staff profile (from the `users` table) – never
//   // the raw auth document.
// ============================================================

import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { QueryCtx, MutationCtx } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

// Allowed staff roles — keeps role checks in one place. These
// match the union literal in `schema.ts` -> users.role.
export type StaffRole =
    | "admin"
    | "store_manager"
    | "content_editor"
    | "marketing"
    | "support"
    | "finance";

/**
 * Resolve the TrueWorks `users` staff row backing the current
 * authenticated user, by email. Returns `null` when nobody is
 * signed in OR the auth user has no linked staff profile.
 *
 * Note: The Convex Auth id space and TrueWorks `users` doc id
 * are distinct by design — each Convex-auth user can map to at
 * most one staff profile.
 */
export async function getStaffUserId(
    ctx: QueryCtx | MutationCtx
): Promise<string | null> {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) return null;

    const identity = (ctx as any).auth?.getUserIdentity
        ? await (ctx as any).auth.getUserIdentity()
        : null;
    const email = identity?.email;
    if (!email) return null;

    const staff = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();

    return staff?._id ?? null;
}

/**
 * Throws if no one is signed in or the user lacks one of the
 * required staff roles. Returns the `users` row (not the raw
 * auth doc) for downstream use.
 */
export async function requireStaffUser(
    ctx: QueryCtx | MutationCtx,
    ...allowedRoles: StaffRole[]
): Promise<Doc<"users">> {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) {
        throw new Error("Unauthorized: sign in required");
    }

    // Derive staff profile from the auth user's email.
    const identity = (ctx as any).auth?.getUserIdentity
        ? await (ctx as any).auth.getUserIdentity()
        : null;
    const email = identity?.email;
    if (!email) {
        throw new Error("Unauthorized: missing identity");
    }

    const staff = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();

    if (!staff) {
        throw new Error("Unauthorized: staff profile not provisioned");
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(staff.role)) {
        throw new Error(
            `Forbidden: requires one of [${allowedRoles.join(", ")}], got "${staff.role}"`
        );
    }

    return staff;
}

/**
 * Convenience wrapper that only enforces sign-in (any role).
 */
export async function requireSignedIn(ctx: QueryCtx | MutationCtx) {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) {
        throw new Error("Unauthorized: sign in required");
    }
    return authUserId;
}

/**
 * Query-safe variant — returns the staff user doc or `null`.
 * Unlike `requireStaffUser` this never throws, so admin queries
 * can safely return `null` when not authenticated instead of
 * crashing the client with "Unauthorized" errors.
 */
export async function getStaffUserOrNull(
    ctx: QueryCtx | MutationCtx,
    ...allowedRoles: StaffRole[]
): Promise<Doc<"users"> | null> {
    try {
        return await requireStaffUser(ctx, ...allowedRoles);
    } catch {
        return null;
    }
}

/**
 * Non-throwing variant — returns `true` if the current caller is
 * signed in AND has a staff profile in the `users` table. Useful
 * for queries that need to branch behaviour (e.g. show drafts
 * only to staff) without rejecting public callers.
 */
export async function isStaffUser(
    ctx: QueryCtx | MutationCtx
): Promise<boolean> {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) return false;

    const identity = (ctx as any).auth?.getUserIdentity
        ? await (ctx as any).auth.getUserIdentity()
        : null;
    const email = identity?.email;
    if (!email) return false;

    const staff = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();

    return !!staff;
}

/**
 * Look up a staff profile by raw email address (already
 * normalized by the caller). Returns the staff row or null.
 *
 * The `ctx` type is intentionally permissive — callers may
 * come from the @convex-dev/auth callback boundary
 * (`GenericMutationCtx<AnyDataModel>`) which is type-
 * incompatible with our generated `MutationCtx` even though
 * the runtime shape is the same. Casting to `any` here is
 * safe because both sides expose the same `db.query` API.
 */
export async function getStaffByEmail(
    ctx: any,
    email: string
): Promise<Doc<"users"> | null> {
    if (!email) return null;
    return await ctx.db
        .query("users")
        .withIndex("by_email", (q: any) => q.eq("email", email))
        .first();
}

// ------------------------------------------------------------
// Validator — exposed for re-use inside mutation arg schemas.
// ------------------------------------------------------------
export const vStaffRole = v.union(
    v.literal("admin"),
    v.literal("store_manager"),
    v.literal("content_editor"),
    v.literal("marketing"),
    v.literal("support"),
    v.literal("finance")
);
