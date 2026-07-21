import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { LayoutOriginal } from '../../components/layouts/LayoutOriginal';
import { LayoutShowroom } from '../../components/layouts/LayoutShowroom';
import { LayoutEditorial } from '../../components/layouts/LayoutEditorial';
import { LayoutTrust } from '../../components/layouts/LayoutTrust';
import { SEO } from '../../components/SEO';

export function Home() {
  const layout = useQuery(api.settings.getHomeLayout);

  return (
    <>
      <SEO
        title="Premium Excel Templates & Business Systems"
        description="Institution-grade Excel templates, financial models, dashboards and business systems built for hospitals, NGOs, churches, schools and growing businesses across East Africa."
        canonical="/"
        jsonLd={{
          '@type': 'WebSite',
          name: 'TrueWorks',
          url: 'https://trueworks.com',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://trueworks.com/store?search={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      {layout === 'original' && <LayoutOriginal />}
      {layout === 'editorial' && <LayoutEditorial />}
      {layout === 'trust' && <LayoutTrust />}
      {(!layout || layout === 'showroom') && <LayoutShowroom />}
    </>
  );
}
