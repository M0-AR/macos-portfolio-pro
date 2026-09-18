"use client";
import { useState } from "react";
import { Github, Linkedin, Twitter, Globe, Send } from "lucide-react";
import { WindowShell } from "@/components/os/window-shell";
import { WindowControls } from "@/components/os/window-controls";
import { useToastStore } from "@/components/os/toaster";
import { SOCIAL_LINKS } from "@/lib/site";
import { postContact } from "@/lib/api";

const SOCIALS = [
  { id: "github", label: "GitHub", href: SOCIAL_LINKS[0].href, icon: Github },
  { id: "x", label: "X / Twitter", href: SOCIAL_LINKS[1].href, icon: Twitter },
  { id: "linkedin", label: "LinkedIn", href: SOCIAL_LINKS[2].href, icon: Linkedin },
  { id: "site", label: "Website", href: SOCIAL_LINKS[3].href, icon: Globe },
];

export function ContactWindow() {
  const [form, setForm] = useState({ name: "", email: "", body: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const push = useToastStore((s) => s.push);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await postContact({ name: form.name, email: form.email, body: form.body, subject: "Portfolio contact" });
      setStatus("sent");
      push("Message queued", "Thanks — I reply within 2 days.");
    } catch {
      setStatus("error");
      push("Send failed", "Try again or email directly.");
    }
  };

  return (
    <WindowShell win="contact" title="Contact">
      <div data-drag-handle className="glass-titlebar flex h-12 cursor-grab items-center gap-3 px-4 active:cursor-grabbing">
        <WindowControls target="contact" />
        <h2 className="text-sm font-semibold">Contact me</h2>
      </div>
      <div className="h-[calc(100%-2.75rem)] overflow-auto p-4">
        <h3 className="text-lg font-bold">Let&apos;s connect</h3>
        <p className="text-sm text-[var(--muted-foreground)]">Got an idea or a role? Message queues behind <code>/api/contact</code> — you get 200 now, email sends later.</p>
        <ul className="mt-3 grid grid-cols-2 gap-2">
          {SOCIALS.map((s) => (
            <li key={s.id}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
                className="flex min-h-[44px] items-center gap-2 rounded-xl border px-3 text-sm font-medium hover:bg-[var(--muted)]">
                <s.icon className="size-4" aria-hidden="true" /> {s.label}
              </a>
            </li>
          ))}
        </ul>
        {status === "sent" ? (
          <p role="status" className="mt-4 rounded-xl border p-3 text-sm">Thanks — message queued. I reply within 2 days.</p>
        ) : (
          <form onSubmit={submit} className="mt-4 space-y-2">
            <label className="block text-sm font-medium" htmlFor="ct-name">Name
              <input id="ct-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 h-11 w-full rounded-lg border bg-transparent px-3" autoComplete="name" />
            </label>
            <label className="block text-sm font-medium" htmlFor="ct-email">Email
              <input id="ct-email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 h-11 w-full rounded-lg border bg-transparent px-3" autoComplete="email" />
            </label>
            <label className="block text-sm font-medium" htmlFor="ct-body">Message
              <textarea id="ct-body" required rows={3} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })}
                className="mt-1 w-full rounded-lg border bg-transparent p-3" />
            </label>
            <button disabled={status === "sending"} className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[var(--primary)] px-5 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-60">
              <Send className="size-4" aria-hidden="true" /> {status === "sending" ? "Sending…" : "Send message"}
            </button>
            {status === "error" && <p role="alert" className="text-sm text-red-500">Send failed — try again or email directly.</p>}
          </form>
        )}
      </div>
    </WindowShell>
  );
}
