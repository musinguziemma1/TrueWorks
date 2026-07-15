import { create } from 'zustand';
import { Product, Order, Customer, Review } from './types';
import { products as mockProducts, orders as mockOrders, customers as mockCustomers, reviews as mockReviews } from './data';

interface AdminStore {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  reviews: Review[];

  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;

  updateOrderStatus: (id: string, status: 'processing' | 'completed' | 'cancelled') => void;
  updatePaymentStatus: (id: string, status: 'pending' | 'completed' | 'failed' | 'refunded') => void;

  approveReview: (id: string) => void;
  rejectReview: (id: string) => void;
  toggleFeaturedReview: (id: string) => void;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  products: mockProducts,
  orders: mockOrders,
  customers: mockCustomers,
  reviews: mockReviews,

  addProduct: (product) => set((s) => ({ products: [...s.products, product] })),

  updateProduct: (id, data) => set((s) => ({
    products: s.products.map((p) => (p._id === id ? { ...p, ...data } : p)),
  })),

  deleteProduct: (id) => set((s) => ({
    products: s.products.filter((p) => p._id !== id),
  })),

  duplicateProduct: (id) => set((s) => {
    const original = s.products.find((p) => p._id === id);
    if (!original) return s;
    const copy: Product = {
      ...original,
      _id: Date.now().toString(),
      name: `${original.name} (Copy)`,
      sku: `${original.sku}-COPY`,
      slug: `${original.slug}-copy`,
      status: 'draft',
      salesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return { products: [...s.products, copy] };
  }),

  updateOrderStatus: (id, orderStatus) => set((s) => ({
    orders: s.orders.map((o) => (o._id === id ? { ...o, orderStatus } : o)),
  })),

  updatePaymentStatus: (id, paymentStatus) => set((s) => ({
    orders: s.orders.map((o) => (o._id === id ? { ...o, paymentStatus } : o)),
  })),

  approveReview: (id) => set((s) => ({
    reviews: s.reviews.map((r) => (r._id === id ? { ...r, approved: true } : r)),
  })),

  rejectReview: (id) => set((s) => ({
    reviews: s.reviews.filter((r) => r._id !== id),
  })),

  toggleFeaturedReview: (id) => set((s) => ({
    reviews: s.reviews.map((r) => (r._id === id ? { ...r, featured: !r.featured } : r)),
  })),
}));
