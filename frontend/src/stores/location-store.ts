"use client";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type LocationKind = "folder" | "project" | "file";

export type Loc = {
  id: string;
  name: string;
  kind: LocationKind;
  icon?: string;
  slug?: string;
  children?: Loc[];
};

const WORK: Loc = {
  id: "work", name: "Work", kind: "folder",
  children: [
    { id: "p-nike", name: "Nike Store", kind: "project", slug: "nike-store" },
    { id: "p-food", name: "Food Delivery", kind: "project", slug: "food-delivery" },
    { id: "p-resume-ai", name: "Resume AI", kind: "project", slug: "resume-ai" },
  ],
};

const DEFAULT_LOC: Loc = WORK;

type LocationStore = {
  active: Loc;
  setActive: (loc: Loc | undefined) => void;
  reset: () => void;
};

// Navigation state persists across window open/close (separate from window lifecycle).
// Guard: calling without an argument is a no-op (never null the active location).
export const useLocationStore = create<LocationStore>()(
  immer((set) => ({
    active: DEFAULT_LOC,
    setActive: (loc) =>
      set((s) => {
        if (loc === undefined) return;
        s.active = loc;
      }),
    reset: () =>
      set((s) => {
        s.active = DEFAULT_LOC;
      }),
  }))
);

export const LOCATIONS: Record<string, Loc> = {
  work: WORK,
  about: { id: "about", name: "About Me", kind: "folder", children: [{ id: "about-txt", name: "about.txt", kind: "file" }] },
  resume: { id: "resume", name: "Resume", kind: "folder", children: [{ id: "resume-pdf", name: "resume.pdf", kind: "file" }] },
  trash: { id: "trash", name: "Trash", kind: "folder", children: [] },
};
