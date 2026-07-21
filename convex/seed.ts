import { action, internalMutation, mutation, query } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { requireStaffUser } from "./auth.helpers";
import { createAccount } from "@convex-dev/auth/server";
import { Scrypt } from "lucia";
import { v } from "convex/values";

async function clearAll(ctx: any) {
  const tables = [
    "products", "orders", "customers", "categories", "industries",
    "reviews", "coupons", "blogPosts", "resources", "users",
    "payments", "notifications", "pageSections", "navigation",
    "downloads", "activityLogs", "supportTickets", "settings",
  ];
  for (const table of tables) {
    const docs = await ctx.db.query(table).collect();
    for (const doc of docs) {
      await ctx.db.delete(doc._id);
    }
  }
}

export const seed = mutation({
  handler: async (ctx) => {
    await requireStaffUser(ctx, "admin");
    const existing = await ctx.db.query("products").collect();
    if (existing.length > 0) {
      return { seeded: false, message: "Database already seeded. Run 'forceSeed' to re-seed." };
    }
    return await doSeed(ctx);
  },
});

export const forceSeed = mutation({
  handler: async (ctx) => {
    await requireStaffUser(ctx, "admin");
    await clearAll(ctx);
    return await doSeed(ctx);
  },
});

async function doSeed(ctx: any, skipAdminCreation = false) {
  const img = (name: string) => `/images/products/${name}.png`;
  const file = (name: string) => `/dummy-templates/${name}`;

  // ── Categories ──
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

  // ── Industries ──
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

  // ── Products ──
  const p1 = await ctx.db.insert("products", {
    name: "Hospital KPI Dashboard Pro", sku: "TW-HKD-001", slug: "hospital-kpi-dashboard-pro",
    shortDescription: "Comprehensive hospital performance dashboard with 45+ KPI metrics, real-time bed occupancy tracking, and financial reporting.",
    description: "A complete hospital performance management system designed for Ugandan and East African healthcare facilities. Track patient admissions, bed occupancy, revenue per bed, staff productivity, and clinical outcomes. Includes both executive summary and departmental drill-down views.",
    price: 150000, salePrice: 99000, category: "Dashboards", industry: "Healthcare",
    fileType: "Excel (.xlsx)", tags: ["hospital", "kpi", "dashboard", "healthcare", "excel"],
    images: [img("Hospital_KPI_Dashboard_Pro_01"), img("Hospital_KPI_Dashboard_Pro_02"), img("Hospital_KPI_Dashboard_Pro_03"), img("Hospital_KPI_Dashboard_Pro_04")],
    thumbnail: img("Hospital_KPI_Dashboard_Pro_01"),
    downloadableFiles: [file("Hospital_KPI_Dashboard_Pro.xlsx"), file("User_Guide.pdf"), file("Installation_Notes.txt")],
    version: "2.3", changelog: "Added bed occupancy forecasting module and monthly trend charts",
    whatsInside: [
      "Executive summary dashboard with 12 key metrics",
      "Bed occupancy tracker with forecasting",
      "Departmental performance scorecards",
      "Monthly revenue and expense analysis",
      "Staff productivity and patient ratio charts",
      "Automated alert system for threshold breaches",
      "Customizable date range selector",
      "PDF export-ready report templates",
      "Multi-facility consolidation view",
      "Patient satisfaction trend tracker",
    ],
    fileCompatibility: "Microsoft Excel 2016 or later (Windows & Mac). Some features require macros to be enabled.",
    demoUrl: "https://fast-clam-474.convex.cloud/demo/hospital-dashboard",
    faq: [
      { question: "Which Excel version is required?", answer: "Works with Excel 2016 and above (including Excel 365). Mac users may lose some macro functionality." },
      { question: "Can I add my hospital's logo?", answer: "Yes, the dashboard includes a branded header area where you can insert your logo and customize colors." },
      { question: "How long does setup take?", answer: "Most users are up and running within 30 minutes. The template includes pre-loaded sample data for testing." },
    ],
    relatedProducts: [], seoTitle: "Hospital KPI Dashboard Pro - TrueWorks", seoDescription: "Professional hospital KPI dashboard with 45+ metrics for East African healthcare facilities",
    downloadLimit: 5, downloadExpiry: 365, status: "active", featured: true, salesCount: 12,
  });

  const p2 = await ctx.db.insert("products", {
    name: "Financial Model & Valuation Toolkit", sku: "TW-FM-002", slug: "financial-model-valuation-toolkit",
    shortDescription: "Investment-grade financial modeling toolkit with DCF, LBO, M&A models, and automated sensitivity analysis.",
    description: "Professional financial modeling suite used by investment analysts and finance professionals across East Africa. Includes DCF analysis, LBO models, M&A frameworks, and automated sensitivity analysis with tornado charts and scenario manager. Built to investment banking standards.",
    price: 250000, category: "Financial Models", industry: "Finance",
    fileType: "Excel (.xlsx)", tags: ["financial", "valuation", "dcf", "lbo", "investment"],
    images: [img("placeholder-financial"), img("placeholder-chart"), img("placeholder-report")],
    thumbnail: img("placeholder-financial"),
    downloadableFiles: [file("Financial_Model_Toolkit.xlsx"), file("User_Guide.pdf"), file("Sample_Outputs.xlsx")],
    version: "3.1", changelog: "Added scenario analysis module with Monte Carlo simulation",
    whatsInside: [
      "DCF valuation model with terminal value calculation",
      "LBO model with debt schedule and returns analysis",
      "M&A accretion/dilution analysis",
      "Automated sensitivity analysis with tornado charts",
      "Three-statement model (IS, BS, CF)",
      "Scenario manager with up to 12 scenarios",
      "Executive summary dashboard",
      "Industry benchmarking data (East Africa)",
      "Monte Carlo simulation module",
      "Professional report-ready outputs",
    ],
    fileCompatibility: "Microsoft Excel 2016 or later (Windows only). Requires macros and Analysis ToolPak.",
    demoUrl: "https://fast-clam-474.convex.cloud/demo/financial-model",
    faq: [
      { question: "Is this suitable for investment banking?", answer: "Yes, built to investment banking standards with full DCF, LBO, and M&A capabilities." },
      { question: "Does it work on Mac?", answer: "Excel for Mac supports most features, but some advanced macros may not function." },
      { question: "Are the industry benchmarks updated?", answer: "Yes, we update East African industry benchmarks annually." },
    ],
    relatedProducts: [], seoTitle: "Financial Model Toolkit - TrueWorks", seoDescription: "Investment-grade financial modeling toolkit for East African professionals",
    downloadLimit: 3, downloadExpiry: 365, status: "active", featured: true, salesCount: 8,
  });

  const p3 = await ctx.db.insert("products", {
    name: "NGO Grant Management System", sku: "TW-NGO-003", slug: "ngo-grant-management-system",
    shortDescription: "End-to-end grant management system with donor tracking, budget vs actual, and compliance reporting.",
    description: "Complete grant management solution for non-profit organizations. Track multiple grants, manage donor relationships, generate USAID/EU/UN compliance reports, and monitor budget utilization across projects. Used by NGOs across Uganda, Kenya, and Tanzania.",
    price: 180000, salePrice: 129000, category: "Financial Models", industry: "NGO",
    fileType: "Excel (.xlsx)", tags: ["ngo", "grant", "donor", "non-profit", "compliance"],
    images: [img("NGO_Grant_System_01"), img("NGO_Grant_System_02")],
    thumbnail: img("NGO_Grant_System_01"),
    downloadableFiles: [file("NGO_Grant_System.xlsx"), file("Compliance_Templates.zip"), file("User_Guide.pdf")],
    version: "1.5", changelog: "Added donor contribution analysis and multi-currency support",
    whatsInside: [
      "Multi-grant tracking dashboard",
      "Donor contribution and pledge management",
      "Budget vs actual expenditure reports",
      "USAID/EU/UN compliance report templates",
      "Project budget utilization tracker",
      "Automated currency conversion (UGX, USD, EUR, GBP)",
      "Grant expiry and reporting deadline alerts",
      "Audit trail and approval workflow",
      "Beneficiary tracking module",
      "Narrative report generator",
    ],
    fileCompatibility: "Microsoft Excel 2016 or later (Windows & Mac). No macros required for basic functions.",
    faq: [
      { question: "Does this support USAID reporting?", answer: "Yes, includes USAID, EU, and UN compliance report templates." },
      { question: "Can I track multiple donors?", answer: "Yes, the system supports unlimited donors and grants with consolidated reporting." },
      { question: "Is multi-currency supported?", answer: "Yes, the system handles UGX, USD, EUR, and GBP with automatic conversion." },
    ],
    relatedProducts: [], seoTitle: "NGO Grant Management - TrueWorks", seoDescription: "Grant management system for NGOs with donor tracking and compliance reporting",
    downloadLimit: 5, downloadExpiry: 365, status: "active", featured: true, salesCount: 6,
  });

  const p4 = await ctx.db.insert("products", {
    name: "School Administration Dashboard", sku: "TW-SCH-004", slug: "school-administration-dashboard",
    shortDescription: "Complete school management dashboard with student tracking, fee collection, and staff management.",
    description: "Comprehensive school administration system. Manage student enrollment, track fee payments, monitor staff performance, and generate termly academic reports. Built for Ugandan primary and secondary schools.",
    price: 120000, category: "Dashboards", industry: "Schools",
    fileType: "Excel (.xlsx)", tags: ["school", "education", "students", "fees", "academic"],
    images: [img("School_Admin_Dashboard_01"), img("School_Admin_Dashboard_02")],
    thumbnail: img("School_Admin_Dashboard_01"),
    downloadableFiles: [file("School_Admin_Dashboard.xlsx"), file("Setup_Guide.pdf")],
    version: "2.0", changelog: "Added termly reporting module and parent communication tracker",
    whatsInside: [
      "Student enrollment and demographic tracker",
      "Fee collection and arrears management",
      "Staff attendance and performance dashboard",
      "Termly academic reports with grade analytics",
      "Classroom allocation and timetable view",
      "Parent/guardian contact directory",
      "Expense tracking by department",
      "Annual school calendar planner",
      "Exam results analysis with pass rate trends",
      "PTA meeting and communication log",
    ],
    fileCompatibility: "Microsoft Excel 2016 or later (Windows & Mac). No macros required.",
    faq: [
      { question: "Can I track fee payments from multiple terms?", answer: "Yes, the system tracks fees term by term with automatic arrears calculation." },
      { question: "Does it support the Ugandan curriculum?", answer: "Yes, built for the Ugandan education system with term/school year structure." },
    ],
    relatedProducts: [], seoTitle: "School Administration Dashboard - TrueWorks", seoDescription: "School management dashboard for Ugandan educational institutions",
    downloadLimit: 5, downloadExpiry: 365, status: "active", featured: false, salesCount: 4,
  });

  const p5 = await ctx.db.insert("products", {
    name: "Church Stewardship & Finance System", sku: "TW-CH-005", slug: "church-stewardship-finance-system",
    shortDescription: "Church financial management system with tithe tracking, expense management, and annual budgeting.",
    description: "Designed for churches and religious organizations across East Africa. Track tithes and offerings, manage expenses by ministry department, generate monthly financial reports and annual budget comparisons. Includes multi-branch support.",
    price: 85000, category: "Budget Templates", industry: "Churches",
    fileType: "Excel (.xlsx)", tags: ["church", "stewardship", "finance", "tithe", "offering"],
    images: [img("Church_Finance_System_01"), img("Church_Finance_System_02")],
    thumbnail: img("Church_Finance_System_01"),
    downloadableFiles: [file("Church_Finance_System.xlsx"), file("Quick_Start_Guide.pdf")],
    version: "1.2", changelog: "Added multi-currency support for foreign donations",
    whatsInside: [
      "Tithe and offering weekly tracker",
      "Expense management by ministry department",
      "Monthly and annual budget vs actual reports",
      "Donor/pledge tracking module",
      "Multi-currency donation recording (UGX, USD, EUR)",
      "Automated bank reconciliation",
      "Annual stewardship report generator",
      "User roles with access controls",
      "Multi-branch/satellite church consolidation",
      "Event and project fund tracking",
    ],
    fileCompatibility: "Microsoft Excel 2016 or later (Windows & Mac).",
    faq: [
      { question: "Can multiple church branches use this?", answer: "Yes, the system supports branch-level tracking with consolidated reporting." },
      { question: "Does it track pledges?", answer: "Yes, includes a pledge management module with fulfillment tracking." },
    ],
    relatedProducts: [], seoTitle: "Church Finance System - TrueWorks", seoDescription: "Church financial management system for East African churches",
    downloadLimit: 5, downloadExpiry: 365, status: "active", featured: false, salesCount: 3,
  });

  const p6 = await ctx.db.insert("products", {
    name: "HR & Payroll Management System", sku: "TW-HR-006", slug: "hr-payroll-management-system",
    shortDescription: "Complete HR and payroll system with employee records, payroll processing, and leave management.",
    description: "Professional HR management system built for East African businesses. Manage employee records, process payroll with URA PAYE/NSSF calculations, track leave balances, and generate comprehensive HR reports. Updated for the 2025/2026 tax year.",
    price: 200000, salePrice: 149000, category: "HR Systems", industry: "HR",
    fileType: "Excel (.xlsx)", tags: ["hr", "payroll", "employees", "tax", "leave"],
    images: [img("placeholder-dashboard"), img("placeholder-data"), img("placeholder-report")],
    thumbnail: img("placeholder-dashboard"),
    downloadableFiles: [file("HR_Payroll_System.xlsx"), file("Setup_Guide.pdf"), file("User_Guide.pdf")],
    version: "2.1", changelog: "Updated URA tax tables for 2025/2026 financial year",
    whatsInside: [
      "Employee records database with document storage",
      "Monthly payroll processing with PAYE/NSSF auto-calculation",
      "Leave management with balance tracking",
      "Performance review tracker",
      "HR letter templates (appointment, confirmation, termination)",
      "Department-wise cost analysis",
      "Payslip generator with email merge",
      "URA annual returns report",
      "Training and certification tracker",
      "Disciplinary case management log",
    ],
    fileCompatibility: "Microsoft Excel 2016 or later (Windows only). Requires macros for payroll calculations.",
    faq: [
      { question: "Does it handle PAYE?", answer: "Yes, with current URA tax rates including all reliefs and bands." },
      { question: "Is NSSF included?", answer: "Yes, both employer and employee NSSF contributions are automatically calculated." },
      { question: "Can I generate payslips?", answer: "Yes, the system includes a batch payslip generator with email merge." },
    ],
    relatedProducts: [], seoTitle: "HR & Payroll System - TrueWorks", seoDescription: "HR and payroll management system for East African businesses",
    downloadLimit: 3, downloadExpiry: 365, status: "active", featured: true, salesCount: 7,
  });

  const p7 = await ctx.db.insert("products", {
    name: "SME Business Budget & Forecast Pro", sku: "TW-BF-007", slug: "sme-business-budget-forecast-pro",
    shortDescription: "Professional budgeting and forecasting toolkit for SMEs with 3-statement model integration.",
    description: "Purpose-built for Small and Medium Enterprises across East Africa. Create professional budgets, forecast revenue and expenses, manage cash flow with rolling forecasts and what-if analysis. Includes zero-based budgeting capability.",
    price: 95000, category: "Budget Templates", industry: "Business",
    fileType: "Excel (.xlsx)", tags: ["sme", "budget", "forecast", "cash-flow", "planning"],
    images: [img("placeholder-financial"), img("placeholder-chart")],
    thumbnail: img("placeholder-financial"),
    downloadableFiles: [file("SME_Budget_Forecast.xlsx"), file("Setup_Guide.pdf")],
    version: "1.8", changelog: "Added cash flow forecasting and what-if scenario planner",
    whatsInside: [
      "Annual budget planner with monthly breakdowns",
      "Revenue forecasting model with trend analysis",
      "Expense budget with category tracking",
      "Cash flow statement with 12-month rolling forecast",
      "What-if scenario analyzer",
      "Budget vs actual comparison dashboard",
      "Break-even analysis calculator",
      "Executive summary with key financial ratios",
      "Department budget allocation planner",
      "Quarterly review and adjustment tracker",
    ],
    fileCompatibility: "Microsoft Excel 2016 or later (Windows & Mac).",
    faq: [
      { question: "Can I use this for a startup?", answer: "Absolutely. The toolkit works for both established SMEs and startups preparing their first budget." },
      { question: "Does it include cash flow forecasting?", answer: "Yes, with 12-month rolling forecast and what-if scenario analysis." },
    ],
    relatedProducts: [], seoTitle: "SME Budget Pro - TrueWorks", seoDescription: "Budgeting and forecasting toolkit for East African SMEs",
    downloadLimit: 5, downloadExpiry: 365, status: "active", featured: false, salesCount: 5,
  });

  const p8 = await ctx.db.insert("products", {
    name: "Agriculture Farm Management System", sku: "TW-AG-008", slug: "agriculture-farm-management-system",
    shortDescription: "Farm management system with crop tracking, livestock records, and harvest forecasting.",
    description: "Comprehensive farm management solution for East African agriculture. Track crop cycles, manage livestock, forecast harvest yields, and monitor farm finances with a complete agriculture-specific accounting system.",
    price: 110000, category: "Inventory Systems", industry: "Agriculture",
    fileType: "Excel (.xlsx)", tags: ["agriculture", "farm", "crops", "livestock", "harvest"],
    images: [img("placeholder-dashboard"), img("placeholder-data")],
    thumbnail: img("placeholder-dashboard"),
    downloadableFiles: [file("Farm_Management_System.xlsx"), file("Setup_Guide.pdf")],
    version: "1.0", changelog: "Initial release",
    whatsInside: [
      "Crop cycle planner with planting and harvest dates",
      "Livestock inventory and health records",
      "Harvest yield forecasting and actual tracking",
      "Farm expense and revenue accounting",
      "Input cost tracking (seeds, fertilizer, labor)",
      "Weather and irrigation log",
      "Equipment maintenance scheduler",
      "Profitability analysis per crop/livestock type",
      "Seasonal planning calendar",
      "Market price tracking for key crops",
    ],
    fileCompatibility: "Microsoft Excel 2016 or later (Windows & Mac).",
    faq: [
      { question: "Can I track multiple farms?", answer: "Yes, you can manage unlimited farms with separate sheets." },
      { question: "Does it include crop rotation planning?", answer: "Yes, the crop planner includes rotation scheduling with soil health notes." },
    ],
    relatedProducts: [], seoTitle: "Farm Management - TrueWorks", seoDescription: "Farm management system for East African agriculture",
    downloadLimit: 5, downloadExpiry: 365, status: "active", featured: false, salesCount: 2,
  });

  const p9 = await ctx.db.insert("products", {
    name: "Ultimate Business Bundle", sku: "TW-BND-009", slug: "ultimate-business-bundle",
    shortDescription: "Complete business toolkit: financial model, budget, HR system, and dashboard at 40% discount.",
    description: "The ultimate business package. Includes Financial Model & Valuation Toolkit, HR & Payroll System, SME Budget Pro, and Executive Dashboard — all at 40% off the individual prices. Perfect for growing businesses that need a complete financial system.",
    price: 550000, salePrice: 329000, category: "Bundles", industry: "Business",
    fileType: "Multiple Formats", tags: ["bundle", "business", "complete", "package"],
    images: [img("placeholder-financial"), img("placeholder-dashboard"), img("placeholder-report")],
    thumbnail: img("placeholder-dashboard"),
    downloadableFiles: [file("Ultimate_Business_Bundle.zip")],
    version: "2.0", changelog: "Updated all four templates to latest versions",
    whatsInside: [
      "Financial Model & Valuation Toolkit (valued at UGX 250,000)",
      "HR & Payroll Management System (valued at UGX 200,000)",
      "SME Business Budget & Forecast Pro (valued at UGX 95,000)",
      "Executive Dashboard with key business metrics",
      "Cross-template integration guide",
      "Priority email support for 30 days",
      "Quarterly template updates for 1 year",
    ],
    fileCompatibility: "Microsoft Excel 2016 or later. Individual file requirements apply (see product pages).",
    demoUrl: "https://fast-clam-474.convex.cloud/demo/business-bundle",
    faq: [
      { question: "What's included?", answer: "4 premium products valued at UGX 545,000+ for only UGX 329,000 — a 40% saving." },
      { question: "Can I upgrade to a different bundle?", answer: "Contact us at hello@trueworks.ug for custom bundle options." },
      { question: "How do I access updates?", answer: "Bundle purchases include quarterly updates for 1 year." },
    ],
    relatedProducts: [p2, p6, p7], seoTitle: "Business Bundle - TrueWorks", seoDescription: "Complete business toolkit bundle with 40% savings",
    downloadLimit: 10, downloadExpiry: 365, status: "active", featured: true, salesCount: 3,
  });

  // Related products
  await ctx.db.patch(p1, { relatedProducts: [p2, p3] });
  await ctx.db.patch(p2, { relatedProducts: [p1, p3, p7] });
  await ctx.db.patch(p3, { relatedProducts: [p1, p4] });
  await ctx.db.patch(p6, { relatedProducts: [p2, p7] });
  await ctx.db.patch(p7, { relatedProducts: [p2, p6] });

  // ── Settings ──
  await ctx.db.insert("settings", { key: "home_layout", value: "showroom" });

  // ── Page Sections ──
  await Promise.all([
    ctx.db.insert("pageSections", { type: "hero", title: "Hero Section", content: "Main homepage hero with carousel", order: 0, active: true }),
    ctx.db.insert("pageSections", { type: "featured", title: "Featured Products", content: "Featured products grid", order: 1, active: true }),
    ctx.db.insert("pageSections", { type: "content", title: "Shop by Industry", content: "Industry grid section", order: 2, active: true }),
    ctx.db.insert("pageSections", { type: "testimonial", title: "Testimonials", content: "Customer testimonials carousel", order: 3, active: true }),
    ctx.db.insert("pageSections", { type: "cta", title: "Free Resource CTA", content: "Free Hospital KPI Dashboard download CTA", order: 4, active: true }),
  ]);

  // ── Customers ──
  const c1 = await ctx.db.insert("customers", {
    name: "Dr. Sarah Nambozo", email: "sarah@kmc.ug", phone: "+256 700 123456",
    company: "Kampala Medical Centre", industry: "Healthcare", newsletter: true,
    favoriteCategories: ["Dashboards"], lifetimeValue: 99000, totalOrders: 1, totalDownloads: 2,
    lastPurchaseAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  });
  const c2 = await ctx.db.insert("customers", {
    name: "James Ochieng", email: "james@eadf.org", phone: "+256 772 987654",
    company: "East African Development Fund", industry: "Finance", newsletter: true,
    favoriteCategories: ["Financial Models"], lifetimeValue: 250000, totalOrders: 1, totalDownloads: 1,
    lastPurchaseAt: new Date(Date.now() - 45 * 86400000).toISOString(),
  });
  const c3 = await ctx.db.insert("customers", {
    name: "Grace Akello", email: "grace@hoperelief.org", phone: "+256 701 456789",
    company: "Hope Relief NGO", industry: "NGO", newsletter: true,
    favoriteCategories: ["Financial Models"], lifetimeValue: 129000, totalOrders: 1, totalDownloads: 0,
    lastPurchaseAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  });
  const c4 = await ctx.db.insert("customers", {
    name: "Peter Mukasa", email: "peter@buildco.ug", phone: "+256 755 321654",
    company: "BuildCo Construction", industry: "Business", newsletter: false,
    favoriteCategories: ["Budget Templates"], lifetimeValue: 329000, totalOrders: 1, totalDownloads: 1,
    lastPurchaseAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  });
  const c5 = await ctx.db.insert("customers", {
    name: "Rev. John Ssempijja", email: "john@stmarks.ug", phone: "+256 783 555222",
    company: "St. Mark's Cathedral", industry: "Churches", newsletter: true,
    favoriteCategories: ["Budget Templates"], lifetimeValue: 85000, totalOrders: 1, totalDownloads: 1,
    lastPurchaseAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  });
  const c6 = await ctx.db.insert("customers", {
    name: "Alice Kemigisha", email: "alice@stmarysschool.ug",
    company: "St. Mary's Secondary School", industry: "Schools", newsletter: true,
    favoriteCategories: ["Dashboards"], lifetimeValue: 120000, totalOrders: 1, totalDownloads: 3,
    lastPurchaseAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  });

  // ── Orders ──
  const o1 = await ctx.db.insert("orders", {
    orderNumber: "TW-2025-0001", customerId: c1,
    customer: { name: "Dr. Sarah Nambozo", email: "sarah@kmc.ug", phone: "+256 700 123456" },
    items: [{ productId: p1, productName: "Hospital KPI Dashboard Pro", quantity: 1, price: 99000 }],
    subtotal: 99000, total: 99000, paymentMethod: "mtn_momo",
    paymentStatus: "completed", orderStatus: "completed",
    downloadLinks: [{
      productId: p1, productName: "Hospital KPI Dashboard Pro", url: "#",
      downloadCount: 2, remainingDownloads: 3, expiryDate: new Date(Date.now() + 350 * 86400000).toISOString(), status: "active",
    }],
  });
  const o2 = await ctx.db.insert("orders", {
    orderNumber: "TW-2025-0002", customerId: c2,
    customer: { name: "James Ochieng", email: "james@eadf.org" },
    items: [{ productId: p2, productName: "Financial Model & Valuation Toolkit", quantity: 1, price: 250000 }],
    subtotal: 250000, total: 250000, paymentMethod: "visa",
    paymentStatus: "completed", orderStatus: "completed",
    downloadLinks: [{
      productId: p2, productName: "Financial Model & Valuation Toolkit", url: "#",
      downloadCount: 1, remainingDownloads: 2, expiryDate: new Date(Date.now() + 320 * 86400000).toISOString(), status: "active",
    }],
  });
  const o3 = await ctx.db.insert("orders", {
    orderNumber: "TW-2025-0003", customerId: c3,
    customer: { name: "Grace Akello", email: "grace@hoperelief.org" },
    items: [{ productId: p3, productName: "NGO Grant Management System", quantity: 1, price: 129000 }],
    subtotal: 129000, total: 129000, paymentMethod: "airtel_money",
    paymentStatus: "completed", orderStatus: "completed",
    downloadLinks: [],
  });
  const o4 = await ctx.db.insert("orders", {
    orderNumber: "TW-2025-0004", customerId: c4,
    customer: { name: "Peter Mukasa", email: "peter@buildco.ug", phone: "+256 755 321654" },
    items: [{ productId: p9, productName: "Ultimate Business Bundle", quantity: 1, price: 329000 }],
    subtotal: 329000, total: 329000, paymentMethod: "mtn_momo",
    paymentStatus: "completed", orderStatus: "completed",
    downloadLinks: [{
      productId: p9, productName: "Ultimate Business Bundle", url: "#",
      downloadCount: 1, remainingDownloads: 9, expiryDate: new Date(Date.now() + 358 * 86400000).toISOString(), status: "active",
    }],
  });
  const o5 = await ctx.db.insert("orders", {
    orderNumber: "TW-2025-0005", customerId: c5,
    customer: { name: "Rev. John Ssempijja", email: "john@stmarks.ug" },
    items: [{ productId: p5, productName: "Church Stewardship & Finance System", quantity: 1, price: 85000 }],
    subtotal: 85000, total: 85000, paymentMethod: "mastercard",
    paymentStatus: "completed", orderStatus: "completed",
    downloadLinks: [{
      productId: p5, productName: "Church Stewardship & Finance System", url: "#",
      downloadCount: 0, remainingDownloads: 5, expiryDate: new Date(Date.now() + 365 * 86400000).toISOString(), status: "active",
    }],
  });
  const o6 = await ctx.db.insert("orders", {
    orderNumber: "TW-2025-0006", customerId: c6,
    customer: { name: "Alice Kemigisha", email: "alice@stmarysschool.ug" },
    items: [{ productId: p4, productName: "School Administration Dashboard", quantity: 1, price: 120000 }],
    subtotal: 120000, total: 120000, paymentMethod: "mtn_momo",
    paymentStatus: "completed", orderStatus: "completed",
    downloadLinks: [{
      productId: p4, productName: "School Administration Dashboard", url: "#",
      downloadCount: 3, remainingDownloads: 2, expiryDate: new Date(Date.now() + 345 * 86400000).toISOString(), status: "active",
    }],
  });
  const o7 = await ctx.db.insert("orders", {
    orderNumber: "TW-2025-0007", customerId: c1,
    customer: { name: "Dr. Sarah Nambozo", email: "sarah@kmc.ug" },
    items: [{ productId: p3, productName: "NGO Grant Management System", quantity: 1, price: 129000 }],
    subtotal: 129000, total: 129000, paymentMethod: "visa",
    paymentStatus: "pending", orderStatus: "processing",
    downloadLinks: [],
  });

  // ── Payments ──
  const now = Date.now();
  await Promise.all([
    ctx.db.insert("payments", { orderId: o1, orderNumber: "TW-2025-0001", amount: 99000, method: "mtn_momo", status: "completed", reference: "MOMO-KMC-" + (now - 15 * 86400000) }),
    ctx.db.insert("payments", { orderId: o2, orderNumber: "TW-2025-0002", amount: 250000, method: "visa", status: "completed", reference: "VISA-EADF-" + (now - 45 * 86400000) }),
    ctx.db.insert("payments", { orderId: o3, orderNumber: "TW-2025-0003", amount: 129000, method: "airtel_money", status: "completed", reference: "AIRTEL-HOPE-" + (now - 30 * 86400000) }),
    ctx.db.insert("payments", { orderId: o4, orderNumber: "TW-2025-0004", amount: 329000, method: "mtn_momo", status: "completed", reference: "MOMO-BUILDCO-" + (now - 7 * 86400000) }),
    ctx.db.insert("payments", { orderId: o5, orderNumber: "TW-2025-0005", amount: 85000, method: "mastercard", status: "completed", reference: "MC-STMARKS-" + (now - 60 * 86400000) }),
    ctx.db.insert("payments", { orderId: o6, orderNumber: "TW-2025-0006", amount: 120000, method: "mtn_momo", status: "completed", reference: "MOMO-STMARY-" + (now - 20 * 86400000) }),
  ]);

  // ── Reviews ──
  await Promise.all([
    ctx.db.insert("reviews", { productId: p1, customerId: c1, customerName: "Dr. Sarah Nambozo", rating: 5, title: "Game changer for our hospital", content: "This dashboard gave us financial visibility we never had before. The bed occupancy tracker alone saved us from overstaffing three wards. Highly recommended for any healthcare facility.", featured: true, approved: true }),
    ctx.db.insert("reviews", { productId: p2, customerId: c2, customerName: "James Ochieng", rating: 5, title: "Investment-grade models", content: "I've used these models for multiple portfolio valuations. The DCF model is particularly well-built with clear assumptions and sensitivity analysis. Exceptional quality.", featured: true, approved: true }),
    ctx.db.insert("reviews", { productId: p3, customerId: c3, customerName: "Grace Akello", rating: 5, title: "Donor reporting made easy", content: "Our USAID compliance reporting improved dramatically. The built-in templates saved us weeks of work. Every NGO in East Africa should use this.", featured: true, approved: true }),
    ctx.db.insert("reviews", { productId: p5, customerId: c5, customerName: "Rev. John Ssempijja", rating: 4, title: "Great church finance tool", content: "Finally, a system that understands church finances. The tithe tracking and ministry expense breakdown is exactly what we needed.", featured: false, approved: true }),
    ctx.db.insert("reviews", { productId: p4, customerId: c6, customerName: "Alice Kemigisha", rating: 5, title: "Perfect for our school", content: "We were using paper records before this. The fee tracking and termly reports have transformed our administration.", featured: true, approved: true }),
    ctx.db.insert("reviews", { productId: p6, customerName: "Robert Mutebi", rating: 4, title: "Solid payroll system", content: "The PAYE calculations are accurate and up to date. Took some time to set up but works well once configured.", featured: false, approved: true }),
  ]);

  // ── Blog Posts ──
  await ctx.db.insert("blogPosts", {
    title: "5 KPIs Every Ugandan Hospital Should Track in 2025",
    slug: "5-kpis-every-ugandan-hospital-should-track",
    excerpt: "Discover the key performance indicators that drive better patient outcomes, operational efficiency, and financial sustainability for healthcare facilities in Uganda.",
    content: "<p>In today's rapidly evolving healthcare landscape, data-driven decision-making is no longer optional — it's essential. Ugandan hospitals face unique challenges, from resource constraints to growing patient demand. By tracking the right Key Performance Indicators (KPIs), hospital administrators can make informed decisions that improve patient care and operational efficiency.</p><h2>1. Bed Occupancy Rate</h2><p>This metric measures the percentage of available beds occupied over a specific period. A rate of 70-85% is generally considered optimal. Below 70% suggests underutilization; above 85% indicates potential capacity issues. Tracking this KPI helps with resource allocation, staffing decisions, and infrastructure planning.</p><h2>2. Patient Wait Time</h2><p>Average time from patient arrival to consultation. Long wait times are a leading cause of patient dissatisfaction. Monitor by department (Outpatient, Emergency, Specialist Clinics) and identify bottlenecks in your patient flow.</p><h2>3. Revenue per Bed</h2><p>A critical financial metric that combines occupancy with average revenue per patient day. This KPI helps you understand your hospital's revenue-generating efficiency and benchmark against industry standards.</p><h2>4. Hospital-Acquired Infection Rate</h2><p>Track infections acquired during a patient's stay. This is both a quality-of-care indicator and a cost-control metric. Lower rates mean better patient outcomes and reduced treatment costs.</p><h2>5. Staff-to-Patient Ratio</h2><p>Proper staffing levels directly impact patient outcomes and staff well-being. Track ratios by department and shift to ensure adequate coverage without overspending on labor costs.</p><p>Our Hospital KPI Dashboard Pro is designed to track all these metrics and 40+ more, with automated alerts and visual dashboards.</p>",
    category: "Healthcare", tags: ["kpi", "healthcare", "hospital-management"], image: img("Hospital_KPI_Dashboard_Pro"),
    author: "TrueWorks Team", readingTime: 8, featured: true,
    publishedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  });
  await ctx.db.insert("blogPosts", {
    title: "Building a Budget That Drives Growth: A Guide for East African SMEs",
    slug: "building-budget-that-drives-growth",
    excerpt: "Learn how SMEs in Uganda and across East Africa can create strategic budgets that align with business goals and drive sustainable growth.",
    content: "<p>Budgeting is often viewed as a tedious annual exercise, but for Small and Medium Enterprises (SMEs) in East Africa, it is one of the most powerful tools for driving growth. A well-structured budget does more than track expenses — it provides a roadmap for strategic decision-making.</p><h2>Why Most SME Budgets Fail</h2><p>The most common mistake we see among Ugandan SMEs is treating the budget as a static document. Markets change, costs fluctuate, and opportunities arise. A budget should be a living tool that adapts to your business environment.</p><h2>The Zero-Based Budgeting Approach</h2><p>Instead of basing your new budget on last year's numbers (incremental budgeting), consider zero-based budgeting. Every expense must be justified from scratch each period. This approach forces you to evaluate the ROI of every cost center.</p><h2>Key Components of a Growth-Oriented Budget</h2><p>Revenue Forecast: Base this on realistic market analysis, not optimism. Include multiple scenarios (best case, expected, worst case). Fixed vs Variable Costs: Clearly separate these to understand your cost structure and break-even point. Growth Investment: Allocate at least 10-15% of your budget to growth activities. Cash Flow Projection: Profitability does not equal liquidity. A 12-month cash flow forecast is essential.</p><h2>Using Technology</h2><p>Excel-based budgeting tools, like our SME Business Budget & Forecast Pro, make it easy to create professional budgets without expensive accounting software. The key is to build a system you will actually use and update regularly.</p>",
    category: "Business", tags: ["budget", "sme", "financial-planning"], image: img("placeholder-financial"),
    author: "TrueWorks Team", readingTime: 12, featured: true,
    publishedAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  });
  await ctx.db.insert("blogPosts", {
    title: "Top 10 Excel Shortcuts Every Business Analyst Should Know",
    slug: "top-10-excel-shortcuts-every-business-analyst",
    excerpt: "Boost your productivity and efficiency with these essential Excel keyboard shortcuts that every business analyst and finance professional should master.",
    content: "<p>In the world of business analysis, speed and accuracy are everything. Mastering Excel keyboard shortcuts can save you hours each week and make you significantly more productive.</p><h2>1. Ctrl + Shift + L — Toggle Filters</h2><p>Instantly add or remove filter arrows on your data headers. One of the most used shortcuts in data analysis.</p><h2>2. Ctrl + T — Create Table</h2><p>Convert your data range into an Excel Table. This enables structured references, automatic formatting, and easier sorting/filtering.</p><h2>3. Alt + F1 — Create Chart</h2><p>Select your data and press Alt + F1 to instantly create a default chart on a new sheet. Customize from there.</p><h2>4. F4 — Repeat Last Action</h2><p>This is a powerhouse. Applied a format? Press F4 to repeat it on another cell. Inserted a row? F4 does it again.</p><h2>5. Ctrl + Shift + Arrow — Select to Edge</h2><p>Quickly select from your current cell to the last cell with data in any direction.</p><p>These shortcuts are just the beginning. Our downloadable Excel templates include pre-built shortcuts and productivity aids to help you work faster.</p>",
    category: "Productivity", tags: ["excel", "shortcuts", "productivity"], image: img("placeholder-chart"),
    author: "TrueWorks Team", readingTime: 6, featured: false,
    publishedAt: new Date(Date.now() - 120 * 86400000).toISOString(),
  });

  // ── Navigation ──
  await ctx.db.insert("navigation", { label: "Home", url: "/", order: 1 });
  await ctx.db.insert("navigation", { label: "Store", url: "/store", order: 2 });
  const navAbout = await ctx.db.insert("navigation", { label: "About", url: "/about", order: 3 });
  await ctx.db.insert("navigation", { label: "Resources", url: "/resources", order: 4 });
  await ctx.db.insert("navigation", { label: "Contact", url: "/contact", order: 5 });
  await ctx.db.insert("navigation", { label: "FAQ", url: "/faq", order: 6 });
  await ctx.db.insert("navigation", { label: "Our Story", url: "/about/our-story", parentId: navAbout, order: 1 });
  await ctx.db.insert("navigation", { label: "Team", url: "/about/team", parentId: navAbout, order: 2 });
  await ctx.db.insert("navigation", { label: "Careers", url: "/about/careers", parentId: navAbout, order: 3 });

    // ── Admin User (skipped when called from bootstrap action) ──
    if (!skipAdminCreation) {
        await ctx.db.insert("users", {
            name: "Admin User", email: "musinguzie612@gmail.com",
            role: "admin", permissions: ["all"], twoFactorEnabled: false,
            lastLogin: new Date().toISOString(),
        });
    }

  // ── Resources ──
  await Promise.all([
    ctx.db.insert("resources", { title: "Getting Started Guide: TrueWorks Templates", type: "guide", description: "Learn how to install, configure, and get the most out of your TrueWorks templates.", image: "", url: "/resources/getting-started-guide", featured: true, category: "General" }),
    ctx.db.insert("resources", { title: "Template Tutorial: Building Your First Dashboard", type: "template", description: "Step-by-step tutorial on creating a professional KPI dashboard from scratch.", image: "", url: "/resources/building-first-dashboard", featured: true, category: "Dashboards" }),
    ctx.db.insert("resources", { title: "Case Study: Kampala Medical Centre Digital Transformation", type: "case_study", description: "How Kampala Medical Centre improved patient outcomes using our Hospital KPI Dashboard.", image: "", url: "/resources/kmc-case-study", featured: true, category: "Healthcare" }),
    ctx.db.insert("resources", { title: "Financial Modeling Best Practices", type: "article", description: "Expert tips and industry standards for building reliable financial models.", image: "", url: "/resources/financial-modeling-best-practices", featured: false, category: "Finance" }),
    ctx.db.insert("resources", { title: "NGO Grant Reporting Compliance Checklist", type: "guide", description: "Essential compliance requirements for USAID, EU, and UN grant reporting.", image: "", url: "/resources/grant-compliance-checklist", featured: false, category: "NGO" }),
  ]);

  // ── Coupons ──
  await Promise.all([
    ctx.db.insert("coupons", { code: "LAUNCH20", type: "percentage", value: 20, minPurchase: 50000, usageLimit: 50, usageCount: 12, expiresAt: new Date(Date.now() + 90 * 86400000).toISOString(), active: true }),
    ctx.db.insert("coupons", { code: "BUNDLE40", type: "bundle", value: 40, usageLimit: 30, usageCount: 3, expiresAt: new Date(Date.now() + 180 * 86400000).toISOString(), active: true }),
    ctx.db.insert("coupons", { code: "FIXED10K", type: "fixed", value: 10000, minPurchase: 100000, usageLimit: 100, usageCount: 5, expiresAt: new Date(Date.now() + 60 * 86400000).toISOString(), active: true }),
  ]);

  // ── Downloads ──
  await Promise.all([
    ctx.db.insert("downloads", { productId: p1, customerId: c1, orderId: o1, downloadCount: 2, remainingDownloads: 3, expiryDate: new Date(Date.now() + 350 * 86400000).toISOString(), device: "Windows PC", ipAddress: "192.168.1.100", status: "active" }),
    ctx.db.insert("downloads", { productId: p2, customerId: c2, orderId: o2, downloadCount: 1, remainingDownloads: 2, expiryDate: new Date(Date.now() + 320 * 86400000).toISOString(), device: "MacBook Pro", ipAddress: "192.168.1.101", status: "active" }),
    ctx.db.insert("downloads", { productId: p3, customerId: c3, orderId: o3, downloadCount: 0, remainingDownloads: 5, expiryDate: new Date(Date.now() + 365 * 86400000).toISOString(), status: "active" }),
    ctx.db.insert("downloads", { productId: p1, customerId: c1, orderId: o1, downloadCount: 5, remainingDownloads: 0, expiryDate: new Date(Date.now() - 30 * 86400000).toISOString(), device: "Android Tablet", ipAddress: "192.168.1.102", status: "expired" }),
    ctx.db.insert("downloads", { productId: p9, customerId: c4, orderId: o4, downloadCount: 1, remainingDownloads: 9, expiryDate: new Date(Date.now() + 358 * 86400000).toISOString(), device: "Windows PC", ipAddress: "10.0.0.45", status: "active" }),
    ctx.db.insert("downloads", { productId: p4, customerId: c6, orderId: o6, downloadCount: 3, remainingDownloads: 2, expiryDate: new Date(Date.now() + 345 * 86400000).toISOString(), device: "MacBook Air", ipAddress: "192.168.1.200", status: "active" }),
  ]);

  // ── Support Tickets ──
  await Promise.all([
    ctx.db.insert("supportTickets", { customerName: "Dr. Sarah Nambozo", customerEmail: "sarah@kmc.ug", subject: "Download link not working", message: "I purchased the Hospital KPI Dashboard but the download link appears to be expired.", priority: "high", status: "open", category: "Technical", orderId: o1, attachments: ["error_screenshot.png"] }),
    ctx.db.insert("supportTickets", { customerName: "James Ochieng", customerEmail: "james@eadf.org", subject: "Feature request: Multi-currency support", message: "Would love to see multi-currency support in the Financial Model Toolkit.", priority: "medium", status: "pending", category: "Feature Request", attachments: [] }),
    ctx.db.insert("supportTickets", { customerName: "Grace Akello", customerEmail: "grace@hoperelief.org", subject: "Question about grant reporting templates", message: "Do you have templates that support USAID reporting requirements?", priority: "low", status: "resolved", category: "General Inquiry", orderId: o3, attachments: [], resolution: "Yes, our NGO Grant Management System supports USAID, EU, and UN reporting formats." }),
    ctx.db.insert("supportTickets", { customerName: "Peter Mukasa", customerEmail: "peter@buildco.ug", subject: "Urgent: Payment issue with order", message: "I was charged twice for my order. Please refund the duplicate payment.", priority: "urgent", status: "open", category: "Billing", attachments: ["screenshot_1.png", "receipt.pdf"] }),
    ctx.db.insert("supportTickets", { customerName: "Alice Kemigisha", customerEmail: "alice@stmarysschool.ug", subject: "How to add new students for next term", message: "We're starting a new term and need to roll over student records. Is there an easy way to do this?", priority: "medium", status: "pending", category: "General Inquiry", orderId: o6, attachments: [] }),
  ]);

  // ── Notifications ──
  await Promise.all([
    ctx.db.insert("notifications", { title: "New Order Received", message: "Order TW-2025-0007 from Dr. Sarah Nambozo (pending payment)", type: "order", read: false }),
    ctx.db.insert("notifications", { title: "Payment Completed", message: "Payment of UGX 329,000 received for Order TW-2025-0004 from Peter Mukasa", type: "payment", read: false }),
    ctx.db.insert("notifications", { title: "New Support Ticket", message: "Urgent billing issue from Peter Mukasa - duplicate charge", type: "support", read: false }),
    ctx.db.insert("notifications", { title: "New Review", message: "Alice Kemigisha left a 5-star review for School Administration Dashboard", type: "review", read: false }),
    ctx.db.insert("notifications", { title: "Support Ticket Resolved", message: "Grace Akello's question about USAID reporting has been resolved", type: "system", read: true }),
  ]);

  // ── Activity Logs ──
  await Promise.all([
    ctx.db.insert("activityLogs", { action: "Product Created", resource: "products", details: "Hospital KPI Dashboard Pro", ipAddress: "192.168.1.1" }),
    ctx.db.insert("activityLogs", { action: "Order Completed", resource: "orders", details: "TW-2025-0001 - UGX 99,000", ipAddress: "192.168.1.1" }),
    ctx.db.insert("activityLogs", { action: "Payment Received", resource: "payments", details: "MTN MoMo - UGX 250,000", ipAddress: "192.168.1.1" }),
    ctx.db.insert("activityLogs", { action: "Database Seeded", resource: "system", details: "Initial seed completed with 9 products, 6 customers, 7 orders" }),
  ]);

  return { seeded: true, message: "Database seeded successfully with 9 products, 6 customers, 7 orders, and supporting data" };
}

// Internal mutation that seeds domain data without admin creation.
// Used by the bootstrap action after createAccount sets up the auth user.
export const runSeedInternal = internalMutation({
  handler: async (ctx) => {
    return await doSeed(ctx, true);
  },
});

// ════════════════════════════════════════════════════════════
// BOOTSTRAP
// ════════════════════════════════════════════════════════════
// One-time setup helper. Two flows are supported:
//
//   1. Cold start (no staff anywhere):
//        awape bootstrap via "browser console →
//        await convex.action(api.seed.bootstrap)"
//      This creates the first admin account AND the staff row.
//
//   2. Existing staff user, no auth account (the "I lost my
//      password" / "I deleted my old Convex account" recovery):
//        await provisionAuth via "browser console →
//        await convex.action(api.seed.provisionAuth)"
//      This creates ONLY the auth account for an existing staff
//      user. Staff row is preserved.
//
// Both rely on `createAccount` from @convex-dev/auth, which
// triggers `beforeSessionCreation` only on subsequent SIGN-IN
// (not at `createAccount` time), giving us a clean seam to gate
// against unprovisioned emails.
// ════════════════════════════════════════════════════════════

// ── Bootstrap Action ──
// Run once to provision the first admin auth account + seed the database.
// Call from the browser console after deployment:
//   await convex.action(api.seed.bootstrap)
export const bootstrap = action({
  args: {
    adminEmail: v.optional(v.string()),
    adminPassword: v.optional(v.string()),
    adminName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = (args.adminEmail ?? "musinguzie612@gmail.com").toLowerCase();
    const password = args.adminPassword ?? "TrueWorks@256";
    const name = args.adminName ?? "Super Admin";

    // Refuse to re-bootstrap if a Convex-auth account already
    // exists for this email. Use provisionAuth() instead.
    const existingAuth = await ctx.runQuery(api.seed.checkAuth, { email });
    if (existingAuth.hasAccount) {
      return {
        success: false,
        message: `Auth account for "${email}" already exists. Run seed.bootstrap() only once — use signIn() instead.`,
      };
    }

    // Step 1: seed domain rows (categories, products, etc.) AND
    // create the staff row in `users`. We do this BEFORE
    // createAccount so that when the user signs in,
    // beforeSessionCreation finds the staff row and doesn't
    // reject them.
    await ctx.runMutation(internal.seed.runSeedInternal, {});

    // Step 2: create the Convex-auth account for the staff
    // email. createAccount itself doesn't issue a session —
    // the user must sign in afterwards.
    await createAccount(ctx, {
      provider: "password",
      account: { id: email, secret: password },
      profile: { name, email, role: "admin", permissions: ["all"], twoFactorEnabled: false } as any,
    });

    return {
      success: true,
      message: `Bootstrap complete. Sign in with ${email} (use the password you set).`,
    };
  },
});

// ── Provision Auth Action ──
// Creates a Convex Auth account for an EXISTING staff user.
// Use this when the staff row already exists in `users` but the
// Convex-auth account was lost (data reset, re-deploy, etc).
//   await convex.action(api.seed.provisionAuth, {
//     email: "you@example.com",
//     password: "your-new-password"
//   })
export const provisionAuth = action({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase();
    const password = args.password;
    const name = args.name ?? "Admin User";

    // 1. Refuse if the staff row doesn't exist — provisioning
    //    is for bringing auth up to match an existing staff
    //    table, not the other way around.
    const staff = await ctx.runQuery(api.users.getByEmail, { email });
    if (!staff) {
      return {
        success: false,
        message: `No staff user with email "${email}" exists. Run seed.bootstrap() first to create one.`,
      };
    }

    // 2. Refuse if a Convex-auth account is already linked — the
    //    user should sign in instead. (Re-creating an auth
    //    account for the same email would leave orphan tokens
    //    behind.)
    const existingAuth = await ctx.runQuery(api.seed.checkAuth, { email });
    if (existingAuth.hasAccount) {
      return {
        success: false,
        message: `Auth account for "${email}" already exists — just sign in.`,
      };
    }

    await createAccount(ctx, {
      provider: "password",
      account: { id: email, secret: password },
      profile: { name, email, role: "admin", permissions: ["all"], twoFactorEnabled: false } as any,
    });

    return { success: true, message: `Auth provisioned for ${email}. You can now sign in.` };
  },
});

// ── Diagnostic Query ──
// Checks whether an auth account + staff user exist for an email.
//   npx convex run seed:checkAuth '{"email":"musinguzie612@gmail.com"}'
export const checkAuth = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase();
    const account = await ctx.db
      .query("authAccounts")
      .withIndex("providerAndAccountId", (q) =>
        q.eq("provider", "password").eq("providerAccountId", email),
      )
      .first();
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    return {
      hasAccount: !!account,
      hasUser: !!user,
      userRole: user?.role ?? null,
    };
  },
});

// ── Direct Provision Mutation ──
// Creates the Convex Auth account directly (no nested action calls).
//   npx convex run seed:provisionAuthDirect '{"email":"musinguzie612@gmail.com","password":"TrueWorks@256"}'
export const provisionAuthDirect = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase();
    const name = args.name ?? "Super Admin";

    // Clean up any existing records for this email
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    if (existingUser) await ctx.db.delete(existingUser._id);

    const existingAccount = await ctx.db
      .query("authAccounts")
      .withIndex("providerAndAccountId", (q) =>
        q.eq("provider", "password").eq("providerAccountId", email),
      )
      .first();
    if (existingAccount) await ctx.db.delete(existingAccount._id);

    // Create the staff user (auth user + staff profile in one doc)
    const userId = await ctx.db.insert("users", {
      name,
      email,
      role: "admin",
      permissions: ["all"],
      twoFactorEnabled: false,
      lastLogin: new Date().toISOString(),
    });

    // Hash password with Scrypt — same algorithm the Password provider uses
    const secret = await new Scrypt().hash(args.password);

    // Link the auth account to the user
    await ctx.db.insert("authAccounts", {
      userId,
      provider: "password",
      providerAccountId: email,
      secret,
    });

    return { success: true, message: `Auth provisioned for ${email}` };
  },
});

