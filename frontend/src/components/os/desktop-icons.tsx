"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { Folder } from "lucide-react";
import { LOCATIONS, useLocationStore } from "@/stores/location-store";
import { useWindowStore } from "@/stores/window-store";

gsap.registerPlugin(Draggable);

// Desktop shortcuts (fine pointers only draggable). Tap/keyboard opens Finder at that location.
export function DesktopIcons() {
  const ref = useRef<HTMLUListElement>(null);
  const openWindow = useWindowStore((s) => s.openWindow);
  const setActive = useLocationStore((s) => s.setActive);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const instances = Draggable.create(".desktop-folder");
    return () => {
      instances.forEach((i) => i.kill());
    };
  }, []);

  const items = [LOCATIONS.work, LOCATIONS.about, LOCATIONS.resume];
  return (
    <ul ref={ref} className="pointer-events-none fixed right-3 top-14 z-10 hidden flex-col gap-4 md:flex" aria-label="Desktop shortcuts">
      {items.map((loc) => (
        <li key={loc.id}>
          <button onClick={() => { setActive(loc); openWindow("finder"); }}
            className="desktop-folder pointer-events-auto flex min-h-[44px] min-w-[88px] flex-col items-center gap-1 rounded-xl p-2 hover:bg-white/10">
            <Folder className="size-10 text-sky-300" aria-hidden="true" />
            <span className="max-w-[96px] truncate rounded bg-black/30 px-1.5 text-xs text-white">{loc.name}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
