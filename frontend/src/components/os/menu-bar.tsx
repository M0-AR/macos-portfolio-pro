"use client";
import { useEffect, useState } from "react";
import { Search, Wifi, BatteryMedium, LayoutGrid } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useWindowStore } from "@/stores/window-store";
import { WALLPAPERS, useWallpaperStore } from "@/stores/wallpaper-store";

function useClock() {
  // Hydration-safe: server renders placeholder, client hydrates real time.
  // Fixes React #418 text mismatch (server Date !== client Date).
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    // Intentional mount-only sync (hydration guard for clock) — not derived state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(t);
  }, []);
  if (!now) return "—";
  return now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) +
    "  " + now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function MenuBar() {
  const clock = useClock();
  const openWindow = useWindowStore((s) => s.openWindow);
  const setSpotlight = useWindowStore((s) => s.setSpotlight);
  const setLaunchpad = useWindowStore((s) => s.setLaunchpad);
  const wallpaper = useWallpaperStore((s) => s.current);
  return (
    <nav aria-label="System menu" className="fixed inset-x-0 top-0 z-50 flex h-11 items-center justify-between border-b border-white/10 bg-black/40 px-3 shadow-[0_1px_20px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-5">
      <div className="flex min-h-[44px] items-center gap-2">
        <span aria-hidden="true" className="grid size-6 place-items-center rounded-md bg-gradient-to-br from-slate-100 to-slate-400 text-[12px] font-bold text-black shadow">◈</span>
        <span className="text-sm font-semibold tracking-tight text-white drop-shadow">Portfolio OS</span>
        <span className="hidden rounded px-1.5 py-0.5 text-xs font-medium text-white/70 lg:inline">{WALLPAPERS[wallpaper].label}</span>
        <div className="hidden items-center gap-1 md:flex" role="list">
          {(["finder", "safari", "terminal", "contact"] as const).map((k) => (
            <button key={k} role="listitem" onClick={() => openWindow(k)}
              className="rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">
              {k === "finder" ? "Projects" : k === "safari" ? "Blog" : k === "terminal" ? "Skills" : "Contact"}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => setLaunchpad(true)} aria-label="Open Launchpad" title="Launchpad" className="grid size-9 place-items-center rounded-md text-white/80 hover:bg-white/10">
          <LayoutGrid className="size-4" aria-hidden="true" />
        </button>
        <button onClick={() => setSpotlight(true)} aria-label="Spotlight search" title="Spotlight (⌘K)" className="grid size-9 place-items-center rounded-md text-white/80 hover:bg-white/10">
          <Search className="size-4" aria-hidden="true" />
        </button>
        <span className="hidden items-center gap-2 px-1 text-white/70 sm:flex" aria-hidden="true">
          <Wifi className="size-4" />
          <BatteryMedium className="size-5" />
        </span>
        <button onClick={() => openWindow("resume")} className="hidden min-h-[44px] items-center rounded-md px-3 text-sm text-white/90 hover:bg-white/10 sm:inline-flex">
          Résumé
        </button>
        <ThemeToggle />
        <time suppressHydrationWarning className="min-w-[140px] text-right text-[13px] tabular-nums text-white/80">{clock}</time>
      </div>
    </nav>
  );
}
