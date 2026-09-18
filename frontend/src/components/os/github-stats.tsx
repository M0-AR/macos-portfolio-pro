"use client";
import { useEffect, useState } from "react";
import { Star, GitFork, Users } from "lucide-react";
import { SITE } from "@/lib/site";
import { type GitHubStats } from "@/lib/github";

// Live metrics strip: stars/forks/followers from public GitHub REST API.
// Degraded-hidden on failure or placeholder username — never a blank error.
export function GitHubStatsBar() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  useEffect(() => {
    let live = true;
    // NOTE: /gh-stats (not /api/*) — nginx routes /api/ to NestJS backend.
    fetch(`/gh-stats`).then((r) => (r.ok ? r.json() : null)).then((j) => {
      if (live && j) setStats(j);
    }).catch(() => undefined);
    return () => {
      live = false;
    };
  }, []);
  if (!stats) return null;
  return (
    <div className="mx-auto mt-4 flex w-fit flex-wrap items-center justify-center gap-2 text-xs text-white/70" aria-label="GitHub live metrics">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 backdrop-blur-xl"><Star className="size-3.5 text-amber-300" aria-hidden="true" /> {stats.totalStars} stars</span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 backdrop-blur-xl"><GitFork className="size-3.5" aria-hidden="true" /> {stats.publicRepos} repos</span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 backdrop-blur-xl"><Users className="size-3.5" aria-hidden="true" /> {stats.followers} followers</span>
      <span className="text-white/40">· live from github.com/{SITE.githubUsername}</span>
    </div>
  );
}
