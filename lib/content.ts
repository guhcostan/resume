export const profile = {
  name: "Gustavo Costa",
  email: "guhcostan@gmail.com",
  role: "Engenheiro de software com foco em IA · Tech Anchor",
  location: "São Sebastião, Brasil",
  github: "https://github.com/guhcostan",
  linkedin: "https://www.linkedin.com/in/guhcostan",
};

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || `https://guhcostan.github.io${basePath || "/resume"}`).replace(/\/$/, "");
export const asset = (path: string) => `${basePath}${path}`;

export const projects = [
  { name: "b3analysis", category: "ai", color: "icon-sage" },
  { name: "claude-mega-brain", category: "ai", color: "icon-lilac" },
  { name: "mac-cleaner-cli", category: "tools", color: "icon-charcoal" },
  { name: "brasilapi-sdk", category: "tools", color: "icon-sand" },
  { name: "windows-cleaner-cli", category: "tools", color: "icon-blue" },
] as const;
