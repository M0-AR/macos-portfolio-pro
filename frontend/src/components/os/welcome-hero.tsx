"use client";
import { motion, useReducedMotion } from "motion/react";
import { useWindowStore } from "@/stores/window-store";
import { GitHubStatsBar } from "@/components/os/github-stats";

export function WelcomeHero() {
  const openWindow = useWindowStore((s) => s.openWindow);
  const reduce = useReducedMotion();
  const anim = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const } };
  return (
    <header className="mx-auto max-w-3xl px-4 pb-48 pt-20 text-center sm:pt-24">
      <motion.div {...anim(0)} className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 shadow backdrop-blur-xl">
        <span className="relative flex size-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex size-2 rounded-full bg-emerald-400" /></span>
        Available for senior AI roles · 2026
      </motion.div>
      <motion.p {...anim(0.05)} className="mt-5 text-[13px] font-semibold uppercase tracking-[0.28em] text-white/60">
        Hey, I&apos;m Mohamad Al-Ashmar — welcome to my
      </motion.p>
      <motion.h1 {...anim(0.12)} className="mt-3 bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-6xl font-bold italic tracking-tight text-transparent drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)] sm:text-7xl">
        Portfolio OS
      </motion.h1>
      <motion.p {...anim(0.2)} className="mx-auto mt-4 max-w-prose text-balance text-sm leading-relaxed text-white/70 sm:text-base">
        A desktop you can click: live projects in Finder, writing in Safari, stack in Terminal.
        Fully responsive — on phones it becomes an app launcher, not a broken desktop.
      </motion.p>
      <motion.div {...anim(0.28)} className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
        <button onClick={() => openWindow("finder")} className="inline-flex min-h-[48px] items-center rounded-2xl bg-white px-6 text-sm font-semibold text-slate-900 shadow-[0_8px_30px_rgba(255,255,255,0.25)] transition hover:scale-[1.02] hover:bg-white/90 active:scale-95">
          Browse projects
        </button>
        <button onClick={() => openWindow("contact")} className="inline-flex min-h-[48px] items-center rounded-2xl border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/20 active:scale-95">
          Contact me
        </button>
      </motion.div>
      <motion.div {...anim(0.36)} className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-white/55">
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 backdrop-blur">Next.js 16 · RSC</span>
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 backdrop-blur">NestJS 11 · BullMQ</span>
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 backdrop-blur">Lighthouse ≥90</span>
      </motion.div>
      <GitHubStatsBar />
    </header>
  );
}
