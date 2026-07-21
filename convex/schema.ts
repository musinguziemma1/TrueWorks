import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// ============================================================
// DATABASE SCHEMA
// ============================================================
// Spreads Convex Auth tables (users, sessions, accounts, etc.)
// alongside TrueWorks domain tables. Auth users get an `_id`
// we link to via `userId` on the existing `users` (admin staff)
// table — kept separate so customer vs. staff models stay
// distinct.
// ============================================================

export default defineSchema({
    // --------------------------------------------------------------
    // Convex Auth tables — auto-managed
    // --------------------------------------------------------------
    ...authTables,

    // --------------------------------------------------------------
    // TrueWorks domain tables
    // --------------------------------------------------------------
    products: defineTable({
      name: v.string(),
      sku: v.string(),
      slug: v.string(),
      shortDescription: v.string(),
      description: v.string(),
      price: v.number(),
      salePrice: v.optional(v.number()),
      category: v.string(),
      industry: v.string(),
      fileType: v.string(),
      tags: v.array(v.string()),
      images: v.array(v.string()),
      thumbnail: v.string(),
      downloadableFiles: v.array(v.string()),
      // ID of the file uploaded to Convex file storage. Download URLs
      // are issued via `fileStorage.getUrl`, only after the downloads
      // table validates the requestor isn't over their limit.
      fileStorageId: v.optional(v.id("_storage")),
      version: v.string(),
      changelog: v.string(),
      demoUrl: v.optional(v.string()),
      whatsInside: v.optional(v.array(v.string())),
      fileCompatibility: v.optional(v.string()),
      faq: v.array(v.object({
        question: v.string(),
        answer: v.string(),
      })),
      relatedProducts: v.array(v.id("products")),
      seoTitle: v.string(),
      seoDescription: v.string(),
      downloadLimit: v.number(),
      downloadExpiry: v.number(),
      status: v.union(v.literal("active"), v.literal("draft"), v.literal("archived")),
      featured: v.boolean(),
      salesCount: v.number(),
      createdAt: v.optional(v.string()),
      updatedAt: v.optional(v.string()),
    })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_industry", ["industry"])
    .index("by_status", ["status"])
    .index("by_featured", ["featured"])
    .searchIndex("search_name", { searchField: "name" }),

  orders: defineTable({
    orderNumber: v.string(),
    customerId: v.id("customers"),
    customer: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.optional(v.string()),
    }),
    items: v.array(v.object({
      productId: v.id("products"),
      productName: v.string(),
      quantity: v.number(),
      price: v.number(),
    })),
    subtotal: v.number(),
    total: v.number(),
    discount: v.optional(v.number()),
    coupon: v.optional(v.string()),
    paymentMethod: v.union(
      v.literal("mtn_momo"),
      v.literal("airtel_money"),
      v.literal("visa"),
      v.literal("mastercard"),
      v.literal("pesapal")
    ),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    orderStatus: v.union(
      v.literal("processing"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    downloadLinks: v.array(v.object({
      productId: v.id("products"),
      productName: v.string(),
      url: v.string(),
      downloadCount: v.number(),
      remainingDownloads: v.number(),
      expiryDate: v.string(),
      status: v.union(v.literal("active"), v.literal("expired"), v.literal("disabled")),
    })),
    notes: v.optional(v.string()),
  })
    .index("by_orderNumber", ["orderNumber"])
    .index("by_customer", ["customerId"])
    .index("by_paymentStatus", ["paymentStatus"])
    .index("by_orderStatus", ["orderStatus"]),

  customers: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    industry: v.optional(v.string()),
    newsletter: v.boolean(),
    favoriteCategories: v.array(v.string()),
    lifetimeValue: v.number(),
    totalOrders: v.number(),
    totalDownloads: v.number(),
    lastPurchaseAt: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_newsletter", ["newsletter"])
    .searchIndex("search_customer", { searchField: "name" }),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    icon: v.string(),
    image: v.optional(v.string()),
    productCount: v.number(),
    parent: v.optional(v.id("categories")),
  })
    .index("by_slug", ["slug"]),

  industries: defineTable({
    name: v.string(),
    slug: v.string(),
    icon: v.string(),
    description: v.string(),
    productCount: v.number(),
  })
    .index("by_slug", ["slug"]),

  reviews: defineTable({
    productId: v.id("products"),
    customerId: v.optional(v.id("customers")),
    customerName: v.string(),
    rating: v.number(),
    title: v.string(),
    content: v.string(),
    featured: v.boolean(),
    approved: v.boolean(),
  })
    .index("by_product", ["productId"])
    .index("by_featured", ["featured"])
    .index("by_approved", ["approved"]),

  coupons: defineTable({
    code: v.string(),
    type: v.union(v.literal("percentage"), v.literal("fixed"), v.literal("bundle")),
    value: v.number(),
    minPurchase: v.optional(v.number()),
    usageLimit: v.number(),
    usageCount: v.number(),
    expiresAt: v.string(),
    active: v.boolean(),
  })
    .index("by_code", ["code"]),

  blogPosts: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    image: v.string(),
    author: v.string(),
    readingTime: v.number(),
    featured: v.boolean(),
    publishedAt: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_featured", ["featured"])
    .searchIndex("search_blog", { searchField: "title" }),

  resources: defineTable({
    title: v.string(),
    type: v.union(v.literal("article"), v.literal("guide"), v.literal("template"), v.literal("case_study")),
    description: v.string(),
    image: v.string(),
    url: v.string(),
    featured: v.boolean(),
    category: v.string(),
  })
    .index("by_featured", ["featured"]),

  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("admin"),
      v.literal("store_manager"),
      v.literal("content_editor"),
      v.literal("marketing"),
      v.literal("support"),
      v.literal("finance")
    ),
    avatar: v.optional(v.string()),
    permissions: v.array(v.string()),
    twoFactorEnabled: v.boolean(),
    lastLogin: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  payments: defineTable({
    orderId: v.id("orders"),
    orderNumber: v.string(),
    amount: v.number(),
    method: v.union(
      v.literal("mtn_momo"),
      v.literal("airtel_money"),
      v.literal("visa"),
      v.literal("mastercard"),
      v.literal("pesapal")
    ),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed"), v.literal("refunded")),
    reference: v.string(),
  })
    .index("by_order", ["orderId"])
    .index("by_status", ["status"])
    .index("by_reference", ["reference"]),

  notifications: defineTable({
    title: v.string(),
    message: v.string(),
    type: v.union(v.literal("order"), v.literal("payment"), v.literal("review"), v.literal("support"), v.literal("system")),
    read: v.boolean(),
  })
    .index("by_read", ["read"])
    .index("by_type", ["type"]),

  pageSections: defineTable({
    type: v.union(v.literal("hero"), v.literal("featured"), v.literal("testimonial"), v.literal("cta"), v.literal("content")),
    title: v.string(),
    content: v.string(),
    image: v.optional(v.string()),
    ctaText: v.optional(v.string()),
    ctaLink: v.optional(v.string()),
    order: v.number(),
    active: v.boolean(),
  })
    .index("by_order", ["order"]),

  navigation: defineTable({
    label: v.string(),
    url: v.string(),
    parentId: v.optional(v.id("navigation")),
    order: v.number(),
    badge: v.optional(v.string()),
  })
    .index("by_parent", ["parentId"]),

  downloads: defineTable({
    productId: v.id("products"),
    customerId: v.id("customers"),
    orderId: v.id("orders"),
    downloadCount: v.number(),
    remainingDownloads: v.number(),
    expiryDate: v.string(),
    device: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("expired"), v.literal("disabled")),
  })
    .index("by_product", ["productId"])
    .index("by_customer", ["customerId"])
    .index("by_order", ["orderId"])
    .index("by_status", ["status"]),

  activityLogs: defineTable({
    userId: v.optional(v.id("users")),
    action: v.string(),
    resource: v.string(),
    resourceId: v.optional(v.string()),
    details: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_resource", ["resource"]),

  supportTickets: defineTable({
    customerName: v.string(),
    customerEmail: v.string(),
    subject: v.string(),
    message: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    status: v.union(v.literal("open"), v.literal("pending"), v.literal("resolved"), v.literal("closed")),
    category: v.optional(v.string()),
    assignedTo: v.optional(v.id("users")),
    orderId: v.optional(v.id("orders")),
    attachments: v.array(v.string()),
    resolution: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_priority", ["priority"]),

  settings: defineTable({
    key: v.string(),
    value: v.string(),
  })
    .index("by_key", ["key"]),
});
