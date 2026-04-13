import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/data";

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-24">
      <div className="grid gap-6">
        {projects.map((p) => (
          <a 
            key={p.name} 
            href={p.href} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-8 transition-all hover:border-[hsl(var(--accent))]/40 hover:from-white/[0.06]"
          >
            <div className="relative z-10">
              <h3 className="text-xl font-medium">{p.name}</h3>
              <p className="mt-2 text-[hsl(var(--foreground))/60]">
                {p.description}
              </p>
            </div>
            <div className="relative z-10 mt-6 flex items-center gap-2 text-sm text-[hsl(var(--foreground))/40] group-hover:text-[hsl(var(--accent))] transition-colors">
              View on GitHub <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
