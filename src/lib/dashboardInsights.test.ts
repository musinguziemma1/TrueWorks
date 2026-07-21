import { describe, expect, it } from 'vitest';
import { buildActionItems, getTrendSummary } from './dashboardInsights';

describe('getTrendSummary', () => {
  it('returns a positive trend when current exceeds previous', () => {
    expect(getTrendSummary(120, 100)).toEqual({ value: '+20%', positive: true });
  });

  it('returns a negative trend when current is lower', () => {
    expect(getTrendSummary(80, 100)).toEqual({ value: '-20%', positive: false });
  });

  it('handles zero previous values gracefully', () => {
    expect(getTrendSummary(5, 0)).toEqual({ value: 'New', positive: true });
  });
});

describe('buildActionItems', () => {
  it('highlights operational follow-ups from the current metrics', () => {
    const items = buildActionItems({
      pendingOrders: 3,
      openSupportTickets: 2,
      pendingReviews: 1,
      newsletterSubscribers: 120,
      activeProducts: 12,
    });

    expect(items).toEqual([
      expect.objectContaining({ title: 'Review pending orders' }),
      expect.objectContaining({ title: 'Handle support tickets' }),
      expect.objectContaining({ title: 'Moderate new reviews' }),
    ]);
  });
});
