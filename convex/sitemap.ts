// convex/sitemap.ts
// ============================================================
// SITEMAP DATA — internal queries powering /sitemap.xml
// ============================================================
// Kept separate from products/content modules so the HTTP
// route can fetch slugs in a single round trip.
// ============================================================

import { query, internalQuery } from "./_generated/server";

/** All active product slugs for the sitemap. */
export const listProductSlugs = internalQuery({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db
            .query("products")
            .withIndex("by_status", (q) => q.eq("status", "active"))
            .collect();
        return products.map((p) => ({
            slug: p.slug,
            updatedAt: p.updatedAt,
        }));
    },
});

/** All blog posts for the sitemap. */
export const listBlogSlugs = internalQuery({
    args: {},
    handler: async (ctx) => {
        const posts = await ctx.db.query("blogPosts").collect();
        return posts.map((p) => ({
            slug: p.slug,
            publishedAt: p.publishedAt,
        }));
    },
});
