function normalizeDomain(value?: string): string | undefined {
    if (!value) return undefined;
    return value.trim().replace(/\/$/, '');
}

export function resolveAuthProviderDomain(env: Record<string, string | undefined> = process.env) {
    const serverDomain = normalizeDomain(env.CONVEX_SITE_URL ?? env.CONVEX_URL);
    return serverDomain ?? 'https://convex.cloud';
}

export const authConfig = {
    providers: [
        {
            domain: resolveAuthProviderDomain(),
            applicationID: 'convex',
        },
    ],
};

export default authConfig;

