"use client";
import { Search, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { WindowShell } from "@/components/os/window-shell";
import { WindowControls } from "@/components/os/window-controls";
import { useWindowStore } from "@/stores/window-store";
import type { Post } from "@/lib/api";

export function SafariWindow({ posts }: { posts: Post[] }) {
  const openWindow = useWindowStore((s) => s.openWindow);
  return (
    <WindowShell win="safari" title="Safari — Blog">
      <div data-drag-handle className="glass-titlebar flex h-12 cursor-grab items-center gap-2 px-4 active:cursor-grabbing">
        <WindowControls target="safari" />
        <ChevronLeft className="size-4 text-[var(--muted-foreground)]" aria-hidden="true" />
        <ChevronRight className="size-4 text-[var(--muted-foreground)]" aria-hidden="true" />
        <div className="flex h-8 flex-1 items-center gap-2 rounded-lg bg-[var(--muted)] px-3 text-sm text-[var(--muted-foreground)]">
          <Search className="size-3.5" aria-hidden="true" />
          <span className="truncate">my developer blog</span>
        </div>
      </div>
      <div className="h-[calc(100%-3rem)] overflow-auto p-4">
        <h2 className="text-lg font-bold tracking-tight">My developer blog</h2>
        <p className="text-sm text-[var(--muted-foreground)]">Live from <code>/api/posts</code> — cached 5 min, serves all users from one call.</p>
        <ul className="mt-3 space-y-3">
          {posts.map((p) => (
            <li key={p.slug} className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-4 transition hover:border-white/20">
              <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">{new Date(p.createdAt).toLocaleDateString()}</p>
              <h3 className="mt-1 font-semibold leading-snug">{p.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-[var(--muted-foreground)]">{p.excerpt}</p>
              <button onClick={() => openWindow("txt", { kind: "post", post: p })} className="mt-2 inline-flex min-h-[44px] items-center gap-1 text-sm font-medium text-[var(--primary)] hover:underline">
                Read post <ArrowUpRight className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
          {posts.length === 0 && (
            <li className="rounded-xl border p-4 text-sm text-[var(--muted-foreground)]">Posts are warming up — shell renders first, content streams in.</li>
          )}
        </ul>
      </div>
    </WindowShell>
  );
}
