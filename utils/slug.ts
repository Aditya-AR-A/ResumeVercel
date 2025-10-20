/**
 * Convert arbitrary text to a URL-friendly slug.
 * Lowercases, trims, and replaces non-alphanumeric characters with dashes.
 */
export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
