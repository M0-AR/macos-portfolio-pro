"use client";
import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useWindowStore, type WindowKey } from "@/stores/window-store";

gsap.registerPlugin(Draggable);

// Reusable window frame: focus-on-press, drag on desktop, bottom-sheet on mobile,
// open animation (transform+opacity only), cleanup via gsap.context.
export function WindowShell({ win, title, children }: { win: WindowKey; title: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const isOpen = useWindowStore((s) => s.windows[win].isOpen);
  const z = useWindowStore((s) => s.windows[win].z);
  const focusWindow = useWindowStore((s) => s.focusWindow);

  // Show/hide + open animation. useLayoutEffect-equivalent timing via gsap.context.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!isOpen) {
      el.style.display = "none";
      return;
    }
    el.style.display = "block";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.set(el, { opacity: 1, scale: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { opacity: 0, scale: 0.96, y: 16 }, { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "power3.out" });
    }, el);
    return () => ctx.revert();
  }, [isOpen]);

  // Draggable on fine pointers only (desktop). Mobile stays a fixed sheet.
  useEffect(() => {
    const el = ref.current;
    if (!el || !isOpen) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const instances = Draggable.create(el, {
      trigger: el.querySelector("[data-drag-handle]"),
      onPress: () => focusWindow(win),
    });
    return () => {
      instances.forEach((i) => i.kill());
    };
  }, [isOpen, win, focusWindow]);

  if (!isOpen) return null;

  return (
    <section ref={ref} role="dialog" aria-label={title} aria-modal="false"
      onPointerDown={() => focusWindow(win)}
      style={{ zIndex: z }}
      className="os-window fixed inset-x-3 bottom-24 top-14 overflow-hidden rounded-2xl border border-white/15 bg-[var(--card)]/90 shadow-2xl backdrop-blur-2xl md:inset-x-auto md:bottom-auto md:left-[12%] md:top-[13%] md:h-[64vh] md:w-[min(760px,82vw)]">
      {children}
    </section>
  );
}
