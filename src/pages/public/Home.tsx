import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { LayoutOriginal } from '../../components/layouts/LayoutOriginal';
import { LayoutShowroom } from '../../components/layouts/LayoutShowroom';
import { LayoutEditorial } from '../../components/layouts/LayoutEditorial';
import { LayoutTrust } from '../../components/layouts/LayoutTrust';

export function Home() {
  const layout = useQuery(api.settings.getHomeLayout);

  if (layout === 'original') return <LayoutOriginal />;
  if (layout === 'editorial') return <LayoutEditorial />;
  if (layout === 'trust') return <LayoutTrust />;
  return <LayoutShowroom />;
}
