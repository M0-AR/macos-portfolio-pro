"use client";
import { useEffect, useState } from "react";

export function BootScreen() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setVisible(false), reduced ? 100 : 1100);
    return () => clearTimeout(t);
  }, []);
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-[300] grid place-items-center bg-black" aria-label="Loading Portfolio OS">
      <div className="flex flex-col items-center gap-6">
        <span className="text-5xl text-white">◈</span>
        <div className="h-1.5 w-44 overflow-hidden rounded-full bg-white/15">
          <div className="h-full w-1/2 animate-[bootbar_1s_ease-in-out_infinite] rounded-full bg-white/90" />
        </div>
        <style>{`@keyframes bootbar{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}`}</style>
      </div>
    </div>
  );
}
