"use client";
import { Suspense } from "react";
import { Folder, FileText, ExternalLink } from "lucide-react";
import { WindowShell } from "@/components/os/window-shell";
import { WindowControls } from "@/components/os/window-controls";
import { LOCATIONS, useLocationStore, type Loc } from "@/stores/location-store";
import { useWindowStore } from "@/stores/window-store";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/api";

function SidebarList({ title, items }: { title: string; items: Loc[] }) {
  const active = useLocationStore((s) => s.active);
  const setActive = useLocationStore((s) => s.setActive);
  return (
    <div>
      <h3 className="px-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">{title}</h3>
      <ul className="mt-1 space-y-0.5">
        {items.map((item) => (
          <li key={item.id}>
            <button onClick={() => setActive(item)}
              className={cn("flex min-h-[44px] w-full items-center gap-2 rounded-lg px-2 text-left text-sm hover:bg-[var(--muted)]",
                item.id === active.id && "bg-[var(--muted)] font-medium")}>
              <Folder className="size-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{item.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FinderWindow({ projects }: { projects: Project[] }) {
  const active = useLocationStore((s) => s.active);
  const setActive = useLocationStore((s) => s.setActive);
  const openWindow = useWindowStore((s) => s.openWindow);
  const favs = Object.values(LOCATIONS);

  const openProject = (slug: string) => {
    const p = projects.find((x) => x.slug === slug);
    if (p) openWindow("txt", { kind: "project", project: p });
  };

  return (
    <WindowShell win="finder" title="Finder — Projects">
      <div data-drag-handle className="glass-titlebar flex h-12 cursor-grab items-center gap-3 px-4 active:cursor-grabbing">
        <WindowControls target="finder" />
        <h2 className="text-sm font-semibold">Finder</h2>
        <span className="ml-auto hidden rounded-md bg-black/10 px-2 py-0.5 text-xs text-[var(--muted-foreground)] sm:inline">{projects.length} items</span>
      </div>
      <div className="flex h-[calc(100%-3rem)] flex-col sm:flex-row">
        <aside className="flex gap-4 overflow-x-auto border-b p-3 sm:w-52 sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-r">
          <SidebarList title="Favorites" items={favs} />
          <SidebarList title="Work" items={active.id === "work" && active.children?.length ? active.children : (LOCATIONS.work.children ?? [])} />
        </aside>
        <div className="flex-1 overflow-auto p-4">
          <p className="text-xs text-[var(--muted-foreground)]">{active.name} — {active.id === "work" ? `${projects.length} projects (live from API)` : "browse"}</p>
          {active.id === "work" ? (
            <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {projects.map((p) => (
                <li key={p.slug}>
                  <button onClick={() => openProject(p.slug)}
                    className="group flex min-h-[44px] w-full flex-col items-start gap-1.5 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-3.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-white/20 hover:shadow-lg">
                    <Folder className="size-7 text-sky-400 drop-shadow transition group-hover:scale-110" aria-hidden="true" />
                    <span className="text-sm font-semibold leading-tight">{p.title}</span>
                    <span className="line-clamp-2 text-xs text-[var(--muted-foreground)]">{p.tagline}</span>
                    <span className="mt-1 flex flex-wrap gap-1">{p.tech.slice(0, 2).map((t) => (<span key={t} className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px]">{t}</span>))}</span>
                  </button>
                </li>
              ))}
              {projects.length === 0 && (
                <li className="col-span-full rounded-2xl border border-dashed p-5 text-center text-sm text-[var(--muted-foreground)]">
                  Projects are loading from the live API… never a blank page.
                </li>
              )}
            </ul>
          ) : (
            <div className="mt-3 rounded-xl border p-4 text-sm">
              <p className="font-medium">{active.name}</p>
              <p className="mt-1 text-[var(--muted-foreground)]">Select Work to browse live projects, or open Resume / Contact from the Dock.</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => setActive(LOCATIONS.work)} className="inline-flex min-h-[44px] items-center rounded-lg border px-4 text-sm hover:bg-[var(--muted)]">Go to Work</button>
                <button onClick={() => openWindow("resume")} className="inline-flex min-h-[44px] items-center gap-1 rounded-lg border px-4 text-sm hover:bg-[var(--muted)]">
                  <FileText className="size-4" aria-hidden="true" /> Resume
                </button>
              </div>
            </div>
          )}
          <p className="mt-4 text-xs text-[var(--muted-foreground)]">
            Tip: project links open in a new tab with <code>rel=&quot;noopener&quot;</code>. <a className="underline" href="/api/docs" target="_blank" rel="noopener noreferrer">API docs</a>
            <ExternalLink className="ml-1 inline size-3" aria-hidden="true" />
          </p>
        </div>
      </div>
    </WindowShell>
  );
}

export function FinderFallback() {
  return (
    <WindowShell win="finder" title="Finder — Projects">
      <div className="p-4" aria-busy="true"><div className="skeleton h-5 w-40" /><div className="skeleton mt-3 h-24 w-full" /></div>
    </WindowShell>
  );
}

// Unused import guard for Suspense re-export pattern
export { Suspense };
