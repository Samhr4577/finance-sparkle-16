
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Convert Date objects to string format for storage
export function dateToString(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Convert string dates to Date objects
export function stringToDate(dateString: string): Date {
  return new Date(dateString);
}

// Helper for safely handling date conversion in forms
export function ensureDateFormat(date: Date | string): Date {
  if (typeof date === 'string') {
    return new Date(date);
  }
  return date;
}
