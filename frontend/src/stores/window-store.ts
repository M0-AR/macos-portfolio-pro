"use client";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type WindowKey = "finder" | "safari" | "terminal" | "resume" | "contact" | "photos" | "txt" | "image" | "notes" | "calc" | "vscode";

type WinState = { isOpen: boolean; z: number; data?: unknown };
type WindowStore = {
  windows: Record<WindowKey, WinState>;
  nextZ: number;
  openWindow: (key: WindowKey, data?: unknown) => void;
  closeWindow: (key: WindowKey) => void;
  focusWindow: (key: WindowKey) => void;
  spotlightOpen: boolean;
  setSpotlight: (open: boolean) => void;
  launchpadOpen: boolean;
  setLaunchpad: (open: boolean) => void;
};

const BASE_Z = 1000;

const initial = (): Record<WindowKey, WinState> => ({
  finder: { isOpen: false, z: BASE_Z },
  safari: { isOpen: false, z: BASE_Z },
  terminal: { isOpen: false, z: BASE_Z },
  resume: { isOpen: false, z: BASE_Z },
  contact: { isOpen: false, z: BASE_Z },
  photos: { isOpen: false, z: BASE_Z },
  txt: { isOpen: false, z: BASE_Z },
  image: { isOpen: false, z: BASE_Z },
  notes: { isOpen: false, z: BASE_Z },
  calc: { isOpen: false, z: BASE_Z },
  vscode: { isOpen: false, z: BASE_Z },
});

// Client-only UI state (windows open/focus). Server data (projects/posts)
// stays in RSC fetch / TanStack Query — never mix the two.
export const useWindowStore = create<WindowStore>()(
  immer((set) => ({
    windows: initial(),
    nextZ: BASE_Z + 1,
    spotlightOpen: false,
    launchpadOpen: false,
    setSpotlight: (open) =>
      set((s) => {
        s.spotlightOpen = open;
      }),
    setLaunchpad: (open) =>
      set((s) => {
        s.launchpadOpen = open;
      }),
    openWindow: (key, data) =>
      set((s) => {
        const w = s.windows[key];
        if (!w) return;
        w.isOpen = true;
        w.z = s.nextZ;
        if (data !== undefined) w.data = data;
        s.nextZ += 1;
      }),
    closeWindow: (key) =>
      set((s) => {
        const w = s.windows[key];
        if (!w) return;
        w.isOpen = false;
        w.z = BASE_Z;
        w.data = undefined;
      }),
    focusWindow: (key) =>
      set((s) => {
        const w = s.windows[key];
        if (!w || !w.isOpen) return;
        w.z = s.nextZ;
        s.nextZ += 1;
      }),
  }))
);
