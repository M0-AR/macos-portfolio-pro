"use client";
import { useEffect } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type WallpaperId = "sequoia" | "aurora" | "sunset" | "midnight";

export const WALLPAPERS: Record<WallpaperId, { label: string; css: string }> = {
  sequoia: { label: "Sequoia", css: "wallpaper-sequoia" },
  aurora: { label: "Aurora", css: "wallpaper-aurora" },
  sunset: { label: "Sunset", css: "wallpaper-sunset" },
  midnight: { label: "Midnight", css: "wallpaper-midnight" },
};

type WallpaperStore = {
  current: WallpaperId;
  setWallpaper: (id: WallpaperId) => void;
};

function readStoredWallpaper(): WallpaperId {
  if (typeof window === "undefined") return "sequoia";
  try {
    const saved = window.localStorage.getItem("portfolio-wallpaper") as WallpaperId | null;
    return saved && saved in WALLPAPERS ? saved : "sequoia";
  } catch {
    return "sequoia";
  }
}

export const useWallpaperStore = create<WallpaperStore>()(
  immer((set) => ({
    // Hydration-safe: server + first client render agree on sequoia.
    // Stored value syncs on mount (see useWallpaperSync) — no #418 mismatch.
    current: "sequoia" as WallpaperId,
    setWallpaper: (id) =>
      set((s) => {
        s.current = id;
        try {
          window.localStorage.setItem("portfolio-wallpaper", id);
        } catch {
          /* private mode */
        }
      }),
  }))
);

// Call once in Desktop: picks up persisted wallpaper after hydration.
export function useWallpaperSync() {
  const setWallpaper = useWallpaperStore((s) => s.setWallpaper);
  useEffect(() => {
    const stored = readStoredWallpaper();
    if (stored !== useWallpaperStore.getState().current) setWallpaper(stored);
  }, [setWallpaper]);
}
