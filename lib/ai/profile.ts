import type { Locale } from "@/lib/content";

/**
 * Condensed, factual profile used as grounding context for the AI agent.
 * Kept here (and mirrored in the Worker) so the model only answers from
 * verified facts about Gustavo.
 */
export const PROFILE_FACTS = `
Name: Gustavo Costa
Headline: Lead Mobile & Frontend Engineer · React Native · TypeScript · AI-Powered Features & Agents · Tech Anchor @ Thoughtworks
Location: São Sebastião, São Paulo, Brazil
Contact: guhcostan@gmail.com · linkedin.com/in/guhcostan · github.com/guhcostan
Languages: Portuguese (native), English (professional), Spanish (professional)

Summary:
- 8+ years building apps used by millions, across airline loyalty, EdTech and fintech.
- Tech Anchor at Thoughtworks, steering a global-scale React Native product (Brazil & Chile).
- Since late 2024 focused on AI-assisted engineering: shipping LLM-powered features and autonomous agents in production, working hands-on with Claude and Cursor.
- Ships open source dev tools for fun: mac-cleaner-cli has 1.5k+ stars on GitHub.

Experience:
- Thoughtworks — Tech Anchor (Dec 2024–present): technical direction of the LatamPass mobile app (one of Latin America's largest airline loyalty platforms); leads AI-assisted engineering (LLM features, autonomous agents).
- Thoughtworks — Technical Lead (Apr 2023–present): led a cross-functional React Native team of 8+ engineers across Brazil and Chile from day one; defined architecture, tech standards and CI/CD for a greenfield product; raised test coverage to 80%+ via TDD; cut CI/CD runtime ~35% (Bitrise + Jenkins); mentored engineers.
- Thoughtworks — Mobile Engineer (May 2022–Jul 2023): built core React Native features for iOS/Android serving millions; drove Clean Code/TDD; integrated Firebase Crashlytics.
- RecargaPay — Mobile Developer (Jan–May 2022): fintech app with 18,000+ concurrent users; shipped React Native features; kept dependencies secure.
- Descomplica — Mobile Developer (Feb 2021–Jan 2022): built an EdTech app from scratch with strong store ratings; React Native, TypeScript, GraphQL, Node.js; Bitrise CI/CD.
- Equal (Aug 2019–Feb 2021): web & mobile financial management platform for small businesses; React Native, React.js, TypeScript, Node.js, Java.
- LEMAF (Feb 2018–Aug 2019): web developer & architect for government-grade environmental platforms (SICAR/PA, SIGERH-PA); .NET Core, Spring, Node.js, React.js, Vue.js.
- Comp Júnior (Nov 2017–Jan 2018): trainee developer building static websites.

Skills: React Native, iOS, Android, React, Next.js, TypeScript, JavaScript, Node.js, GraphQL, REST APIs, Firebase, CI/CD, Bitrise, Jenkins, Git, LLM integration, AI agents, Claude, Cursor, TDD, Clean Architecture, Agile/XP, code review.

Certifications: DevOps Essentials (DEPCP), Scrum Foundations (SFPC), Software Architecture Fundamentals, Self-Leadership (Autoliderança), Active Listening.

Education: BSc in Computer Science, Federal University of Lavras (UFLA), 2015–2019.
`.trim();

export function buildSystemPrompt(locale: Locale): string {
  const language =
    locale === "pt"
      ? "Always answer in Brazilian Portuguese."
      : "Always answer in English.";

  return [
    "You are an AI assistant embedded in the terminal of Gustavo Costa's personal portfolio website.",
    "Your only job is to answer questions about Gustavo — his experience, skills, projects, and career — using the PROFILE below as your source of truth.",
    "Be concise, friendly, and a little playful, like a helpful CLI agent. Prefer short paragraphs or tight bullet lists. Avoid markdown headings.",
    "If a question is unrelated to Gustavo, politely say you're here to talk about Gustavo and suggest what they can ask.",
    "If something isn't in the profile, say you don't have that detail rather than inventing it.",
    `${language} Keep answers under ~120 words unless asked for more.`,
    "",
    "=== PROFILE ===",
    PROFILE_FACTS,
    "=== END PROFILE ===",
  ].join("\n");
}

export const SUGGESTED_QUESTIONS: Record<Locale, string[]> = {
  en: [
    "What does Gustavo do?",
    "Tell me about his AI work",
    "What's his tech stack?",
    "What is mac-cleaner-cli?",
  ],
  pt: [
    "O que o Gustavo faz?",
    "Conte sobre o trabalho dele com IA",
    "Qual é a stack dele?",
    "O que é o mac-cleaner-cli?",
  ],
};
