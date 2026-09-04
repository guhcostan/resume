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
  {
    name: "b3analysis",
    detail: "Equipes de agentes especializados que pesquisam e cruzam dados públicos da B3 com Claude Code. Um laboratório de orquestração e análise com IA.",
    technology: "Python · Orquestração de agentes",
    category: "IA",
    color: "icon-sage",
  },
  {
    name: "claude-mega-brain",
    detail: "Contexto do projeto disponível desde o início de cada sessão do Claude Code. Uma base de conhecimento para agentes que precisam conhecer o seu código.",
    technology: "Python · Engenharia de contexto",
    category: "IA",
    color: "icon-lilac",
  },
  {
    name: "mac-cleaner-cli",
    detail: "Libere espaço no Mac: caches, logs e arquivos de desenvolvimento, direto pelo terminal.",
    technology: "TypeScript · macOS",
    category: "Ferramentas",
    color: "icon-charcoal",
  },
  {
    name: "brasilapi-sdk",
    detail: "CEP, CNPJ, bancos e outros dados do Brasil em um SDK TypeScript tipado e fácil de usar.",
    technology: "TypeScript · SDK",
    category: "Ferramentas",
    color: "icon-sand",
  },
  {
    name: "windows-cleaner-cli",
    detail: "Limpeza de caches e arquivos temporários do Windows, com código aberto e pelo terminal.",
    technology: "CLI · Windows",
    category: "Ferramentas",
    color: "icon-blue",
  },
] as const;
