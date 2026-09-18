"use client";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useWindowStore, type WindowKey } from "@/stores/window-store";
import { filterSpotlight, type SearchItem } from "@/lib/os-logic";
import type { Project, Post } from "@/lib/api";

const APPS: { key: string; label: string; hint: string; kind: "app" }[] = [
  { key: "finder", label: "Projects — Finder", hint: "Browse live projects", kind: "app" },
  { key: "safari", label: "Blog — Safari", hint: "Read writing", kind: "app" },
  { key: "photos", label: "Gallery — Photos", hint: "Project cards", kind: "app" },
  { key: "terminal", label: "Skills — Terminal", hint: "Tech stack", kind: "app" },
  { key: "contact", label: "Contact", hint: "Send a message", kind: "app" },
  { key: "resume", label: "Résumé", hint: "View + download PDF", kind: "app" },
  { key: "notes", label: "Notes", hint: "Editable notepad", kind: "app" },
  { key: "calc", label: "Calculator", hint: "Basic + scientific", kind: "app" },
  { key: "vscode", label: "Code — VS Code", hint: "File explorer + code", kind: "app" },
];

export function Spotlight({ projects, posts }: { projects: Project[]; posts: Post[] }) {
  const open = useWindowStore((s) => s.spotlightOpen);
  const setSpotlight = useWindowStore((s) => s.setSpotlight);
  const openWindow = useWindowStore((s) => s.openWindow);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const next = !useWindowStore.getState().spotlightOpen;
        if (next) setQ("");
        setSpotlight(next);
      }
      if (e.key === "Escape") setSpotlight(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSpotlight]);

  const results: SearchItem[] = useMemo(
    () => filterSpotlight(q, APPS, projects, posts),
    [q, projects, posts]
  );

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center bg-black/40 px-4 pt-[14vh] backdrop-blur-sm" onClick={() => setSpotlight(false)} role="dialog" aria-label="Spotlight search">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/15 bg-[#1e1e22]/90 shadow-2xl backdrop-blur-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-white/10 px-4">
          <Search className="size-5 text-white/50" aria-hidden="true" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Spotlight — apps, projects, posts… (Esc to close)"
            className="h-14 w-full bg-transparent text-[17px] text-white placeholder:text-white/40 focus:outline-none"
            aria-label="Spotlight search"
          />
          <kbd className="rounded-md border border-white/15 bg-white/10 px-1.5 py-0.5 text-xs text-white/60">⌘K</kbd>
        </div>
        <ul className="max-h-[40vh] overflow-auto p-2">
          {results.map((r, i) => (
            <li key={`${r.label}-${i}`}>
              <button
                onClick={() => {
                  if (r.kind === "project" && "slug" in r) {
                    const p = projects.find((x) => x.slug === (r as { slug: string }).slug);
                    openWindow("txt", { kind: "project", project: p });
                  } else {
                    openWindow(r.key as WindowKey);
                  }
                  setSpotlight(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-white/10"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/10 text-sm">◈</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-white">{r.label}</span>
                  <span className="block truncate text-xs text-white/50">{r.hint}</span>
                </span>
                <span className="ml-auto text-[10px] uppercase tracking-wider text-white/30">{r.kind}</span>
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="p-4 text-center text-sm text-white/50">No match — try project, blog, skills…</li>}
        </ul>
      </div>
    </div>
  );
}
