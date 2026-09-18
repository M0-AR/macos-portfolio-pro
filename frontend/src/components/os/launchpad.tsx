"use client";
import { motion } from "motion/react";
import { FolderGit2, Newspaper, Image, TerminalSquare, Mail, FileText, NotebookPen, Calculator, Code2, X } from "lucide-react";
import { useWindowStore, type WindowKey } from "@/stores/window-store";

const APPS: { key: WindowKey; label: string; icon: typeof FolderGit2 }[] = [
  { key: "finder", label: "Projects", icon: FolderGit2 },
  { key: "safari", label: "Blog", icon: Newspaper },
  { key: "photos", label: "Gallery", icon: Image },
  { key: "terminal", label: "Skills", icon: TerminalSquare },
  { key: "contact", label: "Contact", icon: Mail },
  { key: "resume", label: "Résumé", icon: FileText },
  { key: "notes", label: "Notes", icon: NotebookPen },
  { key: "calc", label: "Calculator", icon: Calculator },
  { key: "vscode", label: "Code", icon: Code2 },
];

export function Launchpad() {
  const open = useWindowStore((s) => s.launchpadOpen);
  const setLaunchpad = useWindowStore((s) => s.setLaunchpad);
  const openWindow = useWindowStore((s) => s.openWindow);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[190] flex flex-col bg-black/60 backdrop-blur-2xl" role="dialog" aria-label="Launchpad">
      <div className="flex items-center justify-between px-5 pt-14">
        <h2 className="text-lg font-semibold text-white">Launchpad</h2>
        <button onClick={() => setLaunchpad(false)} aria-label="Close Launchpad" className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/20">
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
      <div className="grid flex-1 content-center grid-cols-3 gap-6 overflow-auto px-8 pb-24 sm:grid-cols-6">
        {APPS.map(({ key, label, icon: Icon }, i) => (
          <motion.button
            key={key}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04, type: "spring", stiffness: 400, damping: 24 }}
            onClick={() => {
              openWindow(key);
              setLaunchpad(false);
            }}
            className="flex flex-col items-center gap-2 rounded-2xl p-3 hover:bg-white/10 active:scale-95"
          >
            <span className="grid size-16 place-items-center rounded-[18px] border border-white/15 bg-gradient-to-b from-white/20 to-white/5 shadow-xl sm:size-20">
              <Icon className="size-7 text-white sm:size-8" aria-hidden="true" />
            </span>
            <span className="text-[13px] font-medium text-white">{label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
