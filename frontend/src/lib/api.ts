// Server-only fetcher: browser never sees secrets. Backend owns cache + rate-limit.
const INTERNAL = process.env.BACKEND_INTERNAL_URL ?? "http://localhost:4000";

export async function api<T>(path: string, revalidate = 60): Promise<T | null> {
  const r = await apiStatus<T>(path, revalidate);
  return r.status === 200 ? r.json : null;
}

// Status-aware variant: distinguish "unknown slug" (404 -> notFound())
// from "upstream down" (degraded card). Never throws.
// Backend global prefix is `/api` (see backend/src/main.ts setGlobalPrefix).
// Callers pass `/projects` or `/api/projects` — both resolve to `/api/*`.
export async function apiStatus<T>(path: string, revalidate = 60): Promise<{ status: number; json: T | null }> {
  const suffix = path.startsWith("/api/") ? path : `/api${path.startsWith("/") ? path : `/${path}`}`;
  try {
    const r = await fetch(`${INTERNAL}${suffix}`, { next: { revalidate } });
    if (!r.ok) return { status: r.status, json: null };
    return { status: 200, json: (await r.json()) as T };
  } catch {
    return { status: 0, json: null };
  }
}

// Backend envelopes every route as { data, cached, stale? }.
export type Envelope<T> = { data: T; cached: boolean; stale?: boolean };

export type Project = {
  id: string; slug: string; title: string; tagline: string;
  description: string; tech: string[];
  liveUrl?: string | null; repoUrl?: string | null; imageUrl?: string | null;
  featured: boolean; sort: number;
};

export type Post = {
  id: string; slug: string; title: string; excerpt: string; body: string;
  coverUrl?: string | null; published: boolean; createdAt: string;
};

// Client-side contact POST goes via nginx /api (same origin, no CORS).
export async function postContact(input: { name: string; email: string; subject?: string; body: string }) {
  const r = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!r.ok) throw new Error(`contact failed: ${r.status}`);
  return (await r.json()) as Envelope<{ ok: boolean }>;
}
