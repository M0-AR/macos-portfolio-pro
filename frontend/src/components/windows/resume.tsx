"use client";
import { Download } from "lucide-react";
import { WindowShell } from "@/components/os/window-shell";
import { WindowControls } from "@/components/os/window-controls";

export function ResumeWindow() {
  return (
    <WindowShell win="resume" title="Résumé">
      <div data-drag-handle className="glass-titlebar flex h-12 cursor-grab items-center gap-3 px-4 active:cursor-grabbing">
        <WindowControls target="resume" />
        <h2 className="text-sm font-semibold">resume.pdf</h2>
        <a href="/resume.pdf" download title="Download résumé"
          className="ml-auto inline-flex min-h-[44px] items-center gap-1 rounded-lg border px-3 text-sm hover:bg-[var(--muted)]">
          <Download className="size-4" aria-hidden="true" /> Download
        </a>
      </div>
      <div className="h-[calc(100%-2.75rem)] overflow-auto p-5">
        <h3 className="text-xl font-bold">Mohamad Al-Ashmar — Senior AI Engineer</h3>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Next.js · React · Design systems · Motion. 8+ yrs shipping sellable UIs.</p>
        <ul className="mt-4 space-y-3 text-sm">
          <li><b>2023—now · Staff Frontend, SaaS</b> — owned Next.js 16 + Tailwind v4 design system; LCP 1.4s, Lighthouse 98.</li>
          <li><b>2020—2023 · Frontend, Commerce</b> — ISR catalog, server-action cart; +12% conversion from image + font fixes.</li>
          <li><b>2018—2020 · UI Engineer</b> — shadcn-based component library adopted by 4 teams.</li>
        </ul>
        <p className="mt-4 text-sm text-[var(--muted-foreground)]">Full PDF ships at <code>/resume.pdf</code> — drop your file in <code>frontend/public</code>.</p>
      </div>
    </WindowShell>
  );
}
