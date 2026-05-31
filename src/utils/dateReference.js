/**
 * Date reference utility for the CSNP Member Portal.
 * Provides consistent date handling for all mock data and date calculations.
 * @module dateReference
 */

import { REFERENCE_DATE } from './constants.js';

/**
 * Returns the reference date used for date calculations throughout the application.
 * The reference date can be configured via the VITE_REFERENCE_DATE environment variable.
 *
 * @returns {Date} The reference date as a Date object.
 *
 * @example
 * const refDate = getReferenceDate();
 * // Returns Date object for 2024-06-10 (or configured date)
 */
export function getReferenceDate() {
  const parts = REFERENCE_DATE.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return new Date(year, month, day);
}

/**
 * Formats a Date object into a string using the specified format.
 *
 * Supported format tokens:
 * - `YYYY` — 4-digit year
 * - `MM` — 2-digit month (01–12)
 * - `DD` — 2-digit day (01–31)
 * - `M` — month without leading zero (1–12)
 * - `D` — day without leading zero (1–31)
 * - `MMMM` — full month name (January–December)
 * - `MMM` — abbreviated month name (Jan–Dec)
 *
 * Common format strings:
 * - `'YYYY-MM-DD'` → `'2024-06-10'`
 * - `'MM/DD/YYYY'` → `'06/10/2024'`
 * - `'MMMM D, YYYY'` → `'June 10, 2024'`
 * - `'MMM DD, YYYY'` → `'Jun 10, 2024'`
 *
 * @param {Date} date - The date to format.
 * @param {string} [format='YYYY-MM-DD'] - The format string.
 * @returns {string} The formatted date string.
 *
 * @example
 * formatDate(new Date(2024, 5, 10), 'YYYY-MM-DD');    // '2024-06-10'
 * formatDate(new Date(2024, 5, 10), 'MM/DD/YYYY');    // '06/10/2024'
 * formatDate(new Date(2024, 5, 10), 'MMMM D, YYYY');  // 'June 10, 2024'
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }

  const fullMonthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const shortMonthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const paddedMonth = String(month + 1).padStart(2, '0');
  const paddedDay = String(day).padStart(2, '0');

  let result = format;

  result = result.replace('YYYY', String(year));
  result = result.replace('MMMM', fullMonthNames[month]);
  result = result.replace('MMM', shortMonthNames[month]);
  result = result.replace('MM', paddedMonth);
  result = result.replace(/(?<!M)M(?!M)/, String(month + 1));
  result = result.replace('DD', paddedDay);
  result = result.replace(/(?<!D)D(?!D)/, String(day));

  return result;
}

/**
 * Computes a date relative to the reference date by adding or subtracting days.
 *
 * @param {number} offsetDays - The number of days to offset from the reference date.
 *   Positive values return future dates, negative values return past dates.
 * @returns {Date} The computed date.
 *
 * @example
 * getRelativeDate(0);   // Reference date (2024-06-10)
 * getRelativeDate(30);  // 30 days after reference date (2024-07-10)
 * getRelativeDate(-15); // 15 days before reference date (2024-05-26)
 */
export function getRelativeDate(offsetDays) {
  const ref = getReferenceDate();
  const result = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() + offsetDays);
  return result;
}