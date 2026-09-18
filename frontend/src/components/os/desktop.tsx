"use client";
import { MenuBar } from "@/components/os/menu-bar";
import { WelcomeHero } from "@/components/os/welcome-hero";
import { Dock } from "@/components/os/dock";
import { DesktopIcons } from "@/components/os/desktop-icons";
import { Spotlight } from "@/components/os/spotlight";
import { Launchpad } from "@/components/os/launchpad";
import { WallpaperPicker } from "@/components/os/wallpaper-picker";
import { BootScreen } from "@/components/os/boot-screen";
import { Toaster } from "@/components/os/toaster";
import { FinderWindow } from "@/components/windows/finder";
import { SafariWindow } from "@/components/windows/safari";
import { TerminalWindow } from "@/components/windows/terminal";
import { ContactWindow } from "@/components/windows/contact";
import { ResumeWindow } from "@/components/windows/resume";
import { NotesWindow } from "@/components/windows/notes";
import { CalculatorWindow } from "@/components/windows/calculator";
import { VSCodeWindow } from "@/components/windows/vscode";
import { PhotosWindow, TextViewerWindow } from "@/components/windows/gallery";
import { useWindowStore, type WindowKey } from "@/stores/window-store";
import { useWallpaperStore, useWallpaperSync } from "@/stores/wallpaper-store";
import { FolderGit2, Newspaper, Image, TerminalSquare, Mail, FileText, NotebookPen, Calculator, Code2 } from "lucide-react";
import type { Project, Post } from "@/lib/api";

export const DESKTOP_APPS: { key: WindowKey; label: string; icon: typeof FolderGit2 }[] = [
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

const LAUNCHER: { key: WindowKey; label: string; icon: typeof FolderGit2 }[] = DESKTOP_APPS;

function MobileLauncher() {
  const openWindow = useWindowStore((s) => s.openWindow);
  return (
    <div className="mx-auto grid max-w-md grid-cols-3 gap-3 px-4 pb-28 md:hidden" role="list" aria-label="Apps">
      {LAUNCHER.map(({ key, label, icon: Icon }) => (
        <button key={key} role="listitem" onClick={() => openWindow(key)}
          className="glass-dock flex min-h-[88px] flex-col items-center justify-center gap-1.5 rounded-2xl text-sm font-medium text-white active:scale-95">
          <Icon className="size-6" aria-hidden="true" /> {label}
        </button>
      ))}
    </div>
  );
}

export function Desktop({ projects, posts }: { projects: Project[]; posts: Post[] }) {
  const wallpaper = useWallpaperStore((s) => s.current);
  useWallpaperSync();
  return (
    <div className={`os-wallpaper dark min-h-dvh text-white ${wallpaper === "sequoia" ? "wallpaper-sequoia" : wallpaper === "aurora" ? "wallpaper-aurora" : wallpaper === "sunset" ? "wallpaper-sunset" : "wallpaper-midnight"}`}>
      <BootScreen />
      <MenuBar />
      <main className="relative z-10 pt-11">
        <WelcomeHero />
        <MobileLauncher />
        <DesktopIcons />
        <WallpaperPicker />
      </main>
      <FinderWindow projects={projects} />
      <SafariWindow posts={posts} />
      <TerminalWindow />
      <ContactWindow />
      <ResumeWindow />
      <NotesWindow />
      <CalculatorWindow />
      <VSCodeWindow />
      <PhotosWindow projects={projects} />
      <TextViewerWindow />
      <Spotlight projects={projects} posts={posts} />
      <Launchpad />
      <Toaster />
      <Dock />
    </div>
  );
}
