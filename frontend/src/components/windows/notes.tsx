"use client";
import { useEffect, useRef, useState } from "react";
import { Mail, Trash2 } from "lucide-react";
import { WindowShell } from "@/components/os/window-shell";
import { WindowControls } from "@/components/os/window-controls";
import { SITE } from "@/lib/site";
import { countWords } from "@/lib/calc";

const KEY = "portfolio-notes-v1";
const STARTER = "Ideas\n— Ship Portfolio OS v1\n— Add 3 case studies with metrics\n— Refresh resume PDF\n";

// Verified pattern (macOS portfolios 2026): editable notepad persisted to
// localStorage, Save opens a mailto so the note leaves the machine.
export function NotesWindow() {
  // Hydration-safe persisted notepad: lazy initializer reads storage once
  // (no mount effect), saves happen in the change handler — never setState in effect.
  const [text, setText] = useState(() => {
    if (typeof window === "undefined") return STARTER;
    try {
      return window.localStorage.getItem(KEY) ?? STARTER;
    } catch {
      return STARTER;
    }
  });
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
  }, []);
  const onChange = (v: string) => {
    setText(v);
    try {
      window.localStorage.setItem(KEY, v);
    } catch {
      /* private mode */
    }
    setSaved(true);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaved(false), 1200);
  };
  const words = countWords(text);
  return (
    <WindowShell win="notes" title="Notes">
      <div data-drag-handle className="glass-titlebar flex h-12 cursor-grab items-center gap-3 px-4 active:cursor-grabbing">
        <WindowControls target="notes" />
        <h2 className="text-sm font-semibold">Notes</h2>
        <span className="ml-auto text-xs text-[var(--muted-foreground)]">{words} words{saved ? " · saved" : ""}</span>
        <a
          href={`mailto:${SITE.email}?subject=${encodeURIComponent("Note from Portfolio OS")}&body=${encodeURIComponent(text.slice(0, 1500))}`}
          className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border px-3 text-xs font-medium hover:bg-[var(--muted)]"
        >
          <Mail className="size-3.5" aria-hidden="true" /> Email note
        </a>
        <button onClick={() => setText("")} aria-label="Clear note" className="grid size-9 place-items-center rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)]">
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="h-[calc(100%-3rem)] bg-[#fdf6e3] dark:bg-[#1c1a15]">
        <textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Notes editor"
          spellCheck={false}
          className="h-full w-full resize-none bg-transparent p-5 font-mono text-sm leading-relaxed text-slate-800 outline-none dark:text-amber-100"
        />
      </div>
    </WindowShell>
  );
}
