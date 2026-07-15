import { create } from 'zustand';
import type { Product } from './types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  addItem: (product) => {
    const items = get().items;
    const existing = items.find(i => i.product._id === product._id);
    if (existing) {
      set({ items: items.map(i => i.product._id === product._id ? { ...i, quantity: i.quantity + 1 } : i) });
    } else {
      set({ items: [...items, { product, quantity: 1 }] });
    }
  },
  removeItem: (productId) => set({ items: get().items.filter(i => i.product._id !== productId) }),
  updateQuantity: (productId, quantity) => set({
    items: get().items.map(i => i.product._id === productId ? { ...i, quantity } : i),
  }),
  clearCart: () => set({ items: [] }),
  toggleCart: () => set({ isOpen: !get().isOpen }),
  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  subtotal: () => get().items.reduce((sum, i) => sum + (i.product.salePrice || i.product.price) * i.quantity, 0),
}));

interface UIStore {
  isMobileMenuOpen: boolean;
  isNewsletterOpen: boolean;
  searchQuery: string;
  setMobileMenuOpen: (open: boolean) => void;
  setNewsletterOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isMobileMenuOpen: false,
  isNewsletterOpen: false,
  searchQuery: '',
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setNewsletterOpen: (open) => set({ isNewsletterOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

interface FilterStore {
  selectedCategory: string;
  selectedIndustry: string;
  selectedFileType: string;
  sortBy: 'newest' | 'popular' | 'price_low' | 'price_high';
  priceRange: [number, number];
  setCategory: (category: string) => void;
  setIndustry: (industry: string) => void;
  setFileType: (fileType: string) => void;
  setSortBy: (sort: 'newest' | 'popular' | 'price_low' | 'price_high') => void;
  setPriceRange: (range: [number, number]) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  selectedCategory: '',
  selectedIndustry: '',
  selectedFileType: '',
  sortBy: 'newest',
  priceRange: [0, 1000000],
  setCategory: (category) => set({ selectedCategory: category }),
  setIndustry: (industry) => set({ selectedIndustry: industry }),
  setFileType: (fileType) => set({ selectedFileType: fileType }),
  setSortBy: (sortBy) => set({ sortBy }),
  setPriceRange: (range) => set({ priceRange: range }),
  resetFilters: () => set({ selectedCategory: '', selectedIndustry: '', selectedFileType: '', sortBy: 'newest', priceRange: [0, 1000000] }),
}));
