import type { Product } from './types';

export interface ProductCatalogFilters {
  searchQuery?: string;
  selectedCategory?: string;
  selectedIndustry?: string;
  selectedFileType?: string;
  sortBy?: 'newest' | 'popular' | 'price_low' | 'price_high';
}

export function filterAndSortProducts(products: Product[], filters: ProductCatalogFilters = {}) {
  const {
    searchQuery = '',
    selectedCategory = '',
    selectedIndustry = '',
    selectedFileType = '',
    sortBy = 'newest',
  } = filters;

  let result = [...products];

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    result = result.filter((product) => {
      const haystack = `${product.name} ${product.shortDescription} ${product.category} ${product.industry}`.toLowerCase();
      return haystack.includes(query);
    });
  }

  if (selectedCategory) {
    result = result.filter((product) => product.category === selectedCategory);
  }

  if (selectedIndustry) {
    result = result.filter((product) => product.industry === selectedIndustry);
  }

  if (selectedFileType) {
    result = result.filter((product) => product.fileType === selectedFileType);
  }

  switch (sortBy) {
    case 'popular':
      result.sort((a, b) => b.salesCount - a.salesCount);
      break;
    case 'price_low':
      result.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
      break;
    case 'price_high':
      result.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? b.price));
      break;
    case 'newest':
    default:
      result.sort((a, b) => Number(b.createdAt || b.updatedAt || 0) - Number(a.createdAt || a.updatedAt || 0));
      break;
  }

  return result;
}

export function getProductBadges(product: Product) {
  const badges = [] as Array<{ label: string; tone: 'primary' | 'accent' | 'success' }>;

  if (product.featured) {
    badges.push({ label: 'Featured', tone: 'primary' });
  }

  if (product.salesCount >= 20) {
    badges.push({ label: 'Popular', tone: 'accent' });
  }

  if (product.salePrice) {
    badges.push({ label: 'Sale', tone: 'success' });
  }

  return badges;
}
