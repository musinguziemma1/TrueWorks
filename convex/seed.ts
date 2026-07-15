import { mutation } from "./_generated/server";

export const seed = mutation({
  handler: async (ctx) => {
    // Check if already seeded
    const existingProducts = await ctx.db.query("products").collect();
    if (existingProducts.length > 0) return { seeded: false, message: "Database already seeded" };

    // Categories
    const catIds = await Promise.all([
      ctx.db.insert("categories", { name: "Financial Models", slug: "financial-models", description: "Professional financial modeling templates", icon: "BarChart3", productCount: 12 }),
      ctx.db.insert("categories", { name: "Dashboards", slug: "dashboards", description: "Interactive KPI dashboards", icon: "LayoutDashboard", productCount: 18 }),
      ctx.db.insert("categories", { name: "Budget Templates", slug: "budget-templates", description: "Budget planning and tracking", icon: "Wallet", productCount: 8 }),
      ctx.db.insert("categories", { name: "HR Systems", slug: "hr-systems", description: "Human resource management systems", icon: "Users", productCount: 6 }),
      ctx.db.insert("categories", { name: "Project Management", slug: "project-management", description: "Project planning and tracking tools", icon: "ClipboardCheck", productCount: 7 }),
      ctx.db.insert("categories", { name: "Business Plans", slug: "business-plans", description: "Business planning templates", icon: "FileText", productCount: 5 }),
      ctx.db.insert("categories", { name: "Inventory Systems", slug: "inventory-systems", description: "Inventory management solutions", icon: "Package", productCount: 4 }),
      ctx.db.insert("categories", { name: "Bundles", slug: "bundles", description: "Discounted product bundles", icon: "Gift", productCount: 6 }),
    ]);

    // Industries
    await Promise.all([
      ctx.db.insert("industries", { name: "Healthcare", slug: "healthcare", icon: "HeartPulse", description: "Hospital & clinic management templates", productCount: 8 }),
      ctx.db.insert("industries", { name: "Business", slug: "business", icon: "Building2", description: "Corporate business systems", productCount: 24 }),
      ctx.db.insert("industries", { name: "Finance", slug: "finance", icon: "TrendingUp", description: "Financial analysis & planning tools", productCount: 15 }),
      ctx.db.insert("industries", { name: "NGO", slug: "ngo", icon: "HandHeart", description: "Non-profit management systems", productCount: 7 }),
      ctx.db.insert("industries", { name: "HR", slug: "hr", icon: "UserCheck", description: "Human resource management", productCount: 6 }),
      ctx.db.insert("industries", { name: "Schools", slug: "schools", icon: "GraduationCap", description: "Educational institution systems", productCount: 5 }),
      ctx.db.insert("industries", { name: "Churches", slug: "churches", icon: "Church", description: "Church administration templates", productCount: 4 }),
      ctx.db.insert("industries", { name: "Agriculture", slug: "agriculture", icon: "Sprout", description: "Farm & agribusiness templates", productCount: 3 }),
    ]);

    // Products
    const prod1 = await ctx.db.insert("products", {
      name: "Hospital KPI Dashboard Pro", sku: "TW-HKD-001", slug: "hospital-kpi-dashboard-pro",
      shortDescription: "Comprehensive hospital performance dashboard with 45+ KPI metrics, real-time bed occupancy tracking, and financial reporting.",
      description: "A complete hospital performance management system designed for Ugandan and East African healthcare facilities. Track patient admissions, bed occupancy, revenue per bed, staff productivity, and clinical outcomes.",
      price: 150000, salePrice: 99000, category: "Dashboards", industry: "Healthcare",
      fileType: "Excel (.xlsx)", tags: ["hospital", "kpi", "dashboard", "healthcare"], images: [], thumbnail: "",
      downloadableFiles: ["hospital-kpi-dashboard.xlsx"], version: "2.3", changelog: "Added bed occupancy forecasting",
      faq: [{ question: "Which Excel version is required?", answer: "Works with Excel 2016 and above." }],
      relatedProducts: [], seoTitle: "Hospital KPI Dashboard Pro", seoDescription: "Professional hospital KPI dashboard",
      downloadLimit: 5, downloadExpiry: 365, status: "active", featured: true, salesCount: 12,
    });

    const prod2 = await ctx.db.insert("products", {
      name: "Financial Model & Valuation Toolkit", sku: "TW-FM-002", slug: "financial-model-valuation-toolkit",
      shortDescription: "Investment-grade financial modeling toolkit with DCF, LBO, M&A models, and automated sensitivity analysis.",
      description: "Professional financial modeling suite. Includes DCF analysis, LBO models, M&A frameworks, and automated sensitivity analysis.",
      price: 250000, category: "Financial Models", industry: "Finance",
      fileType: "Excel (.xlsx)", tags: ["financial", "valuation", "dcf", "lbo"], images: [], thumbnail: "",
      downloadableFiles: ["financial-model-toolkit.xlsx"], version: "3.1", changelog: "Added scenario analysis module",
      faq: [{ question: "Is this suitable for investment banking?", answer: "Yes, built to investment banking standards." }],
      relatedProducts: [], seoTitle: "Financial Model Toolkit", seoDescription: "Investment-grade financial modeling",
      downloadLimit: 3, downloadExpiry: 365, status: "active", featured: true, salesCount: 8,
    });

    const prod3 = await ctx.db.insert("products", {
      name: "NGO Grant Management System", sku: "TW-NGO-003", slug: "ngo-grant-management-system",
      shortDescription: "End-to-end grant management system with donor tracking, budget vs actual, and compliance reporting.",
      description: "Complete grant management solution for non-profit organizations. Track multiple grants, manage donor relationships, generate compliance reports.",
      price: 180000, salePrice: 129000, category: "Financial Models", industry: "NGO",
      fileType: "Excel (.xlsx)", tags: ["ngo", "grant", "donor", "non-profit"], images: [], thumbnail: "",
      downloadableFiles: ["ngo-grant-system.xlsx"], version: "1.5", changelog: "Added donor contribution analysis",
      faq: [], relatedProducts: [], seoTitle: "NGO Grant Management", seoDescription: "Grant management for NGOs",
      downloadLimit: 5, downloadExpiry: 365, status: "active", featured: true, salesCount: 6,
    });

    const prod4 = await ctx.db.insert("products", {
      name: "School Administration Dashboard", sku: "TW-SCH-004", slug: "school-administration-dashboard",
      shortDescription: "Complete school management dashboard with student tracking, fee collection, and staff management.",
      description: "Comprehensive school administration system. Manage student enrollment, track fee payments, monitor staff performance.",
      price: 120000, category: "Dashboards", industry: "Schools",
      fileType: "Excel (.xlsx)", tags: ["school", "education", "students", "fees"], images: [], thumbnail: "",
      downloadableFiles: ["school-admin-dashboard.xlsx"], version: "2.0", changelog: "Added termly reporting module",
      faq: [], relatedProducts: [], seoTitle: "School Dashboard", seoDescription: "School management dashboard",
      downloadLimit: 5, downloadExpiry: 365, status: "active", featured: false, salesCount: 4,
    });

    const prod5 = await ctx.db.insert("products", {
      name: "Church Stewardship & Finance System", sku: "TW-CH-005", slug: "church-stewardship-finance-system",
      shortDescription: "Church financial management system with tithe tracking, expense management, and annual budgeting.",
      description: "Designed for churches. Track tithes and offerings, manage expenses by ministry, generate financial reports.",
      price: 85000, category: "Budget Templates", industry: "Churches",
      fileType: "Excel (.xlsx)", tags: ["church", "stewardship", "finance"], images: [], thumbnail: "",
      downloadableFiles: ["church-finance-system.xlsx"], version: "1.2", changelog: "Added multi-currency support",
      faq: [], relatedProducts: [], seoTitle: "Church Finance System", seoDescription: "Church financial management",
      downloadLimit: 5, downloadExpiry: 365, status: "active", featured: false, salesCount: 3,
    });

    const prod6 = await ctx.db.insert("products", {
      name: "HR & Payroll Management System", sku: "TW-HR-006", slug: "hr-payroll-management-system",
      shortDescription: "Complete HR and payroll system with employee records, payroll processing, and leave management.",
      description: "Professional HR management system. Manage employee records, process payroll with URA tax calculations.",
      price: 200000, salePrice: 149000, category: "HR Systems", industry: "HR",
      fileType: "Excel (.xlsx)", tags: ["hr", "payroll", "employees", "tax"], images: [], thumbnail: "",
      downloadableFiles: ["hr-payroll-system.xlsx"], version: "2.1", changelog: "Updated URA tax tables for 2025",
      faq: [{ question: "Does it handle PAYE?", answer: "Yes, with current URA tax rates." }],
      relatedProducts: [], seoTitle: "HR & Payroll System", seoDescription: "HR and payroll management",
      downloadLimit: 3, downloadExpiry: 365, status: "active", featured: true, salesCount: 7,
    });

    const prod7 = await ctx.db.insert("products", {
      name: "SME Business Budget & Forecast Pro", sku: "TW-BF-007", slug: "sme-business-budget-forecast-pro",
      shortDescription: "Professional budgeting and forecasting toolkit for SMEs with 3-statement model integration.",
      description: "Purpose-built for SMEs. Create professional budgets, forecast revenue and expenses, manage cash flow.",
      price: 95000, category: "Budget Templates", industry: "Business",
      fileType: "Excel (.xlsx)", tags: ["sme", "budget", "forecast", "cash-flow"], images: [], thumbnail: "",
      downloadableFiles: ["sme-budget-forecast.xlsx"], version: "1.8", changelog: "Added cash flow forecasting",
      faq: [], relatedProducts: [], seoTitle: "SME Budget Pro", seoDescription: "Budgeting toolkit for SMEs",
      downloadLimit: 5, downloadExpiry: 365, status: "active", featured: false, salesCount: 5,
    });

    const prod8 = await ctx.db.insert("products", {
      name: "Agriculture Farm Management System", sku: "TW-AG-008", slug: "agriculture-farm-management-system",
      shortDescription: "Farm management system with crop tracking, livestock records, and harvest forecasting.",
      description: "Comprehensive farm management solution. Track crop cycles, manage livestock, forecast harvest yields.",
      price: 110000, category: "Inventory Systems", industry: "Agriculture",
      fileType: "Excel (.xlsx)", tags: ["agriculture", "farm", "crops", "livestock"], images: [], thumbnail: "",
      downloadableFiles: ["farm-management-system.xlsx"], version: "1.0", changelog: "Initial release",
      faq: [], relatedProducts: [], seoTitle: "Farm Management", seoDescription: "Farm management system",
      downloadLimit: 5, downloadExpiry: 365, status: "active", featured: false, salesCount: 2,
    });

    const prod9 = await ctx.db.insert("products", {
      name: "Ultimate Business Bundle", sku: "TW-BND-009", slug: "ultimate-business-bundle",
      shortDescription: "Complete business toolkit: financial model, budget, HR system, and dashboard at 40% discount.",
      description: "The ultimate business package. Includes 4 premium products at 40% discount.",
      price: 550000, salePrice: 329000, category: "Bundles", industry: "Business",
      fileType: "Excel (.xlsx)", tags: ["bundle", "business", "complete"], images: [], thumbnail: "",
      downloadableFiles: ["business-bundle.zip"], version: "2.0", changelog: "Updated all templates",
      faq: [{ question: "What's included?", answer: "4 premium templates valued at UGX 550,000+" }],
      relatedProducts: [prod2, prod6, prod7], seoTitle: "Business Bundle", seoDescription: "Complete business toolkit bundle",
      downloadLimit: 10, downloadExpiry: 365, status: "active", featured: true, salesCount: 3,
    });

    // Update related products
    await ctx.db.patch(prod1, { relatedProducts: [prod2, prod3] });
    await ctx.db.patch(prod2, { relatedProducts: [prod1, prod3] });
    await ctx.db.patch(prod3, { relatedProducts: [prod1, prod4] });
    await ctx.db.patch(prod6, { relatedProducts: [prod2, prod1] });

    // Customers
    const c1 = await ctx.db.insert("customers", {
      name: "Dr. Sarah Nambozo", email: "sarah@kmc.ug", phone: "+256 700 123456",
      company: "Kampala Medical Centre", industry: "Healthcare", newsletter: true,
      favoriteCategories: ["Dashboards"], lifetimeValue: 99000, totalOrders: 1, totalDownloads: 2,
      lastPurchaseAt: new Date().toISOString(),
    });
    const c2 = await ctx.db.insert("customers", {
      name: "James Ochieng", email: "james@eadf.org", company: "East African Development Fund",
      industry: "Finance", newsletter: true, favoriteCategories: ["Financial Models"],
      lifetimeValue: 250000, totalOrders: 1, totalDownloads: 1, lastPurchaseAt: new Date().toISOString(),
    });
    const c3 = await ctx.db.insert("customers", {
      name: "Grace Akello", email: "grace@hoperelief.org", company: "Hope Relief NGO",
      industry: "NGO", newsletter: true, favoriteCategories: ["Financial Models"],
      lifetimeValue: 129000, totalOrders: 1, totalDownloads: 0, lastPurchaseAt: new Date().toISOString(),
    });

    // Orders
    const o1 = await ctx.db.insert("orders", {
      orderNumber: "TW-2025-0001", customerId: c1,
      customer: { name: "Dr. Sarah Nambozo", email: "sarah@kmc.ug", phone: "+256 700 123456" },
      items: [{ productId: prod1, productName: "Hospital KPI Dashboard Pro", quantity: 1, price: 99000 }],
      subtotal: 99000, total: 99000, paymentMethod: "mtn_momo",
      paymentStatus: "completed", orderStatus: "completed",
      downloadLinks: [{
        productId: prod1, productName: "Hospital KPI Dashboard Pro", url: "#",
        downloadCount: 2, remainingDownloads: 3, expiryDate: new Date(Date.now() + 365 * 86400000).toISOString(),
        status: "active",
      }],
    });

    const o2 = await ctx.db.insert("orders", {
      orderNumber: "TW-2025-0002", customerId: c2,
      customer: { name: "James Ochieng", email: "james@eadf.org" },
      items: [{ productId: prod2, productName: "Financial Model & Valuation Toolkit", quantity: 1, price: 250000 }],
      subtotal: 250000, total: 250000, paymentMethod: "visa",
      paymentStatus: "completed", orderStatus: "completed",
      downloadLinks: [{
        productId: prod2, productName: "Financial Model & Valuation Toolkit", url: "#",
        downloadCount: 1, remainingDownloads: 2, expiryDate: new Date(Date.now() + 365 * 86400000).toISOString(),
        status: "active",
      }],
    });

    const o3 = await ctx.db.insert("orders", {
      orderNumber: "TW-2025-0003", customerId: c3,
      customer: { name: "Grace Akello", email: "grace@hoperelief.org" },
      items: [{ productId: prod3, productName: "NGO Grant Management System", quantity: 1, price: 129000 }],
      subtotal: 129000, total: 129000, paymentMethod: "airtel_money",
      paymentStatus: "completed", orderStatus: "completed",
      downloadLinks: [],
    });

    // Payments
    await ctx.db.insert("payments", {
      orderId: o1, orderNumber: "TW-2025-0001", amount: 99000,
      method: "mtn_momo", status: "completed", reference: "MOMO-" + Date.now(),
    });
    await ctx.db.insert("payments", {
      orderId: o2, orderNumber: "TW-2025-0002", amount: 250000,
      method: "visa", status: "completed", reference: "VISA-" + Date.now(),
    });
    await ctx.db.insert("payments", {
      orderId: o3, orderNumber: "TW-2025-0003", amount: 129000,
      method: "airtel_money", status: "completed", reference: "AIRTEL-" + Date.now(),
    });

    // Reviews
    await ctx.db.insert("reviews", {
      productId: prod1, customerId: c1, customerName: "Dr. Sarah Nambozo",
      rating: 5, title: "Game changer for our hospital",
      content: "This dashboard gave us visibility we never had before. Highly recommended.",
      featured: true, approved: true,
    });
    await ctx.db.insert("reviews", {
      productId: prod2, customerId: c2, customerName: "James Ochieng",
      rating: 5, title: "Investment-grade models",
      content: "Used for multiple portfolio valuations. Exceptional quality.",
      featured: true, approved: true,
    });
    await ctx.db.insert("reviews", {
      productId: prod3, customerId: c3, customerName: "Grace Akello",
      rating: 5, title: "Donor reporting made easy",
      content: "Our compliance reporting improved dramatically.",
      featured: false, approved: true,
    });

    // Blog posts
    await ctx.db.insert("blogPosts", {
      title: "5 KPIs Every Ugandan Hospital Should Track in 2025",
      slug: "5-kpis-every-ugandan-hospital-should-track",
      excerpt: "Discover the key performance indicators that drive better patient outcomes and financial sustainability.",
      content: "", category: "Healthcare", tags: ["kpi", "healthcare"], image: "",
      author: "TrueWorks Team", readingTime: 8, featured: true,
      publishedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    });
    await ctx.db.insert("blogPosts", {
      title: "Building a Budget That Drives Growth: A Guide for SMEs",
      slug: "building-budget-that-drives-growth",
      excerpt: "Learn how SMEs in East Africa can create budgets that align with strategic goals.",
      content: "", category: "Finance", tags: ["budget", "sme"], image: "",
      author: "TrueWorks Team", readingTime: 12, featured: true,
      publishedAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    });
    await ctx.db.insert("blogPosts", {
      title: "The Future of Financial Modeling in East Africa",
      slug: "future-of-financial-modeling-east-africa",
      excerpt: "How AI and automation are transforming financial modeling for businesses in the region.",
      content: "", category: "Finance", tags: ["financial-modeling", "ai"], image: "",
      author: "TrueWorks Team", readingTime: 10, featured: false,
      publishedAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    });
    await ctx.db.insert("blogPosts", {
      title: "Top 10 Excel Shortcuts Every Business Analyst Should Know",
      slug: "top-10-excel-shortcuts-business-analyst",
      excerpt: "Boost your productivity with these essential Excel keyboard shortcuts.",
      content: "", category: "Productivity", tags: ["excel", "productivity"], image: "",
      author: "TrueWorks Team", readingTime: 6, featured: false,
      publishedAt: new Date(Date.now() - 120 * 86400000).toISOString(),
    });

    // Admin user
    const adminId = await ctx.db.insert("users", {
      name: "Admin User", email: "admin@trueworks.ug",
      role: "admin", permissions: ["all"], twoFactorEnabled: false,
      lastLogin: new Date().toISOString(),
    });

    // Resources
    await ctx.db.insert("resources", {
      title: "Getting Started Guide: TrueWorks Templates",
      type: "guide", description: "Learn how to install, configure, and get the most out of your TrueWorks templates.",
      image: "", url: "/resources/getting-started-guide", featured: true, category: "General",
    });
    await ctx.db.insert("resources", {
      title: "Template Tutorial: Building Your First Dashboard",
      type: "template", description: "Step-by-step tutorial on creating a professional KPI dashboard from scratch.",
      image: "", url: "/resources/building-first-dashboard", featured: true, category: "Dashboards",
    });
    await ctx.db.insert("resources", {
      title: "Case Study: Kampala Medical Centre Digital Transformation",
      type: "case_study", description: "How Kampala Medical Centre improved patient outcomes using our Hospital KPI Dashboard.",
      image: "", url: "/resources/kmc-case-study", featured: true, category: "Healthcare",
    });
    await ctx.db.insert("resources", {
      title: "Financial Modeling Best Practices",
      type: "article", description: "Expert tips and industry standards for building reliable financial models.",
      image: "", url: "/resources/financial-modeling-best-practices", featured: false, category: "Finance",
    });

    // Support tickets
    await ctx.db.insert("supportTickets", {
      customerName: "Dr. Sarah Nambozo", customerEmail: "sarah@kmc.ug",
      subject: "Download link not working",
      message: "I purchased the Hospital KPI Dashboard but the download link appears to be expired.",
      priority: "high", status: "open", category: "Technical",
      assignedTo: adminId, orderId: o1, attachments: [],
    });
    await ctx.db.insert("supportTickets", {
      customerName: "James Ochieng", customerEmail: "james@eadf.org",
      subject: "Feature request: Multi-currency support",
      message: "Would love to see multi-currency support in the Financial Model Toolkit.",
      priority: "medium", status: "pending", category: "Feature Request",
      attachments: [],
    });
    await ctx.db.insert("supportTickets", {
      customerName: "Grace Akello", customerEmail: "grace@hoperelief.org",
      subject: "Question about grant reporting templates",
      message: "Do you have templates that support USAID reporting requirements?",
      priority: "low", status: "resolved", category: "General Inquiry",
      orderId: o3, attachments: [],
      resolution: "Yes, our NGO Grant Management System supports USAID, EU, and UN reporting formats.",
    });
    await ctx.db.insert("supportTickets", {
      customerName: "Peter Mukasa", customerEmail: "peter@buildco.ug",
      subject: "Urgent: Payment issue with order",
      message: "I was charged twice for my order. Please refund the duplicate payment.",
      priority: "urgent", status: "open", category: "Billing",
      attachments: ["screenshot_1.png", "receipt.pdf"],
    });

    // Downloads
    await ctx.db.insert("downloads", {
      productId: prod1, customerId: c1, orderId: o1,
      downloadCount: 2, remainingDownloads: 3,
      expiryDate: new Date(Date.now() + 365 * 86400000).toISOString(),
      device: "Windows PC", ipAddress: "192.168.1.100",
      status: "active",
    });
    await ctx.db.insert("downloads", {
      productId: prod2, customerId: c2, orderId: o2,
      downloadCount: 1, remainingDownloads: 2,
      expiryDate: new Date(Date.now() + 365 * 86400000).toISOString(),
      device: "MacBook Pro", ipAddress: "192.168.1.101",
      status: "active",
    });
    await ctx.db.insert("downloads", {
      productId: prod3, customerId: c3, orderId: o3,
      downloadCount: 0, remainingDownloads: 5,
      expiryDate: new Date(Date.now() + 365 * 86400000).toISOString(),
      status: "active",
    });
    await ctx.db.insert("downloads", {
      productId: prod1, customerId: c1, orderId: o1,
      downloadCount: 5, remainingDownloads: 0,
      expiryDate: new Date(Date.now() - 30 * 86400000).toISOString(),
      device: "Android Tablet", ipAddress: "192.168.1.102",
      status: "expired",
    });

    // Navigation
    await ctx.db.insert("navigation", { label: "Home", url: "/", order: 1 });
    await ctx.db.insert("navigation", { label: "Store", url: "/store", order: 2 });
    const navAbout = await ctx.db.insert("navigation", { label: "About", url: "/about", order: 3 });
    await ctx.db.insert("navigation", { label: "Resources", url: "/resources", order: 4 });
    await ctx.db.insert("navigation", { label: "Contact", url: "/contact", order: 5 });

    // Navigation children
    await ctx.db.insert("navigation", { label: "Our Story", url: "/about/our-story", parentId: navAbout, order: 1 });
    await ctx.db.insert("navigation", { label: "Team", url: "/about/team", parentId: navAbout, order: 2 });
    await ctx.db.insert("navigation", { label: "Careers", url: "/about/careers", parentId: navAbout, order: 3 });

    // Notifications
    await ctx.db.insert("notifications", {
      title: "New Order Received", message: "Order TW-2025-0003 from Grace Akello",
      type: "order", read: false,
    });
    await ctx.db.insert("notifications", {
      title: "Payment Completed", message: "Payment of UGX 99,000 received for Order TW-2025-0001",
      type: "payment", read: false,
    });
    await ctx.db.insert("notifications", {
      title: "New Support Ticket", message: "Urgent billing issue from Peter Mukasa",
      type: "support", read: false,
    });

    return { seeded: true, message: "Database seeded successfully" };
  },
});
