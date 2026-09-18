"use client";
import { useEffect, useRef, useState } from "react";
import { WindowShell } from "@/components/os/window-shell";
import { WindowControls } from "@/components/os/window-controls";
import { useWindowStore } from "@/stores/window-store";
import { parseTerminalCommand } from "@/lib/os-logic";

const STACK: { category: string; items: string[] }[] = [
  { category: "Frontend", items: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4"] },
  { category: "State", items: ["Zustand", "Immer", "TanStack Query"] },
  { category: "Motion", items: ["Motion", "GSAP", "tw-animate-css"] },
  { category: "Backend", items: ["NestJS 11", "Prisma", "PostgreSQL 16", "Redis 7", "BullMQ"] },
  { category: "Infra", items: ["Docker Compose", "nginx", "GitHub Actions"] },
];

type Line = { text: string; tone: "cmd" | "out" | "err" };

export function TerminalWindow() {
  const openWindow = useWindowStore((s) => s.openWindow);
  const [lines, setLines] = useState<Line[]>([
    { text: "Portfolio OS shell — type `help` to start.", tone: "out" },
    { text: "show tech-stack", tone: "cmd" },
    ...STACK.flatMap((s) => [{ text: `${s.category}: ${s.items.join(", ")}`, tone: "out" as const }]),
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    setHistory((h) => [cmd, ...h].slice(0, 50));
    setHIdx(-1);
    // Single source of truth lives in lib/os-logic.ts — unit-tested, same behavior here.
    const actions = parseTerminalCommand(cmd);
    if (actions.some((a) => a.kind === "clear")) {
      setLines([]);
      setValue("");
      return;
    }
    const out: Line[] = [{ text: cmd, tone: "cmd" }];
    for (const a of actions) {
      if (a.kind === "open") {
        openWindow(a.app as Parameters<typeof openWindow>[0]);
        out.push({ text: `opening ${a.app}…`, tone: "out" });
      } else if (a.kind === "print") {
        out.push({ text: a.text === "DATE_NOW" ? new Date().toString() : a.text, tone: a.tone });
      }
    }
    // Rich skills expansion stays in UI (parser returns summary line already).
    if (cmd.toLowerCase() === "skills") {
      for (const s of STACK) out.push({ text: `${s.category}: ${s.items.join(", ")}`, tone: "out" });
    }
    setLines((l) => [...l, ...out]);
    setValue("");
  };

  return (
    <WindowShell win="terminal" title="Terminal — Skills">
      <div data-drag-handle className="glass-titlebar flex h-12 cursor-grab items-center gap-3 px-4 active:cursor-grabbing">
        <WindowControls target="terminal" />
        <h2 className="font-mono text-sm">mohamad@portfolio: ~/stack</h2>
      </div>
      <div ref={scrollRef} className="h-[calc(100%-3rem)] overflow-auto bg-black/95 p-4 font-mono text-[13px] leading-relaxed" onClick={(e) => (e.currentTarget.querySelector("input") as HTMLInputElement | null)?.focus()}>
        {lines.map((l, i) => (
          <p key={i} className={l.tone === "cmd" ? "text-white" : l.tone === "err" ? "text-red-400" : "text-green-300"}>
            {l.tone === "cmd" ? (
              <><span className="font-bold text-white">mohamad@portfolio</span> % {l.text}</>
            ) : l.text}
          </p>
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(value);
          }}
          className="mt-1 flex items-center gap-2 text-white"
        >
          <span className="font-bold">mohamad@portfolio</span><span>%</span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") {
                e.preventDefault();
                const next = Math.min(hIdx + 1, history.length - 1);
                if (history[next]) {
                  setHIdx(next);
                  setValue(history[next]);
                }
              }
              if (e.key === "ArrowDown") {
                e.preventDefault();
                const next = hIdx - 1;
                setHIdx(Math.max(next, -1));
                setValue(next >= 0 ? history[next] ?? "" : "");
              }
            }}
            aria-label="Terminal input"
            className="w-full bg-transparent text-white caret-green-400 focus:outline-none"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>
    </WindowShell>
  );
}
