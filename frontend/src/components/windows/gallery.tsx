"use client";
import { WindowShell } from "@/components/os/window-shell";
import { WindowControls } from "@/components/os/window-controls";
import { useWindowStore } from "@/stores/window-store";
import type { Project, Post } from "@/lib/api";

export function PhotosWindow({ projects }: { projects: Project[] }) {
  const openWindow = useWindowStore((s) => s.openWindow);
  return (
    <WindowShell win="photos" title="Photos — Gallery">
      <div data-drag-handle className="glass-titlebar flex h-12 cursor-grab items-center gap-3 px-4 active:cursor-grabbing">
        <WindowControls target="photos" />
        <h2 className="text-sm font-semibold">Gallery</h2>
      </div>
      <div className="grid h-[calc(100%-2.75rem)] grid-cols-2 gap-2 overflow-auto p-3 sm:grid-cols-3">
        {projects.map((p) => (
          <button key={p.slug} onClick={() => openWindow("txt", { kind: "project", project: p })}
            className="group min-h-[44px] overflow-hidden rounded-xl border text-left hover:ring-2 hover:ring-[var(--ring)]">
            <span className="grid aspect-[4/3] place-items-center bg-gradient-to-br from-sky-500/30 via-violet-500/20 to-emerald-500/20 text-2xl font-bold">
              {p.title.slice(0, 1)}
            </span>
            <span className="block truncate px-2 py-1.5 text-xs font-medium">{p.title}</span>
          </button>
        ))}
        {projects.length === 0 && <p className="col-span-full p-4 text-sm text-[var(--muted-foreground)]">Gallery warms up with projects.</p>}
      </div>
    </WindowShell>
  );
}

export function TextViewerWindow() {
  const data = useWindowStore((s) => s.windows.txt.data) as { kind?: string; project?: Project; post?: Post } | undefined;
  const project = data?.project;
  const post = data?.post;
  const title = project?.title ?? post?.title ?? "Text viewer";
  return (
    <WindowShell win="txt" title={title}>
      <div data-drag-handle className="glass-titlebar flex h-12 cursor-grab items-center gap-3 px-4 active:cursor-grabbing">
        <WindowControls target="txt" />
        <h2 className="truncate text-sm font-semibold">{project ? `${project.title}.txt` : post ? `${post.slug}.md` : "viewer.txt"}</h2>
      </div>
      <div className="h-[calc(100%-3rem)] overflow-auto p-5">
        {!project && !post ? (
          <p className="text-sm text-[var(--muted-foreground)]">Open a project from Finder or Gallery, or a post from Safari.</p>
        ) : project ? (
          <>
            <h3 className="text-xl font-bold">{project.title}</h3>
            <p className="mt-1 text-sm font-medium text-[var(--primary)]">{project.tagline}</p>
            <p className="mt-3 text-sm leading-relaxed">{project.description}</p>
            <p className="mt-3 text-xs text-[var(--muted-foreground)]">Stack: {project.tech.join(", ")}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center rounded-lg bg-[var(--primary)] px-4 text-sm font-medium text-[var(--primary-foreground)]">Live demo</a>}
              {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center rounded-lg border px-4 text-sm font-medium">Repository</a>}
            </div>
          </>
        ) : post ? (
          <>
            <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">{new Date(post.createdAt).toLocaleDateString()}</p>
            <h3 className="mt-1 text-xl font-bold">{post.title}</h3>
            <p className="mt-1 text-sm font-medium text-[var(--primary)]">{post.excerpt}</p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{post.body}</p>
          </>
        ) : null}
      </div>
    </WindowShell>
  );
}
