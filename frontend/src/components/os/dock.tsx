"use client";
import { motion, useReducedMotion } from "motion/react";
import { useWindowStore, type WindowKey } from "@/stores/window-store";
import { FolderGit2, Newspaper, Image, TerminalSquare, Mail, FileText, NotebookPen, Calculator, Code2, Trash2 } from "lucide-react";

const APPS: { key: WindowKey; label: string; icon: typeof FolderGit2; openable: boolean }[] = [
  { key: "finder", label: "Projects", icon: FolderGit2, openable: true },
  { key: "safari", label: "Blog", icon: Newspaper, openable: true },
  { key: "photos", label: "Gallery", icon: Image, openable: true },
  { key: "contact", label: "Contact", icon: Mail, openable: true },
  { key: "terminal", label: "Skills", icon: TerminalSquare, openable: true },
  { key: "notes", label: "Notes", icon: NotebookPen, openable: true },
  { key: "calc", label: "Calculator", icon: Calculator, openable: true },
  { key: "vscode", label: "Code", icon: Code2, openable: true },
  { key: "resume", label: "Résumé", icon: FileText, openable: true },
];

export function Dock() {
  const openWindow = useWindowStore((s) => s.openWindow);
  const windows = useWindowStore((s) => s.windows);
  const reduce = useReducedMotion();
  return (
    <div className="fixed inset-x-0 bottom-3 z-50 flex justify-center px-3" role="toolbar" aria-label="Application dock">
      <div className="glass-dock flex items-end gap-1 rounded-[22px] px-2 py-2 sm:gap-1.5 sm:px-3">
        {APPS.map(({ key, label, icon: Icon, openable }) => {
          const open = windows[key]?.isOpen;
          return (
            <div key={key} className="group relative flex flex-col items-center">
              <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-lg border border-white/10 bg-black/70 px-2 py-1 text-xs text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                {label}
              </span>
              <motion.button type="button" disabled={!openable} aria-label={`Open ${label}`}
                title={label} onClick={() => openWindow(key)}
                whileHover={reduce ? undefined : { y: -10, scale: 1.22 }}
                whileTap={reduce ? undefined : { scale: 0.92 }}
                animate={open && !reduce ? { y: [0, -6, 0] } : undefined}
                transition={{ type: "spring", stiffness: 550, damping: 20 }}
                className="relative grid size-12 place-items-center rounded-2xl border border-white/10 bg-gradient-to-b from-white/15 to-white/5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] hover:from-white/25 hover:to-white/10 disabled:opacity-60 sm:size-[52px]">
                <Icon className="size-5 drop-shadow sm:size-6" aria-hidden="true" />
                {open && <span aria-hidden="true" className="absolute -bottom-[7px] size-1 rounded-full bg-white/90 shadow" />}
              </motion.button>
            </div>
          );
        })}
        <span aria-hidden="true" className="mx-1.5 h-10 w-px bg-white/15" />
        <span className="grid size-12 place-items-center rounded-2xl border border-white/5 bg-white/5 text-white/50 sm:size-[52px]" title="Trash" aria-label="Trash (decorative)">
          <Trash2 className="size-5 sm:size-6" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}
