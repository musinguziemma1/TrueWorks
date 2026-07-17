export interface Product {
  _id: string;
  name: string;
  sku: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  industry: string;
  fileType: string;
  tags: string[];
  images: string[];
  thumbnail: string;
  downloadableFiles: string[];
  version: string;
  changelog: string;
  demoUrl?: string;
  whatsInside?: string[];
  fileCompatibility?: string;
  faq: FAQ[];
  relatedProducts: string[];
  seoTitle: string;
  seoDescription: string;
  downloadLimit: number;
  downloadExpiry: number;
  status: 'active' | 'draft' | 'archived';
  featured: boolean;
  salesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerId: string;
  customer: CustomerBrief;
  items: OrderItem[];
  subtotal: number;
  total: number;
  discount?: number;
  coupon?: string;
  paymentMethod: 'mtn_momo' | 'airtel_money' | 'visa' | 'mastercard' | 'pesapal';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  orderStatus: 'processing' | 'completed' | 'cancelled';
  downloadLinks: DownloadLink[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface CustomerBrief {
  name: string;
  email: string;
  phone?: string;
}

export interface DownloadLink {
  productId: string;
  productName: string;
  url: string;
  downloadCount: number;
  remainingDownloads: number;
  expiryDate: string;
  status: 'active' | 'expired' | 'disabled';
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  industry?: string;
  newsletter: boolean;
  favoriteCategories: string[];
  lifetimeValue: number;
  totalOrders: number;
  totalDownloads: number;
  createdAt: string;
  lastPurchaseAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  icon: string;
  productCount: number;
  parent?: string;
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  productCount: number;
}

export interface AnalyticsData {
  totalRevenue: number;
  revenueToday: number;
  revenueThisMonth: number;
  totalOrders: number;
  pendingOrders: number;
  successfulPayments: number;
  productsSold: number;
  activeProducts: number;
  totalDownloads: number;
  activeCustomers: number;
  newsletterSubscribers: number;
  conversionRate: number;
  averageOrderValue: number;
  storePerformanceScore: number;
}

export interface SalesTrend {
  date: string;
  revenue: number;
  orders: number;
}

export interface PageSection {
  id: string;
  type: 'hero' | 'featured' | 'testimonial' | 'cta' | 'content';
  title: string;
  content: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  active: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  children?: NavigationItem[];
  badge?: string;
}

export interface Review {
  _id: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number;
  title: string;
  content: string;
  featured: boolean;
  approved: boolean;
  createdAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'bundle';
  value: number;
  minPurchase?: number;
  usageLimit: number;
  usageCount: number;
  expiresAt: string;
  active: boolean;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  image: string;
  author: string;
  readingTime: number;
  featured: boolean;
  publishedAt: string;
  createdAt: string;
}

export interface Resource {
  _id: string;
  title: string;
  type: 'article' | 'guide' | 'template' | 'case_study';
  description: string;
  image: string;
  url: string;
  featured: boolean;
  category: string;
  createdAt: string;
}

export type UserRole = 'admin' | 'store_manager' | 'content_editor' | 'marketing' | 'support' | 'finance';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  permissions: string[];
  twoFactorEnabled: boolean;
  lastLogin: string;
  createdAt: string;
}

export interface PaymentTransaction {
  _id: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  method: 'mtn_momo' | 'airtel_money' | 'visa' | 'mastercard' | 'pesapal';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  reference: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'review' | 'support' | 'system';
  read: boolean;
  createdAt: string;
}
