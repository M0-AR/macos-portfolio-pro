// Shared slug allow-list: blocks path-injection into Prisma lookups / upstream URLs.
// Single source of truth for projects + posts controllers (tested below).
const SLUG_RE = /^[a-z0-9-]{2,80}$/i;

export function isValidSlug(slug: unknown): slug is string {
  return typeof slug === 'string' && SLUG_RE.test(slug);
}

export function normalizeSlug(slug: string): string {
  return slug.toLowerCase();
}
