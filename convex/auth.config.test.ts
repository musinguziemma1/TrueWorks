import { describe, expect, it } from 'vitest';
import { resolveAuthProviderDomain } from './auth.config';

describe('resolveAuthProviderDomain', () => {
  it('prefers the Convex site URL when available', () => {
    expect(
      resolveAuthProviderDomain({
        CONVEX_SITE_URL: 'https://site.convex.site',
        CONVEX_URL: 'https://other.convex.cloud',
      }),
    ).toBe('https://site.convex.site');
  });

  it('falls back to the Convex deployment URL when the site URL is missing', () => {
    expect(
      resolveAuthProviderDomain({
        CONVEX_URL: 'https://fallback.convex.cloud',
      }),
    ).toBe('https://fallback.convex.cloud');
  });

  it('uses the default Convex domain when no server env is set', () => {
    expect(resolveAuthProviderDomain({})).toBe('https://convex.cloud');
  });
});
