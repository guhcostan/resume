import type { Locale } from "@/lib/content";

/**
 * "Lite" answer engine used where the in-browser LLM can't run safely:
 * phones/tablets (the ~1.6 GB model OOM-kills mobile tabs, causing reload
 * loops) and browsers without WebGPU. Answers are curated from the same
 * profile facts the real model is grounded on — no download, no crash.
 */

export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (/Android|iPhone|iPod|Mobi/i.test(ua)) return true;
  // iPadOS pretends to be macOS but is still memory-constrained.
  return /iPad|Macintosh/i.test(ua) && navigator.maxTouchPoints > 1;
}

interface Topic {
  /** Short keys (<=3 chars) are matched on word boundaries. */
  keys: string[];
  en: string;
  pt: string;
}

const TOPICS: Topic[] = [
  {
    keys: [
      "ai",
      "ia",
      "llm",
      "agent",
      "agente",
      "claude",
      "cursor",
      "intelig",
      "artificial",
    ],
    en: "Since late 2024 Gustavo's focus expanded into AI-assisted engineering: he ships LLM-powered features and autonomous agents in production at Thoughtworks, working hands-on with Claude and Cursor. Fun fact: on desktop, this very chat runs a real LLM inside your browser. 🤖",
    pt: "Desde o fim de 2024 o foco do Gustavo se expandiu para engenharia assistida por IA: ele entrega features com LLMs e agentes autônomos em produção na Thoughtworks, trabalhando com Claude e Cursor no dia a dia. Curiosidade: no desktop, este chat roda um LLM de verdade dentro do navegador. 🤖",
  },
  {
    keys: [
      "stack",
      "tech",
      "tecnolog",
      "skill",
      "habilidade",
      "ferramenta",
      "typescript",
      "react",
      "native",
      "linguagem",
    ],
    en: "His core stack: React Native, TypeScript, React/Next.js and Node.js, plus GraphQL, Firebase and CI/CD (Bitrise, Jenkins). On the AI side: LLM integration, autonomous agents, Claude and Cursor. Practices he cares about: TDD, clean architecture and strong code review.",
    pt: "A stack principal dele: React Native, TypeScript, React/Next.js e Node.js, além de GraphQL, Firebase e CI/CD (Bitrise, Jenkins). No lado de IA: integração de LLMs, agentes autônomos, Claude e Cursor. Práticas que ele valoriza: TDD, arquitetura limpa e code review forte.",
  },
  {
    keys: [
      "mac-cleaner",
      "cleaner",
      "open source",
      "opensource",
      "projeto",
      "project",
      "github",
      "estrela",
      "star",
      "cli",
      "b3",
      "brasilapi",
      "mega-brain",
    ],
    en: "He ships open source dev tools for fun: mac-cleaner-cli (1.8k+ ⭐, a fast macOS disk cleaner), b3analysis (AI agent for Brazilian stocks with Claude Code), brasilapi-sdk, windows-cleaner-cli and claude-mega-brain. All at github.com/guhcostan.",
    pt: "Ele lança ferramentas open source por diversão: mac-cleaner-cli (1.8k+ ⭐, limpador de disco rápido pra macOS), b3analysis (agente de IA pra ações da B3 com Claude Code), brasilapi-sdk, windows-cleaner-cli e claude-mega-brain. Tudo em github.com/guhcostan.",
  },
  {
    keys: [
      "experien",
      "carreira",
      "career",
      "thoughtworks",
      "trabalh",
      "work",
      "job",
      "emprego",
      "latam",
      "recargapay",
      "descomplica",
      "lead",
      "anchor",
      "historic",
    ],
    en: "8+ years shipping software. Today he's Tech Anchor at Thoughtworks, steering the LatamPass app (one of Latin America's largest airline loyalty platforms) and leading AI-assisted engineering. Before that: Technical Lead and Mobile Engineer at Thoughtworks, plus RecargaPay (fintech), Descomplica (EdTech), Equal and LEMAF.",
    pt: "8+ anos entregando software. Hoje ele é Tech Anchor na Thoughtworks, conduzindo o app LatamPass (uma das maiores plataformas de fidelidade aérea da América Latina) e liderando a engenharia assistida por IA. Antes: Technical Lead e Mobile Engineer na Thoughtworks, além de RecargaPay (fintech), Descomplica (EdTech), Equal e LEMAF.",
  },
  {
    keys: [
      "contact",
      "contato",
      "email",
      "e-mail",
      "linkedin",
      "falar",
      "hire",
      "contrat",
      "reach",
    ],
    en: "Easy: guhcostan@gmail.com — or linkedin.com/in/guhcostan and github.com/guhcostan. He's open to interesting problems in mobile, frontend and AI engineering.",
    pt: "Fácil: guhcostan@gmail.com — ou linkedin.com/in/guhcostan e github.com/guhcostan. Ele é aberto a problemas interessantes em mobile, frontend e engenharia de IA.",
  },
  {
    keys: [
      "educa",
      "formac",
      "faculdade",
      "university",
      "universidade",
      "ufla",
      "degree",
      "estud",
      "cert",
    ],
    en: "BSc in Computer Science from the Federal University of Lavras (UFLA), 2015–2019. Certifications include DevOps Essentials (DEPCP), Scrum Foundations (SFPC) and Software Architecture Fundamentals.",
    pt: "Bacharel em Ciência da Computação pela Universidade Federal de Lavras (UFLA), 2015–2019. Certificações incluem DevOps Essentials (DEPCP), Scrum Foundations (SFPC) e Software Architecture Fundamentals.",
  },
  {
    keys: ["idioma", "language", "ingles", "english", "espanhol", "spanish", "portugu"],
    en: "Portuguese (native), English (professional) and Spanish (professional) — he works daily across Brazil and Chile.",
    pt: "Português (nativo), inglês (profissional) e espanhol (profissional) — ele trabalha diariamente entre Brasil e Chile.",
  },
  {
    keys: ["onde", "mora", "location", "localiza", "based", "cidade", "city", "brasil", "brazil"],
    en: "He's based in São Sebastião, on the coast of São Paulo, Brazil — working remotely with teams across Brazil and Chile.",
    pt: "Ele mora em São Sebastião, no litoral de São Paulo — trabalhando remoto com times no Brasil e no Chile.",
  },
  {
    keys: [
      "quem",
      "who",
      "what",
      "faz",
      "sobre",
      "about",
      "resumo",
      "summary",
      "apresent",
      "ola",
      "oi",
      "hello",
      "hi",
    ],
    en: "Gustavo Costa is a Lead Mobile & Frontend Engineer with 8+ years building apps used by millions — airline loyalty, EdTech and fintech. He's Tech Anchor at Thoughtworks and, since late 2024, focused on shipping LLM features and autonomous agents in production. Ask me about his stack, AI work or open source!",
    pt: "Gustavo Costa é Lead Mobile & Frontend Engineer com 8+ anos construindo apps usados por milhões — fidelidade aérea, EdTech e fintech. É Tech Anchor na Thoughtworks e, desde o fim de 2024, focado em entregar features com LLMs e agentes autônomos em produção. Pergunte sobre a stack, o trabalho com IA ou o open source dele!",
  },
];

const FALLBACK: Record<Locale, string> = {
  en: "I don't have that detail here, but I can tell you about Gustavo's experience, tech stack, AI work, open source projects, education or how to contact him. What would you like to know?",
  pt: "Não tenho esse detalhe aqui, mas posso contar sobre a experiência do Gustavo, a stack, o trabalho com IA, os projetos open source, a formação ou como falar com ele. O que você quer saber?",
};

function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function answerLite(question: string, locale: Locale): string {
  const q = normalize(question);
  for (const topic of TOPICS) {
    for (const key of topic.keys) {
      const k = normalize(key);
      const hit =
        k.length <= 3 ? new RegExp(`\\b${k}\\b`).test(q) : q.includes(k);
      if (hit) return topic[locale];
    }
  }
  return FALLBACK[locale];
}

/** Streams a canned answer word by word, so lite mode still feels alive. */
export async function streamLite(
  text: string,
  onToken: (delta: string) => void,
  delayMs = 22
): Promise<void> {
  for (const part of text.split(/(\s+)/)) {
    if (!part) continue;
    onToken(part);
    if (part.trim()) await new Promise((r) => setTimeout(r, delayMs));
  }
}
