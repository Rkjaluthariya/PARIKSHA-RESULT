/**
 * Utility to parse different date formats used in the application:
 * - YYYY-MM-DD
 * - DD/MM/YYYY or DD-MM-YYYY
 * - DD Month YYYY (e.g., "06 August 2026", "5 August 2026")
 */
export function parseCustomDate(dateStr: any): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;

  const trimmed = dateStr.trim();

  // 1. Check YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) return d;
  }

  // 2. Check DD/MM/YYYY or DD-MM-YYYY
  const slashDashMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (slashDashMatch) {
    const day = parseInt(slashDashMatch[1], 10);
    const month = parseInt(slashDashMatch[2], 10) - 1;
    const year = parseInt(slashDashMatch[3], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) return d;
  }

  // 3. Try standard Date constructor (handles "06 August 2026", "August 06, 2026")
  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) return d;

  return null;
}

/**
 * Checks if a date string is older than 1 year (365 days) relative to a given baseline date.
 * If no baseline date is provided, uses the current date.
 */
export function isOlderThanOneYear(dateStr: string, baselineDate: Date = new Date()): boolean {
  const d = parseCustomDate(dateStr);
  if (!d) return false; // If date cannot be parsed, preserve it to be safe

  const oneYearAgo = new Date(baselineDate.getTime());
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  return d.getTime() < oneYearAgo.getTime();
}

/**
 * Filters any list of items having a date/postDate field to exclude items older than 1 year.
 */
export function filterOlderThanOneYear<T extends { postDate?: string; date?: string }>(
  items: T[],
  baselineDate: Date = new Date()
): T[] {
  if (!Array.isArray(items)) return [];
  return items.filter(item => {
    const dateToVerify = item.postDate || item.date;
    if (!dateToVerify) return true; // If no date field exists, keep it
    return !isOlderThanOneYear(dateToVerify, baselineDate);
  });
}
