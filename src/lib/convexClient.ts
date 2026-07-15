import { ConvexReactClient } from 'convex/react';

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;

export const convexClient = CONVEX_URL
  ? new ConvexReactClient(CONVEX_URL)
  : null;
