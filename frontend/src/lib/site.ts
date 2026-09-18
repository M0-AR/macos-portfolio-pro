// Single source of truth for identity + links.
// Selling = edit THIS file (or set env), nothing else in the codebase.
// Verified 2026 portfolio pattern: centralized seo/social config.
export const SITE = {
  name: "Mohamad Al-Ashmar",
  fullName: "Mohamad Al-Ashmar — Senior AI Engineer",
  role: "Senior AI Engineer",
  tagline: "Next.js · React · Design systems · Motion. 8+ yrs shipping sellable UIs.",
  location: "Remote · EU timezones",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@example.com",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-os.local").replace(/\/$/, ""),
  githubUsername: process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "example",
  github: process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/example",
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "https://linkedin.com/in/example",
  x: process.env.NEXT_PUBLIC_X_URL ?? "https://x.com/example",
  website: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  description:
    "Interactive MacOS-style portfolio: live projects, writing, skills terminal, résumé, contact queue. Next.js 16 + NestJS, responsive on web and mobile.",
} as const;

export const SOCIAL_LINKS = [
  { id: "github", label: "GitHub", href: SITE.github },
  { id: "x", label: "X / Twitter", href: SITE.x },
  { id: "linkedin", label: "LinkedIn", href: SITE.linkedin },
  { id: "site", label: "Website", href: SITE.website },
] as const;
