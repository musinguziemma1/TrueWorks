// convex/auth.ts
// ============================================================
// AUTH CONFIGURATION (Convex Auth)
// ============================================================
// Backend entry point for Convex Auth. We expose:
//   • `signIn`, `signOut`, `signUp` – used by `useAuthActions()`
//     on the client to authenticate.
//   • `isAuthenticated` — public query for client guards.
//   • Auth helpers (see `./auth.helpers.ts`) used by Convex
//     queries/mutations to read the current user and assert
//     staff-only access.
//
// SECURITY NOTES
// ----------------
// • We do NOT override `Password`'s default `profile` function.
//   Overriding it to return only `{ email }` strips the account
//   `id` from the profile, which causes @convex-dev/auth's
//   `authAccounts.retrieveAccountWithCredentials` to fail with
//   `InvalidAccountId` on subsequent sign-ins. Letting the
//   provider use its default fixes this.
// • `beforeSessionCreation` enforces "staff must be pre-provisioned"
//   by reading the email from the auth `users` row (managed by
//   `authTables`) and checking that a matching staff record exists
//   in our domain `users` table. Throwing here cleanly rejects the
//   session token without leaving half-authed state behind.
// ============================================================

import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { getStaffByEmail } from "./auth.helpers";

export const { auth, signIn, signOut, isAuthenticated, store } = convexAuth({
    providers: [
        // Email + password auth. Use the defaults — DO NOT override
        // `profile`. See header note for why.
        Password,
    ],
    callbacks: {
        beforeSessionCreation: async (ctx, { userId }) => {
            const authUser = await ctx.db.get(userId);
            const email = (authUser as any)?.email as
                | string
                | undefined;

            if (!email) {
                throw new Error(
                    "Sign in failed: missing email on auth account.",
                );
            }

            // The `ctx` here is `GenericMutationCtx<AnyDataModel>`,
            // so we can't directly pass it to a typed helper that
            // accepts our generated `MutationCtx`. Casting to
            // any via a small conduit helper is the supported
            // workaround (see `auth.helpers.ts` -> getStaffByEmail
            // for the matching client-side constructor).
            const staff = await getStaffByEmail(
                ctx as any,
                email.toLowerCase(),
            );
            if (!staff) {
                throw new Error(
                    "This email is not provisioned as staff. Contact an administrator.",
                );
            }
        },
    },
});


