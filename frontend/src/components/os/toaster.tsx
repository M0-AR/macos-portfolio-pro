"use client";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Toast = { id: number; title: string; body?: string };

type ToastStore = {
  toasts: Toast[];
  push: (title: string, body?: string) => void;
  dismiss: (id: number) => void;
};

let seq = 1;

export const useToastStore = create<ToastStore>()(
  immer((set) => ({
    toasts: [],
    push: (title, body) =>
      set((s) => {
        const id = seq++;
        s.toasts.push({ id, title, body });
        setTimeout(() => {
          useToastStore.getState().dismiss(id);
        }, 4200);
      }),
    dismiss: (id) =>
      set((s) => {
        s.toasts = s.toasts.filter((t) => t.id !== id);
      }),
  }))
);

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  return (
    <div className="pointer-events-none fixed right-4 top-14 z-[250] flex w-[min(360px,90vw)] flex-col gap-2" role="status" aria-live="polite">
      {toasts.map((t) => (
        <button key={t.id} onClick={() => dismiss(t.id)} className="glass-dock pointer-events-auto rounded-2xl p-3.5 text-left text-white">
          <span className="block text-sm font-semibold">{t.title}</span>
          {t.body && <span className="mt-0.5 block text-[13px] text-white/70">{t.body}</span>}
        </button>
      ))}
    </div>
  );
}
