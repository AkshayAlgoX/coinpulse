import { clsx, type ClassValue } from 'clsx';
import { Time } from 'lightweight-charts';
import { twMerge } from 'tailwind-merge';

/**
 * Combine class name inputs into a single merged class string.
 *
 * @param inputs - One or more class values (strings, arrays, or objects) describing classes to include
 * @returns The combined class-name string with conflicting utility classes resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as a localized currency string or as a plain localized number.
 *
 * If `value` is `null`, `undefined`, or `NaN`, returns `'$0.00'` unless `showSymbol` is explicitly `false`, in which case returns `'0.00'`.
 *
 * @param digits - Number of fraction digits to display (defaults to 2).
 * @param currency - Currency code to use (case-insensitive, defaults to 'USD').
 * @param showSymbol - When `true` or `undefined`, include the currency symbol; when `false`, return a plain number string.
 * @returns The formatted currency or numeric string according to the provided options.
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
 * Formats a numeric percentage value to one decimal place with a trailing percent sign.
 *
 * @param change - The numeric percentage to format (e.g., `2.5` for "2.5%"). If `null`, `undefined`, or `NaN`, it is treated as 0.
 * @returns The formatted percentage string with one decimal place and a '%' suffix (for example, `2.5%`); returns `0.0%` for invalid inputs.
 */
export function formatPercentage(change: number | null | undefined): string {
  if (change === null || change === undefined || isNaN(change)) {
    return '0.0%';
  }
  const formattedChange = change.toFixed(1);
  return `${formattedChange}%`;
}

/**
 * Derives Tailwind/CSS class names that represent whether a numeric value is trending up or down.
 *
 * @param value - Numeric difference or change; positive indicates an upward trend.
 * @returns An object with `textClass`, `bgClass`, and `iconClass` strings:
 * - `textClass`: `'text-green-400'` if `value > 0`, otherwise `'text-red-400'`.
 * - `bgClass`: `'bg-green-500/10'` if `value > 0`, otherwise `'bg-red-500/10'`.
 * - `iconClass`: `'icon-up'` if `value > 0`, otherwise `'icon-down'`.
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
 * Formats a date as a human-friendly relative time string.
 *
 * @param date - A Date, ISO date string, or timestamp representing a past or future moment
 * @returns A relative time string: `just now` for <60s, `N min` for minutes, `N hour(s)` for hours, `N day(s)` for days, `N week(s)` for weeks, or an ISO date `YYYY-MM-DD` for older dates
 */
export function timeAgo(date: string | number | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diff = now.getTime() - past.getTime(); // difference in ms

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

  // Format date as YYYY-MM-DD
  return past.toISOString().split('T')[0];
}

/**
 * Convert an array of OHLC tuples into an array of candle objects with Time-typed timestamps and remove consecutive entries with duplicate times.
 *
 * @param data - Array of OHLC tuples where each item is expected as [time, open, high, low, close]; `time` is treated as seconds and cast to `Time`.
 * @returns An array of objects shaped as `{ time: Time, open: number, high: number, low: number, close: number }` with consecutive entries that share the same `time` collapsed to the first occurrence.
 */
export function convertOHLCData(data: OHLCData[]) {
  return data
    .map((d) => ({
      time: d[0] as Time, // ensure seconds, not ms
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
export const buildPageNumbers = (
  currentPage: number,
  totalPages: number,
): (number | typeof ELLIPSIS)[] => {
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

  if (start > 2) {
    pages.push(ELLIPSIS);
  }

  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  if (end < totalPages - 1) {
    pages.push(ELLIPSIS);
  }

  pages.push(totalPages);

  return pages;
};