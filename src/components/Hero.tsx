import { Github } from "lucide-react";
import { GITHUB_URL } from "@/lib/constants";
export function Hero() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center justify-center px-6 py-32 text-center">
      <h1 className="text-5xl font-bold tracking-tight md:text-7xl">Code without permission.</h1>
      <p className="mt-8 max-w-2xl text-lg text-[hsl(var(--foreground))/60]">
        uncensored_<span className="text-[hsl(var(--accent))]">code</span> builds open software for a freer internet — tools that are inspectable, forkable, interoperable, and controlled by users.
      </p>
      <div className="mt-10">
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-[hsl(var(--accent))] px-6 py-3 text-sm font-medium text-[hsl(var(--background))] hover:opacity-90 transition-opacity">
          <Github className="h-4 w-4" /> View on GitHub
        </a>
      </div>
    </section>
  );
}
