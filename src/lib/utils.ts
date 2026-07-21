import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================
// CURRENCY FORMATTING
// ============================================================
// Default currency is USD. All product prices stored as numbers
// are treated as USD throughout the application.
// To switch currencies, update DEFAULT_CURRENCY and the locale.
// ============================================================
export const DEFAULT_CURRENCY = 'USD';
export const DEFAULT_LOCALE = 'en-US';

export function formatPrice(amount: number, currency: string = DEFAULT_CURRENCY): string {
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Compact price format for dashboard cards: $1.2K, $3.4M
export function formatPriceCompact(amount: number, currency: string = DEFAULT_CURRENCY): string {
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w]+/g, '-');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + '...';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
