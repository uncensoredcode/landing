export interface Project { name: string; description: string; href: string; }
export const projects = [
  { name: "OpenBridge", description: "Infrastructure for open, user-controlled bridges between tools, workflows, and ecosystems.", href: "https://github.com/uncensoredcode/openbridge" },
  { name: "Session Extractor", description: "Browser extension for transparent session management and data portability.", href: "https://github.com/uncensoredcode/extension" }
];

export interface BuiltWithProject {
  name: string;
  description: string;
  repoUrl: string;
  demoUrl?: string;
  model: string;
  tags: string[];
}

export const builtWithProjects: BuiltWithProject[] = [
  {
    name: "Pac-Man",
    description: "A classic Pac-Man game built from scratch with vanilla JavaScript, Canvas API, and Web Audio. Features 4 unique ghost AIs with scatter/chase modes, power pellets, and retro sound effects.",
    repoUrl: "https://github.com/uncensoredcode/landing/tree/main/projects/pacman",
    demoUrl: "/projects/pacman",
    model: "GLM-5v-Turbo",
    tags: ["Game", "Demo", "JavaScript", "Canvas"]
  }
];
