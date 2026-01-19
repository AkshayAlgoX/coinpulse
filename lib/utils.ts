import { clsx, type ClassValue } from 'clsx';
import { Time } from 'lightweight-charts';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes with clsx for conditional styling.
 * @param inputs - Array of class values to merge.
 * @returns A string of merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a numeric value into a localized currency string.
 * @param value - The number to format.
 * @param digits - Maximum fraction digits (default 2).
 * @param currency - The currency code (default 'USD').
 * @param showSymbol - Whether to display the currency symbol.
 * @returns A formatted currency string.
 */
export function formatCurrency(
  value: number | null | undefined,
  digits?: number,
  currency?: string,
  showSymbol?: boolean,
) {
  if (value === null || value === undefined || isNaN(value)) {
    return showSymbol !== false ? '$0.00' : '0.00';
  }

  if (showSymbol === undefined || showSymbol === true) {
    return value.toLocaleString(undefined, {
      style: 'currency',
      currency: currency?.toUpperCase() || 'USD',
      minimumFractionDigits: digits ?? 2,
      maximumFractionDigits: digits ?? 2,
    });
  }
  return value.toLocaleString(undefined, {
    minimumFractionDigits: digits ?? 2,
    maximumFractionDigits: digits ?? 2,
  });
}

/**
 * Formats a number as a percentage string.
 * @param change - The numeric change value.
 * @returns A string formatted as "X.X%".
 */
export function formatPercentage(change: number | null | undefined): string {
  if (change === null || change === undefined || isNaN(change)) {
    return '0.0%';
  }
  const formattedChange = change.toFixed(1);
  return `${formattedChange}%`;
}

/**
 * Returns Tailwind color classes based on whether a value is positive or negative.
 * @param value - The numeric value to check.
 * @returns An object containing text, background, and icon classes.
 */
export function trendingClasses(value: number) {
  const isTrendingUp = value > 0;

  return {
    textClass: isTrendingUp ? 'text-green-400' : 'text-red-400',
    bgClass: isTrendingUp ? 'bg-green-500/10' : 'bg-red-500/10',
    iconClass: isTrendingUp ? 'icon-up' : 'icon-down',
  };
}

/**
 * Converts a date into a relative "time ago" string.
 * Validates the date early to prevent runtime crashes.
 * @param date - The date to convert.
 * @returns A relative time string or "—" for invalid dates.
 */
export function timeAgo(date: string | number | Date): string {
  const now = new Date();
  const past = new Date(date);
  const pastMs = past.getTime();

  if (Number.isNaN(pastMs)) return '—';

  const diff = now.getTime() - pastMs;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes} min`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''}`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''}`;
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''}`;

  return past.toISOString().split('T')[0];
}

/**
 * Transforms raw OHLC data into a format compatible with lightweight-charts.
 * Normalizes milliseconds to seconds and filters duplicate timestamps.
 * @param data - Array of raw OHLC entries.
 * @returns Formatted OHLC objects for the chart.
 */
export function convertOHLCData(data: OHLCData[]) {
  const toSeconds = (t: number) => (t > 1e12 ? Math.floor(t / 1000) : t);

  return data
    .map((d) => ({
      time: toSeconds(d[0]) as Time,
      open: d[1],
      high: d[2],
      low: d[3],
      close: d[4],
    }))
    .filter(
      (item, index, arr) => index === 0 || item.time !== arr[index - 1].time,
    );
}

export const ELLIPSIS = 'ellipsis' as const;

/**
 * Generates an array of page numbers and ellipses for pagination UI.
 * @param currentPage - The currently active page.
 * @param totalPages - Total number of pages.
 * @returns An array of page numbers or the string 'ellipsis'.
 */
export function buildPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | typeof ELLIPSIS)[] {
  const MAX_VISIBLE_PAGES = 5;
  const pages: (number | typeof ELLIPSIS)[] = [];

  if (totalPages <= MAX_VISIBLE_PAGES) {
    for (let i = 1; i <= totalPages; i += 1) {
      pages.push(i);
    }
    return pages;
  }

  pages.push(1);
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) pages.push(ELLIPSIS);
  for (let i = start; i <= end; i += 1) pages.push(i);
  if (end < totalPages - 1) pages.push(ELLIPSIS);
  pages.push(totalPages);

  return pages;
}
