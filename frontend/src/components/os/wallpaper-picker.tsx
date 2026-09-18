"use client";
import { WALLPAPERS, useWallpaperStore, type WallpaperId } from "@/stores/wallpaper-store";
import { cn } from "@/lib/utils";

const ORDER: WallpaperId[] = ["sequoia", "aurora", "sunset", "midnight"];

export function WallpaperPicker() {
  const current = useWallpaperStore((s) => s.current);
  const setWallpaper = useWallpaperStore((s) => s.setWallpaper);
  return (
    <div className="mx-auto mt-2 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-2 backdrop-blur-xl" role="group" aria-label="Wallpaper picker">
      <span className="hidden text-xs text-white/60 sm:inline">Wallpaper</span>
      {ORDER.map((id) => (
        <button
          key={id}
          onClick={() => setWallpaper(id)}
          title={WALLPAPERS[id].label}
          aria-label={`Wallpaper ${WALLPAPERS[id].label}`}
          aria-pressed={current === id}
          className={cn(
            "size-7 rounded-full border transition hover:scale-110 active:scale-95",
            current === id ? "border-white ring-2 ring-white/60" : "border-white/20",
            id === "sequoia" && "bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-700",
            id === "aurora" && "bg-gradient-to-br from-emerald-400 via-sky-500 to-violet-600",
            id === "sunset" && "bg-gradient-to-br from-amber-400 via-rose-500 to-indigo-700",
            id === "midnight" && "bg-gradient-to-br from-slate-700 via-slate-900 to-black"
          )}
        />
      ))}
    </div>
  );
}
