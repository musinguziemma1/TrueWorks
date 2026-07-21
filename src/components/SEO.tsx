// src/components/SEO.tsx
// ============================================================
// SEO META TAGS
// ============================================================
// Reusable component for per-page meta tags (title,
// description, Open Graph, Twitter cards, JSON-LD).
// Usage: `<SEO title="..." description="..." canonical="..." />`
//
// If not provided, defaults pull from a single source of
// truth so every page stays consistent.
// ============================================================

import { Helmet } from 'react-helmet-async';

const SITE = 'TrueWorks';
const DEFAULT_TITLE = 'Premium Excel Templates & Business Systems | TrueWorks';
const DEFAULT_DESC =
  'Institution-grade Excel templates, financial models, dashboards and business systems built for hospitals, NGOs, churches, schools and growing businesses.';
const DEFAULT_OG_IMAGE = 'https://trueworks.com/og-image.png';
const BASE_URL = 'https://trueworks.com';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  jsonLd?: Record<string, unknown>;
}

export function SEO({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  jsonLd,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE}` : DEFAULT_TITLE;
  const desc = description || DEFAULT_DESC;
  const url = canonical ? `${BASE_URL}${canonical}` : BASE_URL;
  const image = ogImage || DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />

      {/* Structured data (JSON-LD) */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: SITE,
            url: BASE_URL,
            logo: `${BASE_URL}/logo.png`,
            ...jsonLd,
          })}
        </script>
      )}
    </Helmet>
  );
}
