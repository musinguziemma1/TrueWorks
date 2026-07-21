// convex/convex.config.ts
// ============================================================
// CONVEX CONFIGURATION
// ============================================================
// Convex Auth doesn't currently require a component module —
// authentication is configured through `convex/auth.ts` and
// the schema includes `authTables`. This file remains in
// place so we can layer in components (e.g. Resend,
// file storage helpers) without renaming later.
// ============================================================

import { defineApp } from "convex/server";


// Mount any Convex components below as the project grows:
//
// import { componentName } from "convex:<component-package>";
// app.use(componentName);

const app = defineApp();

export default app;
