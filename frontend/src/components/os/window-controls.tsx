"use client";
import { useWindowStore, type WindowKey } from "@/stores/window-store";

export function WindowControls({ target }: { target: WindowKey }) {
  const closeWindow = useWindowStore((s) => s.closeWindow);
  return (
    <div id="window-controls" className="flex items-center gap-2" role="group" aria-label="Window controls">
      <button aria-label={`Close ${target} window`} onClick={() => closeWindow(target)}
        className="grid size-3 place-items-center rounded-full bg-[#ff5f57] ring-1 ring-black/20 hover:brightness-90" />
      <span aria-hidden="true" className="size-3 rounded-full bg-[#febc2e] ring-1 ring-black/20" />
      <span aria-hidden="true" className="size-3 rounded-full bg-[#28c840] ring-1 ring-black/20" />
    </div>
  );
}
