// Pure OS logic — unit-tested below, imported by Terminal + Spotlight.
// Keeping parsing/filtering here (not inline in components) guarantees
// tests assert the real behavior users get. Zero dependencies.

export type TerminalAction =
  | { kind: "print"; text: string; tone: "out" | "err" }
  | { kind: "open"; app: string }
  | { kind: "clear" };

export const TERMINAL_APPS = ["finder", "safari", "photos", "terminal", "contact", "resume", "notes", "calc", "vscode"] as const;

export const TERMINAL_HELP =
  "commands: help · whoami · skills · projects · github · open <finder|safari|photos|terminal|contact|resume|notes|calc|vscode> · date · clear";

export function parseTerminalCommand(raw: string): TerminalAction[] {
  const cmd = raw.trim();
  if (!cmd) return [];
  const [base, ...rest] = cmd.split(/\s+/);
  const arg = rest.join(" ").toLowerCase();
  switch (base.toLowerCase()) {
    case "help":
      return [{ kind: "print", text: TERMINAL_HELP, tone: "out" }];
    case "whoami":
      return [{ kind: "print", text: "Mohamad Al-Ashmar — Senior AI Engineer · Next.js · 8+ yrs shipping sellable UIs.", tone: "out" }];
    case "skills":
      return [{ kind: "print", text: "Frontend: Next.js 16, React 19 · Backend: NestJS 11, Postgres · Infra: Docker, nginx", tone: "out" }];
    case "projects":
      return [{ kind: "print", text: "nike-store · food-delivery · resume-ai — open Finder or type `open finder`.", tone: "out" }];
    case "github":
      return [{ kind: "print", text: "live GitHub stats load in Finder + `open vscode` shows contact.ts — set NEXT_PUBLIC_GITHUB_USERNAME.", tone: "out" }];
    case "open":
      if ((TERMINAL_APPS as readonly string[]).includes(arg)) return [{ kind: "open", app: arg }];
      return [{ kind: "print", text: `unknown app: ${arg || "(empty)"} — try open finder`, tone: "err" }];
    case "date":
      return [{ kind: "print", text: "DATE_NOW", tone: "out" }];
    case "clear":
      return [{ kind: "clear" }];
    default:
      return [{ kind: "print", text: `command not found: ${base} — type help`, tone: "err" }];
  }
}

export type SearchItem = { key: string; label: string; hint: string; kind: "app" | "project" | "post"; slug?: string };

export function filterSpotlight(
  q: string,
  apps: SearchItem[],
  projects: { title: string; tagline: string; tech: string[]; slug: string }[],
  posts: { title: string; excerpt: string }[]
): SearchItem[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return apps;
  const appHits = apps.filter((a) => a.label.toLowerCase().includes(needle));
  const projHits: SearchItem[] = projects
    .filter((p) => `${p.title} ${p.tagline} ${p.tech.join(" ")}`.toLowerCase().includes(needle))
    .slice(0, 4)
    .map((p) => ({ key: "finder", label: p.title, hint: p.tagline, kind: "project" as const, slug: p.slug }));
  const postHits: SearchItem[] = posts
    .filter((p) => `${p.title} ${p.excerpt}`.toLowerCase().includes(needle))
    .slice(0, 3)
    .map((p) => ({ key: "safari", label: p.title, hint: p.excerpt.slice(0, 60), kind: "post" as const }));
  return [...appHits, ...projHits, ...postHits].slice(0, 9);
}
