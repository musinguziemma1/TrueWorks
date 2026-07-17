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
      description: "A complete hospital performance management system designed for Ugandan and East African healthcare facilities. Track patient admissions, bed occupancy, revenue per bed, staff productivity, and clinical outcomes. Includes both executive summary and departmental drill-down views.",
      price: 150000, salePrice: 99000, category: "Dashboards", industry: "Healthcare",
      fileType: "Excel (.xlsx)", tags: ["hospital", "kpi", "dashboard", "healthcare"],
      images: ["/images/placeholder-dashboard.png", "/images/placeholder-report.png", "/images/placeholder-chart.png", "/images/placeholder-data.png"],
      thumbnail: "/images/placeholder-dashboard.png",
      downloadableFiles: ["Hospital_KPI_Dashboard_Pro.xlsx", "User_Guide.pdf", "Installation_Notes.txt"],
      version: "2.3", changelog: "Added bed occupancy forecasting module and monthly trend charts",
      whatsInside: ["Executive summary dashboard with 12 key metrics", "Bed occupancy tracker with forecasting", "Departmental performance scorecards", "Monthly revenue and expense analysis", "Staff productivity and patient ratio charts", "Automated alert system for threshold breaches", "Customizable date range selector", "PDF export-ready report templates"],
      fileCompatibility: "Microsoft Excel 2016 or later (Windows & Mac). Some features require macros to be enabled.",
      demoUrl: "https://fast-clam-474.convex.cloud/demo/hospital-dashboard",
      faq: [
        { question: "Which Excel version is required?", answer: "Works with Excel 2016 and above (including Excel 365). Mac users may lose some macro functionality." },
        { question: "Can I add my hospital's logo?", answer: "Yes, the dashboard includes a branded header area where you can insert your logo." },
      ],
      relatedProducts: [], seoTitle: "Hospital KPI Dashboard Pro", seoDescription: "Professional hospital KPI dashboard",
      downloadLimit: 5, downloadExpiry: 365, status: "active", featured: true, salesCount: 12,
    });

    const prod2 = await ctx.db.insert("products", {
      name: "Financial Model & Valuation Toolkit", sku: "TW-FM-002", slug: "financial-model-valuation-toolkit",
      shortDescription: "Investment-grade financial modeling toolkit with DCF, LBO, M&A models, and automated sensitivity analysis.",
      description: "Professional financial modeling suite. Includes DCF analysis, LBO models, M&A frameworks, and automated sensitivity analysis with tornado charts and scenario manager.",
      price: 250000, category: "Financial Models", industry: "Finance",
      fileType: "Excel (.xlsx)", tags: ["financial", "valuation", "dcf", "lbo"],
      images: ["/images/placeholder-financial.png", "/images/placeholder-chart.png", "/images/placeholder-report.png"],
      thumbnail: "/images/placeholder-financial.png",
      downloadableFiles: ["Financial_Model_Toolkit.xlsx", "User_Manual.pdf", "Sample_Outputs.xlsx"],
      version: "3.1", changelog: "Added scenario analysis module with Monte Carlo simulation",
      whatsInside: ["DCF valuation model with terminal value calculation", "LBO model with debt schedule", "M&A accretion/dilution analysis", "Automated sensitivity analysis with tornado charts", "Three-statement model (IS, BS, CF)", "Scenario manager with up to 12 scenarios", "Executive summary dashboard", "Industry benchmarking data (East Africa)"],
      fileCompatibility: "Microsoft Excel 2016 or later (Windows only). Requires macros and Analysis ToolPak.",
      demoUrl: "https://fast-clam-474.convex.cloud/demo/financial-model",
      faq: [
        { question: "Is this suitable for investment banking?", answer: "Yes, built to investment banking standards with full DCF, LBO, and M&A capabilities." },
        { question: "Does it work on Mac?", answer: "Excel for Mac supports most features, but some advanced macros may not function." },
      ],
      relatedProducts: [], seoTitle: "Financial Model Toolkit", seoDescription: "Investment-grade financial modeling",
      downloadLimit: 3, downloadExpiry: 365, status: "active", featured: true, salesCount: 8,
    });

    const prod3 = await ctx.db.insert("products", {
      name: "NGO Grant Management System", sku: "TW-NGO-003", slug: "ngo-grant-management-system",
      shortDescription: "End-to-end grant management system with donor tracking, budget vs actual, and compliance reporting.",
      description: "Complete grant management solution for non-profit organizations. Track multiple grants, manage donor relationships, generate USAID/EU/UN compliance reports, and monitor budget utilization across projects.",
      price: 180000, salePrice: 129000, category: "Financial Models", industry: "NGO",
      fileType: "Excel (.xlsx)", tags: ["ngo", "grant", "donor", "non-profit"],
      images: ["/images/placeholder-report.png", "/images/placeholder-dashboard.png"],
      thumbnail: "/images/placeholder-report.png",
      downloadableFiles: ["NGO_Grant_System.xlsx", "Compliance_Templates.zip", "User_Guide.pdf"],
      version: "1.5", changelog: "Added donor contribution analysis and multi-currency support",
      whatsInside: ["Multi-grant tracking dashboard", "Donor contribution and pledge management", "Budget vs actual expenditure reports", "USAID/EU/UN compliance report templates", "Project budget utilization tracker", "Automated currency conversion (UGX, USD, EUR, GBP)", "Grant expiry and reporting deadline alerts", "Audit trail and approval workflow"],
      fileCompatibility: "Microsoft Excel 2016 or later (Windows & Mac). No macros required for basic functions.",
      faq: [
        { question: "Does this support USAID reporting?", answer: "Yes, includes USAID, EU, and UN compliance report templates." },
        { question: "Can I track multiple donors?", answer: "Yes, the system supports unlimited donors and grants." },
      ],
      relatedProducts: [], seoTitle: "NGO Grant Management", seoDescription: "Grant management for NGOs",
      downloadLimit: 5, downloadExpiry: 365, status: "active", featured: true, salesCount: 6,
    });

    const prod4 = await ctx.db.insert("products", {
      name: "School Administration Dashboard", sku: "TW-SCH-004", slug: "school-administration-dashboard",
      shortDescription: "Complete school management dashboard with student tracking, fee collection, and staff management.",
      description: "Comprehensive school administration system. Manage student enrollment, track fee payments, monitor staff performance, and generate termly academic reports.",
      price: 120000, category: "Dashboards", industry: "Schools",
      fileType: "Excel (.xlsx)", tags: ["school", "education", "students", "fees"],
      images: ["/images/placeholder-dashboard.png", "/images/placeholder-data.png"],
      thumbnail: "/images/placeholder-dashboard.png",
      downloadableFiles: ["School_Admin_Dashboard.xlsx", "Setup_Guide.pdf"],
      version: "2.0", changelog: "Added termly reporting module and parent communication tracker",
      whatsInside: ["Student enrollment and demographic tracker", "Fee collection and arrears management", "Staff attendance and performance dashboard", "Termly academic reports with grade analytics", "Classroom allocation and timetable view", "Parent/guardian contact directory", "Expense tracking by department", "Annual school calendar planner"],
      fileCompatibility: "Microsoft Excel 2016 or later (Windows & Mac). No macros required.",
      faq: [
        { question: "Can I track fee payments from multiple terms?", answer: "Yes, the system tracks fees term by term with automatic arrears calculation." },
      ],
      relatedProducts: [], seoTitle: "School Dashboard", seoDescription: "School management dashboard",
      downloadLimit: 5, downloadExpiry: 365, status: "active", featured: false, salesCount: 4,
    });

    const prod5 = await ctx.db.insert("products", {
      name: "Church Stewardship & Finance System", sku: "TW-CH-005", slug: "church-stewardship-finance-system",
      shortDescription: "Church financial management system with tithe tracking, expense management, and annual budgeting.",
      description: "Designed for churches. Track tithes and offerings, manage expenses by ministry, generate monthly financial reports and annual budget comparisons.",
      price: 85000, category: "Budget Templates", industry: "Churches",
      fileType: "Excel (.xlsx)", tags: ["church", "stewardship", "finance"],
      images: ["/images/placeholder-report.png", "/images/placeholder-chart.png"],
      thumbnail: "/images/placeholder-report.png",
      downloadableFiles: ["Church_Finance_System.xlsx", "Quick_Start_Guide.pdf"],
      version: "1.2", changelog: "Added multi-currency support for foreign donations",
      whatsInside: ["Tithe and offering weekly tracker", "Expense management by ministry department", "Monthly and annual budget vs actual reports", "Donor/pledge tracking module", "Multi-currency donation recording (UGX, USD, EUR)", "Automated bank reconciliation", "Annual stewardship report generator", "User roles with access controls"],
      fileCompatibility: "Microsoft Excel 2016 or later (Windows & Mac).",
      faq: [
        { question: "Can multiple church branches use this?", answer: "Yes, the system supports branch-level tracking with consolidated reporting." },
      ],
      relatedProducts: [], seoTitle: "Church Finance System", seoDescription: "Church financial management",
      downloadLimit: 5, downloadExpiry: 365, status: "active", featured: false, salesCount: 3,
    });

    const prod6 = await ctx.db.insert("products", {
      name: "HR & Payroll Management System", sku: "TW-HR-006", slug: "hr-payroll-management-system",
      shortDescription: "Complete HR and payroll system with employee records, payroll processing, and leave management.",
      description: "Professional HR management system. Manage employee records, process payroll with URA PAYE/NSSF calculations, track leave balances, and generate HR reports.",
      price: 200000, salePrice: 149000, category: "HR Systems", industry: "HR",
      fileType: "Excel (.xlsx)", tags: ["hr", "payroll", "employees", "tax"],
      images: ["/images/placeholder-dashboard.png", "/images/placeholder-data.png", "/images/placeholder-report.png"],
      thumbnail: "/images/placeholder-dashboard.png",
      downloadableFiles: ["HR_Payroll_System.xlsx", "Payroll_Calculator.xlsx", "User_Handbook.pdf"],
      version: "2.1", changelog: "Updated URA tax tables for 2025/2026 financial year",
      whatsInside: ["Employee records database with document storage", "Monthly payroll processing with PAYE/NSSF auto-calculation", "Leave management with balance tracking", "Performance review tracker", "HR letter templates (appointment, confirmation, termination)", "Department-wise cost analysis", "Payslip generator with email merge", "URA annual returns report"],
      fileCompatibility: "Microsoft Excel 2016 or later (Windows only). Requires macros for payroll calculations.",
      faq: [
        { question: "Does it handle PAYE?", answer: "Yes, with current URA tax rates including all reliefs and bands." },
        { question: "Is NSSF included?", answer: "Yes, both employer and employee NSSF contributions are automatically calculated." },
      ],
      relatedProducts: [], seoTitle: "HR & Payroll System", seoDescription: "HR and payroll management",
      downloadLimit: 3, downloadExpiry: 365, status: "active", featured: true, salesCount: 7,
    });

    const prod7 = await ctx.db.insert("products", {
      name: "SME Business Budget & Forecast Pro", sku: "TW-BF-007", slug: "sme-business-budget-forecast-pro",
      shortDescription: "Professional budgeting and forecasting toolkit for SMEs with 3-statement model integration.",
      description: "Purpose-built for SMEs. Create professional budgets, forecast revenue and expenses, manage cash flow with rolling forecasts and what-if analysis.",
      price: 95000, category: "Budget Templates", industry: "Business",
      fileType: "Excel (.xlsx)", tags: ["sme", "budget", "forecast", "cash-flow"],
      images: ["/images/placeholder-financial.png", "/images/placeholder-chart.png"],
      thumbnail: "/images/placeholder-financial.png",
      downloadableFiles: ["SME_Budget_Forecast.xlsx", "Cash_Flow_Model.xlsx", "Dashboard.xlsx"],
      version: "1.8", changelog: "Added cash flow forecasting and what-if scenario planner",
      whatsInside: ["Annual budget planner with monthly breakdowns", "Revenue forecasting model with trend analysis", "Expense budget with category tracking", "Cash flow statement with 12-month rolling forecast", "What-if scenario analyzer", "Budget vs actual comparison dashboard", "Break-even analysis calculator", "Executive summary with key financial ratios"],
      fileCompatibility: "Microsoft Excel 2016 or later (Windows & Mac).",
      faq: [
        { question: "Can I use this for a startup?", answer: "Absolutely. The toolkit works for both established SMEs and startups preparing their first budget." },
      ],
      relatedProducts: [], seoTitle: "SME Budget Pro", seoDescription: "Budgeting toolkit for SMEs",
      downloadLimit: 5, downloadExpiry: 365, status: "active", featured: false, salesCount: 5,
    });

    const prod8 = await ctx.db.insert("products", {
      name: "Agriculture Farm Management System", sku: "TW-AG-008", slug: "agriculture-farm-management-system",
      shortDescription: "Farm management system with crop tracking, livestock records, and harvest forecasting.",
      description: "Comprehensive farm management solution. Track crop cycles, manage livestock, forecast harvest yields, and monitor farm finances with a complete agriculture-specific accounting system.",
      price: 110000, category: "Inventory Systems", industry: "Agriculture",
      fileType: "Excel (.xlsx)", tags: ["agriculture", "farm", "crops", "livestock"],
      images: ["/images/placeholder-dashboard.png", "/images/placeholder-data.png"],
      thumbnail: "/images/placeholder-dashboard.png",
      downloadableFiles: ["Farm_Management_System.xlsx", "Crop_Planner.xlsx", "User_Guide.pdf"],
      version: "1.0", changelog: "Initial release",
      whatsInside: ["Crop cycle planner with planting and harvest dates", "Livestock inventory and health records", "Harvest yield forecasting and actual tracking", "Farm expense and revenue accounting", "Input cost tracking (seeds, fertilizer, labor)", "Weather and irrigation log", "Equipment maintenance scheduler", "Profitability analysis per crop/livestock type"],
      fileCompatibility: "Microsoft Excel 2016 or later (Windows & Mac).",
      faq: [
        { question: "Can I track multiple farms?", answer: "Yes, you can manage unlimited farms with separate sheets." },
      ],
      relatedProducts: [], seoTitle: "Farm Management", seoDescription: "Farm management system",
      downloadLimit: 5, downloadExpiry: 365, status: "active", featured: false, salesCount: 2,
    });

    const prod9 = await ctx.db.insert("products", {
      name: "Ultimate Business Bundle", sku: "TW-BND-009", slug: "ultimate-business-bundle",
      shortDescription: "Complete business toolkit: financial model, budget, HR system, and dashboard at 40% discount.",
      description: "The ultimate business package. Includes Financial Model & Valuation Toolkit, HR & Payroll System, SME Budget Pro, and Executive Dashboard — all at 40% off the individual prices.",
      price: 550000, salePrice: 329000, category: "Bundles", industry: "Business",
      fileType: "Multiple Formats", tags: ["bundle", "business", "complete"],
      images: ["/images/placeholder-financial.png", "/images/placeholder-dashboard.png", "/images/placeholder-report.png"],
      thumbnail: "/images/placeholder-financial.png",
      downloadableFiles: ["Ultimate_Business_Bundle.zip"],
      version: "2.0", changelog: "Updated all four templates to latest versions",
      whatsInside: ["Financial Model & Valuation Toolkit (valued at UGX 250,000)", "HR & Payroll Management System (valued at UGX 200,000)", "SME Business Budget & Forecast Pro (valued at UGX 95,000)", "Executive Dashboard with key business metrics", "Cross-template integration guide", "Priority email support for 30 days"],
      fileCompatibility: "Microsoft Excel 2016 or later. Individual file requirements apply (see product pages).",
      faq: [
        { question: "What's included?", answer: "4 premium products valued at UGX 545,000+ for only UGX 329,000 — a 40% saving." },
        { question: "Can I upgrade to a different bundle?", answer: "Contact us at hello@trueworks.ug for custom bundle options." },
      ],
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
      excerpt: "Discover the key performance indicators that drive better patient outcomes, operational efficiency, and financial sustainability for healthcare facilities in Uganda.",
      content: "<p>In today's rapidly evolving healthcare landscape, data-driven decision-making is no longer optional — it's essential. Ugandan hospitals face unique challenges, from resource constraints to growing patient demand. By tracking the right Key Performance Indicators (KPIs), hospital administrators can make informed decisions that improve patient care and operational efficiency.</p><h2>1. Bed Occupancy Rate</h2><p>This metric measures the percentage of available beds occupied over a specific period. A rate of 70-85% is generally considered optimal. Below 70% suggests underutilization; above 85% indicates potential capacity issues. Tracking this KPI helps with resource allocation, staffing decisions, and infrastructure planning.</p><h2>2. Patient Wait Time</h2><p>Average time from patient arrival to consultation. Long wait times are a leading cause of patient dissatisfaction. Monitor by department (Outpatient, Emergency, Specialist Clinics) and identify bottlenecks in your patient flow.</p><h2>3. Revenue per Bed</h2><p>A critical financial metric that combines occupancy with average revenue per patient day. This KPI helps you understand your hospital's revenue-generating efficiency and benchmark against industry standards.</p><h2>4. Hospital-Acquired Infection Rate</h2><p>Track infections acquired during a patient's stay. This is both a quality-of-care indicator and a cost-control metric. Lower rates mean better patient outcomes and reduced treatment costs.</p><h2>5. Staff-to-Patient Ratio</h2><p>Proper staffing levels directly impact patient outcomes and staff well-being. Track ratios by department and shift to ensure adequate coverage without overspending on labor costs.</p><p>Our Hospital KPI Dashboard Pro is designed to track all these metrics and 40+ more, with automated alerts and visual dashboards. <a href='/product/hospital-kpi-dashboard-pro'>Learn more about the dashboard here.</a></p>",
      category: "Healthcare", tags: ["kpi", "healthcare", "hospital-management"], image: "/images/placeholder-dashboard.png",
      author: "TrueWorks Team", readingTime: 8, featured: true,
      publishedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    });
    await ctx.db.insert("blogPosts", {
      title: "Building a Budget That Drives Growth: A Guide for East African SMEs",
      slug: "building-budget-that-drives-growth",
      excerpt: "Learn how SMEs in Uganda and across East Africa can create strategic budgets that align with business goals and drive sustainable growth.",
      content: "<p>Budgeting is often viewed as a tedious annual exercise, but for Small and Medium Enterprises (SMEs) in East Africa, it is one of the most powerful tools for driving growth. A well-structured budget does more than track expenses — it provides a roadmap for strategic decision-making.</p><h2>Why Most SME Budgets Fail</h2><p>The most common mistake we see among Ugandan SMEs is treating the budget as a static document. Markets change, costs fluctuate, and opportunities arise. A budget should be a living tool that adapts to your business environment.</p><h2>The Zero-Based Budgeting Approach</h2><p>Instead of basing your new budget on last year's numbers (incremental budgeting), consider zero-based budgeting. Every expense must be justified from scratch each period. This approach forces you to evaluate the ROI of every cost center.</p><h2>Key Components of a Growth-Oriented Budget</h2><ul><li><strong>Revenue Forecast:</strong> Base this on realistic market analysis, not optimism. Include multiple scenarios (best case, expected, worst case).</li><li><strong>Fixed vs Variable Costs:</strong> Clearly separate these to understand your cost structure and break-even point.</li><li><strong>Growth Investment:</strong> Allocate at least 10-15% of your budget to growth activities — marketing, product development, and capacity building.</li><li><strong>Cash Flow Projection:</strong> Profitability does not equal liquidity. A 12-month cash flow forecast is essential for survival.</li></ul><h2>Using Technology</h2><p>Excel-based budgeting tools, like our SME Business Budget & Forecast Pro, make it easy to create professional budgets without expensive accounting software. The key is to build a system you will actually use and update regularly.</p><p>Ready to transform your SME's financial planning? <a href='/product/sme-business-budget-forecast-pro'>Explore our budgeting toolkit.</a></p>",
      category: "Business", tags: ["budget", "sme", "financial-planning"], image: "/images/placeholder-financial.png",
      author: "TrueWorks Team", readingTime: 12, featured: true,
      publishedAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    });
    await ctx.db.insert("blogPosts", {
      title: "Top 10 Excel Shortcuts Every Business Analyst Should Know",
      slug: "top-10-excel-shortcuts-every-business-analyst",
      excerpt: "Boost your productivity and efficiency with these essential Excel keyboard shortcuts that every business analyst and finance professional should master.",
      content: "<p>In the world of business analysis, speed and accuracy are everything. Mastering Excel keyboard shortcuts can save you hours each week and make you significantly more productive. Here are the top 10 shortcuts every analyst should know.</p><h2>1. Ctrl + Shift + L — Toggle Filters</h2><p>Instantly add or remove filter arrows on your data headers. One of the most used shortcuts in data analysis.</p><h2>2. Ctrl + T — Create Table</h2><p>Convert your data range into an Excel Table. This enables structured references, automatic formatting, and easier sorting/filtering.</p><h2>3. Alt + F1 — Create Chart</h2><p>Select your data and press Alt + F1 to instantly create a default chart on a new sheet. Customize from there.</p><h2>4. F4 — Repeat Last Action</h2><p>This is a powerhouse. Applied a format? Press F4 to repeat it on another cell. Inserted a row? F4 does it again.</p><h2>5. Ctrl + Shift + Arrow — Select to Edge</h2><p>Quickly select from your current cell to the last cell with data in any direction. Combine with Ctrl + Space or Shift + Space for entire column/row selection.</p><h2>6. Alt + E, S, V — Paste Special</h2><p>The classic. Opens the Paste Special dialog for pasting values, formats, formulas, or transposing data.</p><h2>7. Ctrl + [ — Trace Precedents</h2><p>Jump directly to cells that feed into your current formula. Essential for auditing complex models.</p><h2>8. F2 — Edit Active Cell</h2><p>Enter edit mode on the selected cell. Much faster than double-clicking.</p><h2>9. Ctrl + Shift + $ — Apply Currency Format</h2><p>Quickly format selected cells as currency. Use Ctrl + Shift + % for percentage and Ctrl + Shift + # for date.</p><h2>10. Ctrl + PgUp / PgDn — Switch Sheets</h2><p>Navigate between worksheet tabs without touching your mouse. Saves seconds that add up over the day.</p><p>These shortcuts are just the beginning. Our downloadable Excel templates include pre-built shortcuts and productivity aids to help you work faster.</p>",
      category: "Productivity", tags: ["excel", "shortcuts", "productivity", "analyst"], image: "/images/placeholder-chart.png",
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
