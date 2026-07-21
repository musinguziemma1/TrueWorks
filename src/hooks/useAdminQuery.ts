/**
 * useAdminQuery — wraps Convex's `useQuery` with automatic `skip`
 * when the auth session is loading or the user is not authenticated.
 *
 * During token refresh, `isLoading` briefly becomes true while the
 * new token is being fetched. Skipping queries in that window
 * prevents the server-side `requireStaffUser` from throwing
 * "Unauthorized: sign in required" on active subscriptions.
 */
import { useConvexAuth, useQuery } from 'convex/react';
import type { FunctionReference, OptionalRestArgs } from 'convex/server';

export function useAdminQuery<Query extends FunctionReference<'query'>>(
  query: Query,
  ...args: OptionalRestArgs<Query>
): ReturnType<typeof useQuery<Query>> {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const shouldSkip = isLoading || !isAuthenticated;
  const queryArgs = shouldSkip
    ? ('skip' as never)
    : (args[0] !== undefined ? args[0] : ({} as never));

  return useQuery(query, queryArgs) as ReturnType<typeof useQuery<Query>>;
}
