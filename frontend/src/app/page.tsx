import { Suspense } from "react";
import { Desktop } from "@/components/os/desktop";
import { api, type Envelope, type Project, type Post } from "@/lib/api";

export default async function Page() {
  // Parallel server fetch (no waterfall): both hit Redis-cached backend routes.
  const [projRes, postRes] = await Promise.all([
    api<Envelope<Project[]>>("/projects", 90),
    api<Envelope<Post[]>>("/posts", 300),
  ]);
  const projects = projRes?.data ?? [];
  const posts = postRes?.data ?? [];
  return (
    <Suspense fallback={<div className="grid min-h-dvh place-items-center bg-slate-950 text-white">Loading desktop…</div>}>
      <Desktop projects={projects} posts={posts} />
    </Suspense>
  );
}
