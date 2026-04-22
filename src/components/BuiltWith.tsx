import { ArrowUpRight, Github, ExternalLink } from "lucide-react";
import { builtWithProjects } from "@/lib/data";

export function BuiltWith() {
  return (
    <section id="built-with" className="mx-auto max-w-5xl px-6 py-24">
      <h2 className="text-2xl font-medium mb-2">Built with OpenBridge</h2>
      <p className="text-[hsl(var(--foreground))/60] mb-10">
        Projects and demos powered by the OpenBridge library.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        {builtWithProjects.map((p) => (
          <div
            key={p.name}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 transition-all hover:border-[hsl(var(--accent))]/40 hover:from-white/[0.06]"
          >
            <div className="relative z-10">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-white/10 bg-white/[0.06] px-2 py-0.5 text-xs text-[hsl(var(--foreground))/50]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">{p.name}</h3>
                <span className="rounded-full border border-[hsl(var(--accent))]/30 bg-[hsl(var(--accent))]/10 px-2 py-0.5 text-xs text-[hsl(var(--accent))]">
                  {p.model}
                </span>
              </div>
              <p className="mt-2 text-sm text-[hsl(var(--foreground))/60] leading-relaxed">
                {p.description}
              </p>
            </div>
            <div className="relative z-10 mt-5 flex items-center gap-4 text-sm">
              <a
                href={p.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[hsl(var(--foreground))/70] transition-colors hover:border-[hsl(var(--accent))]/40 hover:text-[hsl(var(--accent))]"
              >
                <Github className="h-3.5 w-3.5" />
                Repository
              </a>
              <a
                href={p.demoUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[hsl(var(--foreground))/70] transition-colors hover:border-[hsl(var(--accent))]/40 hover:text-[hsl(var(--accent))]"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Demo
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}