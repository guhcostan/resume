import type { pt } from "./pt";

export const en: typeof pt = {
  locale: "en-US",
  metadata: {
    title: "guh. — Gustavo Costa · AI Engineering",
    description: "Gustavo Costa, aka Guh. Software engineer focused on AI, agents and LLMs. Tech Anchor at Thoughtworks, with React Native experience. Available for freelance work.",
    imageAlt: "guh. — Gustavo Costa. AI engineering, agents and open source.",
    jobTitle: "Software engineer focused on AI · Tech Anchor",
  },
  common: {
    skip: "Skip to content", home: "guh. — Gustavo Costa, home", profile: "About Gustavo Costa",
    navigation: "Main navigation", language: "Language", projects: "Projects", experience: "Experience", about: "About me",
    resume: "Resume", talk: "Let's talk", theme: "Switch between light and dark mode",
    footer: "Made by Guh. Always a work in progress.", source: "Source code",
  },
  profile: {
    focus: "AI engineering.", bio: "Agents, LLMs and open-source tools, backed by experience in React Native and frontend development.",
    current: "Tech Anchor at Thoughtworks", availability: "Available for freelance work", location: "São Sebastião, SP · Brazil",
  },
  projectSection: {
    title: "AI & open source", description: "Agents, context and tools I build and share.",
    viewAll: "View all", filter: "Filter projects", filters: { all: "All", ai: "AI", tools: "Tools" },
    open: "Open", openLabel: "Open {project} on GitHub", starsLabel: "{count} stars for {project} on GitHub",
    starsChecked: "Stars checked on {date}", checked: "GitHub stars · checked on",
    results: "{count} projects shown.", commandHint: "See what can be cleaned before deciding.",
  },
  projects: {
    "b3analysis": { detail: "Teams of specialized agents that research and cross-reference public B3 market data with Claude Code. A hands-on project in AI orchestration and analysis.", technology: "Python · Agent orchestration" },
    "claude-mega-brain": { detail: "Project context available from the start of every Claude Code session. A knowledge base for agents that need to understand your code.", technology: "Python · Context engineering" },
    "mac-cleaner-cli": { detail: "Free up space on your Mac by cleaning caches, logs and development files, straight from the terminal.", technology: "TypeScript · macOS" },
    "brasilapi-sdk": { detail: "Brazilian postal codes, company records, banks and more in a typed, easy-to-use TypeScript SDK.", technology: "TypeScript · SDK" },
    "windows-cleaner-cli": { detail: "An open-source CLI for cleaning caches and temporary files on Windows.", technology: "CLI · Windows" },
  },
  experience: {
    description: "Real software, built together.", earlier: "Earlier on",
    jobs: [
      { company: "Thoughtworks", role: "Tech Anchor · Mobile & Frontend", period: "2022 — present", summary: "From the beginnings of LatamPass to technical leadership on an app used by millions.", details: "Helped define the architecture, engineering standards and CI/CD from the app's inception. Led more than eight engineers across Brazil and Chile through TDD, code reviews and mentoring. The work brought test coverage above 80% and reduced pipeline time by approximately 35%.", progression: "Mobile Engineer → Technical Lead → Tech Anchor" },
      { company: "RecargaPay", role: "Mobile Developer", period: "2022", summary: "Payments and mobile features for a fintech serving over 18,000 concurrent users.", details: "Built and improved React Native features for iOS and Android. Worked on app stability and library upgrades in collaboration with a cross-functional team.", progression: "React Native · iOS · Android" },
      { company: "Descomplica", role: "Mobile Developer", period: "2021 — 2022", summary: "Built an app from scratch to help students access higher education.", details: "Worked with React Native, TypeScript, GraphQL and Node.js, collaborating with product and design and delivering continuously through Bitrise. Also helped maintain and improve a second application.", progression: "React Native · TypeScript · GraphQL" },
    ],
    previous: [
      { company: "Equal", period: "2019–2021", description: "A web and mobile financial management platform for small businesses." },
      { company: "LEMAF / UFLA", period: "2018–2019", description: "Environmental management systems, web applications and tools for fieldwork." },
      { company: "Comp Júnior", period: "2017–2018", description: "First projects, websites and learning as part of a team." },
    ],
  },
  about: {
    title: "A little about me",
    paragraphs: [
      "You can call me Guh. I'm a software engineer based in São Sebastião, Brazil. My focus today is AI engineering: agents, LLM integrations and tools that turn models into useful products.",
      "My background is in React Native, TypeScript and frontend development. Since 2017, I've built software for education, financial services and loyalty programs. I'm currently a Tech Anchor at Thoughtworks, working on architecture, delivery and technical leadership.",
      "In open source, I explore agent orchestration and context for coding assistants, alongside tools I use every day. I enjoy sharing what works and improving projects with the community.",
    ],
    education: "Education", degree: "BSc in Computer Science · UFLA", languages: "Languages", spoken: "Portuguese · English · Spanish",
    contact: "Have a project in mind?", freelance: "Available for freelance AI, React Native and frontend projects.",
  },
  copy: {
    email: "Copy email", emailDone: "Email copied!", emailError: "Select the email address to copy it",
    command: "Copy scan command", commandDone: "Command copied", commandError: "Select the command to copy it",
  },
};
