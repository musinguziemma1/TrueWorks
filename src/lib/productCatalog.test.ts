import { describe, expect, it } from 'vitest';
import { filterAndSortProducts, getProductBadges } from './productCatalog';
import type { Product } from './types';

const sampleProducts: Product[] = [
  {
    _id: '1',
    name: 'Budget Dashboard',
    sku: 'BD-001',
    slug: 'budget-dashboard',
    shortDescription: 'A complete finance dashboard',
    description: 'Finance dashboard',
    price: 120,
    salePrice: 95,
    category: 'Finance',
    industry: 'Healthcare',
    fileType: 'Excel (.xlsx)',
    tags: [],
    images: [],
    thumbnail: '',
    downloadableFiles: [],
    version: '1.0',
    changelog: '',
    faq: [],
    relatedProducts: [],
    seoTitle: '',
    seoDescription: '',
    downloadLimit: 5,
    downloadExpiry: 7,
    status: 'active',
    featured: true,
    salesCount: 25,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    _id: '2',
    name: 'HR Tracker',
    sku: 'HR-001',
    slug: 'hr-tracker',
    shortDescription: 'Track employee records',
    description: 'HR tracker',
    price: 80,
    category: 'Operations',
    industry: 'Education',
    fileType: 'Excel (.xlsm)',
    tags: [],
    images: [],
    thumbnail: '',
    downloadableFiles: [],
    version: '1.0',
    changelog: '',
    faq: [],
    relatedProducts: [],
    seoTitle: '',
    seoDescription: '',
    downloadLimit: 5,
    downloadExpiry: 7,
    status: 'active',
    featured: false,
    salesCount: 8,
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01',
  },
];

describe('product catalog helpers', () => {
  it('filters and sorts products for store discovery', () => {
    const result = filterAndSortProducts(sampleProducts, {
      searchQuery: 'dashboard',
      selectedCategory: 'Finance',
      selectedIndustry: 'Healthcare',
      selectedFileType: 'Excel (.xlsx)',
      sortBy: 'price_low',
    });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Budget Dashboard');
  });

  it('returns a useful set of badges for product cards', () => {
    const badges = getProductBadges(sampleProducts[0]);
    expect(badges).toEqual(expect.arrayContaining([expect.objectContaining({ label: 'Featured' }), expect.objectContaining({ label: 'Popular' }), expect.objectContaining({ label: 'Sale' })]));
  });
});
