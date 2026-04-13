import { GITHUB_URL, ORG_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mx-auto max-w-5xl border-t border-white/10 px-6 py-12">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-[hsl(var(--foreground))/40]">
          &copy; {new Date().getFullYear()} {ORG_NAME}. All code is open and
          free.
        </p>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[hsl(var(--foreground))/40] hover:text-[hsl(var(--foreground))]/80 transition-colors"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
