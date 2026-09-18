"use client";
import { useState } from "react";
import { FileText, FolderOpen, X } from "lucide-react";
import { WindowShell } from "@/components/os/window-shell";
import { WindowControls } from "@/components/os/window-controls";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

// Verified pattern (VSCode portfolios 2026): activity bar + explorer with
// expandable folders + editor tabs + lightweight code view + live status bar.
// Content lives here as typed data — edit strings, UI follows.
const FILES: { path: string; lang: string; body: string }[] = [
  {
    path: "about.ts",
    lang: "ts",
    body: `export const engineer = {\n  name: "${SITE.name}",\n  role: "${SITE.role}",\n  location: "${SITE.location}",\n  focus: ["Next.js 16", "React 19", "Design systems"],\n};`,
  },
  {
    path: "skills.json",
    lang: "json",
    body: `{\n  "frontend": ["Next.js 16", "React 19", "TypeScript", "Tailwind v4"],\n  "state": ["Zustand", "Immer"],\n  "backend": ["NestJS 11", "Prisma", "Postgres 16", "Redis 7", "BullMQ"],\n  "infra": ["Docker Compose", "nginx"]\n}`,
  },
  {
    path: "contact.ts",
    lang: "ts",
    body: `export const contact = {\n  email: "${SITE.email}",\n  github: "${SITE.github}",\n  linkedin: "${SITE.linkedin}",\n};\n// Use the Contact app (Dock) — persist + queue, 200 now.`,
  },
];

export function VSCodeWindow() {
  const [open, setOpen] = useState<string[]>(["about.ts"]);
  const [active, setActive] = useState("about.ts");
  const file = FILES.find((f) => f.path === active) ?? FILES[0];
  const time = new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return (
    <WindowShell win="vscode" title="VS Code">
      <div data-drag-handle className="flex h-12 cursor-grab items-center gap-3 border-b border-white/10 bg-[#1e1e28] px-4 active:cursor-grabbing">
        <WindowControls target="vscode" />
        <h2 className="text-sm font-medium text-white/90">portfolio — Visual Studio Code</h2>
      </div>
      <div className="flex h-[calc(100%-3rem)] bg-[#14141b] text-[13px]">
        <aside className="hidden w-52 shrink-0 flex-col border-r border-white/10 sm:flex">
          <p className="flex items-center gap-1.5 px-3 py-2 text-[11px] uppercase tracking-wider text-white/40"><FolderOpen className="size-3.5" aria-hidden="true" /> Explorer</p>
          {FILES.map((f) => (
            <button
              key={f.path}
              onClick={() => {
                setOpen((o) => (o.includes(f.path) ? o : [...o, f.path]));
                setActive(f.path);
              }}
              className={cn("flex items-center gap-2 px-4 py-2 text-left text-white/70 hover:bg-white/5", active === f.path && "bg-white/10 text-white")}
            >
              <FileText className="size-4 shrink-0 text-sky-400" aria-hidden="true" />
              <span className="truncate font-mono">{f.path}</span>
            </button>
          ))}
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex overflow-x-auto border-b border-white/10" role="tablist" aria-label="Open files">
            {open.map((p) => (
              <div key={p} role="tab" aria-selected={p === active} className={cn("flex items-center gap-2 border-r border-white/10 px-3 py-2", p === active ? "bg-[#1e1e28] text-white" : "text-white/50")}>
                <button onClick={() => setActive(p)} className="min-h-[32px] font-mono text-xs">{p}</button>
                <button
                  onClick={() => setOpen((o) => {
                    const next = o.filter((x) => x !== p);
                    if (active === p && next.length) setActive(next[0]);
                    return next.length ? next : [FILES[0].path];
                  })}
                  aria-label={`Close ${p}`}
                  className="rounded p-0.5 hover:bg-white/10"
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
          <pre className="flex-1 overflow-auto p-4 font-mono text-[12.5px] leading-relaxed text-slate-200" aria-label={`${file.path} code`}>
            <code>{file.body}</code>
          </pre>
          <div className="flex items-center justify-between border-t border-white/10 bg-[#0e62ad] px-3 py-1 font-mono text-[11px] text-white">
            <span>⎇ main · portfolio-os</span>
            <span>TypeScript · UTF-8 · {time}</span>
          </div>
        </div>
      </div>
    </WindowShell>
  );
}
