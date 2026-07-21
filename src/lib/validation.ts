// src/lib/validation.ts
// ============================================================
// FORM VALIDATION SCHEMAS & HELPERS
// ============================================================
// Centralized Zod schemas for every public-facing form. Use
// `parseForm` on submit to surface friendly field-level
// errors. Server-side equivalents live in the matching
// Convex mutations (defense in depth).
// ============================================================

import { z } from 'zod';

// ------------------------------------------------------------
// Schemas
// ------------------------------------------------------------

/** Reusable email + name + phone building blocks. */
const email = z
  .string()
  .min(1, 'Email is required')
  .email('Enter a valid email address')
  .max(254, 'Email is too long');

const name = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(80, 'Name is too long')
  .refine((v) => !/[<>]/.test(v), 'Name contains invalid characters');

const phone = z
  .string()
  .max(20, 'Phone is too long')
  .refine(
    (v) => v === '' || /^\+?[0-9\s()-]{6,}$/.test(v),
    'Phone must be digits, spaces, or + ( ) -'
  )
  .optional();

const checkoutPhone = z
  .string()
  .min(6, 'Phone number is required')
  .max(20, 'Phone is too long')
  .refine(
    (v) => /^\+?[0-9\s()-]{6,}$/.test(v),
    'Phone must be digits, spaces, or + ( ) -'
  );

/** Contact form — public. Long enough to send a real message. */
export const contactSchema = z.object({
  name,
  email,
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(120),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});
export type ContactForm = z.infer<typeof contactSchema>;

/** Newsletter + Free Template forms — minimal. */
export const newsletterSchema = z.object({
  name,
  email,
});
export type NewsletterForm = z.infer<typeof newsletterSchema>;

/** Checkout customer-details form. */
export const checkoutSchema = z.object({
  name,
  email,
  phone,
  company: z.string().max(100).optional(),
  country: z.string().min(2).max(60),
  city: z.string().min(1).max(80),
  address: z.string().min(1).max(160).optional(),
});
export type CheckoutForm = z.infer<typeof checkoutSchema>;

/** Contact details used during the public checkout flow. */
export const checkoutContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80, 'Name is too long'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address').max(254, 'Email is too long'),
  phone: checkoutPhone,
  company: z.string().max(100).optional(),
});
export type CheckoutContactForm = z.infer<typeof checkoutContactSchema>;

/** Admin staff login form — same rules enforced server-side. */
export const loginSchema = z.object({
  email,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
});
export type LoginForm = z.infer<typeof loginSchema>;

/** Admin product create / update. */
export const productSchema = z.object({
  name: z.string().min(3).max(120),
  price: z.number().positive().max(100000),
  salePrice: z.number().nonnegative().max(100000).optional(),
  shortDescription: z.string().max(180),
  description: z.string().max(8000),
  category: z.string().min(1),
  industry: z.string().min(1),
  fileType: z.string().min(1),
  version: z.string().max(20),
  downloadLimit: z.number().int().min(1).max(100).default(5),
  downloadExpiry: z.number().int().min(1).max(90).default(7),
  status: z.enum(['active', 'draft', 'archived']),
});
export type ProductForm = z.infer<typeof productSchema>;

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

export type FormErrors<T> = Partial<Record<keyof T, string>>;

/**
 * Validates `values` against `schema`. Returns either
 * `{ ok: true, data }` on success or `{ ok: false, errors }`
 * on failure — never throws.
 *
 * Usage in a component:
 *   const result = parseForm(contactSchema, formData);
 *   if (!result.ok) { setErrors(result.errors); return; }
 *   await sendContact(result.data);
 */
export function parseForm<T extends z.ZodTypeAny>(
  schema: T,
  values: unknown
):
  | { ok: true; data: z.infer<T> }
  | { ok: false; errors: FormErrors<z.infer<T>> } {
  const parsed = schema.safeParse(values);
  if (parsed.success) {
    return { ok: true, data: parsed.data };
  }
  const errors: FormErrors<any> = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as string | undefined;
    if (key && !errors[key as keyof FormErrors<any>]) {
      errors[key] = issue.message;
    }
  }
  return { ok: false, errors };
}

/**
 * Sanitizes free-form text for safe HTML rendering.
 * Used on any user-submitted content we display back to
 * the admin (review text, support messages, blog comments).
 */
import DOMPurify from 'dompurify';

export function sanitizeHtml(input: string): string {
  if (typeof window === 'undefined') return input; // SSR safety
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}
