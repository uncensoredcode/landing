import Link from "next/link";
import Image from "next/image";
import { Github } from "lucide-react";
import { GITHUB_URL } from "@/lib/constants";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[hsl(var(--background))]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo/logo.svg"
            alt="uncensoredcode"
            width={28}
            height={28}
            className="h-7 w-7"
          />
          <span className="hidden sm:block text-lg font-medium tracking-tight">
            uncensored_<span className="text-[hsl(var(--accent))]">code</span>
          </span>
        </Link>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-[hsl(var(--foreground))/70] hover:text-[hsl(var(--accent))] transition-colors"
        >
          <Github className="h-5 w-5" />
          <span className="sr-only">GitHub</span>
        </a>
      </div>
    </header>
  );
}
