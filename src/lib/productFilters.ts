import type { Product } from './types';

type ProductLike = Partial<Product> & {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  category: string;
  industry: string;
  fileType: string;
  tags: string[];
  images: string[];
  thumbnail: string;
  downloadableFiles: string[];
  version: string;
  changelog: string;
  faq: Array<{ question: string; answer: string }>;
  relatedProducts: string[];
  seoTitle: string;
  seoDescription: string;
  downloadLimit: number;
  downloadExpiry: number;
  status: 'active' | 'draft' | 'archived';
  featured: boolean;
  salesCount: number;
  createdAt?: string;
  updatedAt?: string;
  _creationTime?: number;
};

export interface ProductFilters {
  searchQuery: string;
  selectedCategory: string;
  selectedIndustry: string;
  selectedFileType: string;
  sortBy: 'newest' | 'popular' | 'price_low' | 'price_high';
  priceRange: [number, number];
}

export function getFilteredProducts(products: ProductLike[] = [], filters: ProductFilters) {
  let result = [...products.filter((product) => product.status === 'active')];
  const query = filters.searchQuery.trim().toLowerCase();

  if (query) {
    result = result.filter((product) => {
      const searchable = [
        product.name,
        product.shortDescription,
        product.category,
        product.industry,
        product.fileType,
        ...(product.tags || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchable.includes(query);
    });
  }

  if (filters.selectedCategory) {
    result = result.filter((product) => product.category === filters.selectedCategory);
  }

  if (filters.selectedIndustry) {
    result = result.filter((product) => product.industry === filters.selectedIndustry);
  }

  if (filters.selectedFileType) {
    result = result.filter((product) => product.fileType === filters.selectedFileType);
  }

  const [minPrice, maxPrice] = filters.priceRange;
  result = result.filter((product) => {
    const price = product.salePrice ?? product.price;
    return price >= minPrice && price <= maxPrice;
  });

  const getCreationTime = (product: ProductLike) => product._creationTime ?? 0;

  switch (filters.sortBy) {
    case 'popular':
      result.sort((a, b) => {
        const aScore = (a.salesCount || 0) + (a.featured ? 20 : 0);
        const bScore = (b.salesCount || 0) + (b.featured ? 20 : 0);
        if (bScore !== aScore) return bScore - aScore;
        return getCreationTime(b) - getCreationTime(a);
      });
      break;
    case 'price_low':
      result.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
      break;
    case 'price_high':
      result.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
      break;
    case 'newest':
    default:
      result.sort((a, b) => getCreationTime(b) - getCreationTime(a));
      break;
  }

  return result;
}
