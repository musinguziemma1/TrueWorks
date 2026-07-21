import { describe, expect, it } from 'vitest';
import { getFilteredProducts } from './productFilters';
import type { Product } from './types';

const products: Product[] = [
  {
    _id: '1',
    sku: 'budget-dashboard',
    name: 'Budget Dashboard',
    slug: 'budget-dashboard',
    shortDescription: 'A practical finance dashboard',
    description: '',
    price: 100,
    category: 'Finance',
    industry: 'NGO',
    fileType: 'Excel (.xlsx)',
    tags: ['dashboard'],
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
    salesCount: 10,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-02',
  },
  {
    _id: '2',
    sku: 'hr-tracker',
    name: 'HR Tracker',
    slug: 'hr-tracker',
    shortDescription: 'Track people and leave requests',
    description: '',
    price: 200,
    category: 'HR',
    industry: 'School',
    fileType: 'Excel (.xlsm)',
    tags: ['hr'],
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
    salesCount: 30,
    createdAt: '2024-01-03',
    updatedAt: '2024-01-04',
  },
];

describe('getFilteredProducts', () => {
  it('filters by search text and sorts popular items first', () => {
    const result = getFilteredProducts(products, {
      searchQuery: 'dashboard',
      selectedCategory: '',
      selectedIndustry: '',
      selectedFileType: '',
      sortBy: 'popular',
      priceRange: [0, 1000000],
    });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Budget Dashboard');
  });
});
