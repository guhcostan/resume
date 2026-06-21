export type Locale = "en" | "pt";

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location?: string;
  bullets: string[];
}

export interface SkillGroup {
  title: string;
  skills: string[];
}

export type TerminalLineKind =
  | "command"
  | "thinking"
  | "output"
  | "success";

export interface TerminalLine {
  kind: TerminalLineKind;
  text: string;
}

export interface ContentShape {
  nav: {
    about: string;
    experience: string;
    skills: string;
    projects: string;
    education: string;
    contact: string;
  };
  hero: {
    greeting: string;
    name: string;
    title: string;
    location: string;
    tagline: string;
    aiHighlight: string;
    ctaEmail: string;
    ctaResume: string;
    ctaPdf: string;
  };
  terminal: {
    prompt: string;
    replay: string;
    lines: TerminalLine[];
  };
  about: {
    heading: string;
    paragraphs: string[];
  };
  experience: {
    heading: string;
    present: string;
    items: ExperienceItem[];
  };
  skills: {
    heading: string;
    groups: SkillGroup[];
  };
  projects: {
    heading: string;
    subtitle: string;
    items: {
      name: string;
      description: string;
      meta: string;
      href: string;
    }[];
  };
  education: {
    heading: string;
    degree: string;
    school: string;
    period: string;
    certsHeading: string;
    certs: string[];
    languagesHeading: string;
    languages: { name: string; level: string }[];
  };
  contact: {
    heading: string;
    subtitle: string;
    emailLabel: string;
  };
  footer: {
    built: string;
  };
}

const shared = {
  name: "Gustavo Costa",
  location: "São Sebastião, São Paulo, Brazil",
  email: "guhcostan@gmail.com",
  phone: "+55 35 99878-5953",
  links: {
    linkedin: "https://www.linkedin.com/in/guhcostan",
    github: "https://github.com/guhcostan",
  },
};

export const profile = shared;

export const content: Record<Locale, ContentShape> = {
  en: {
    nav: {
      about: "About",
      experience: "Experience",
      skills: "Skills",
      projects: "Open Source",
      education: "Education",
      contact: "Contact",
    },
    hero: {
      greeting: "Hi, I'm",
      name: shared.name,
      title:
        "Lead Mobile & Frontend Engineer · React Native · TypeScript · AI-Powered Features & Agents",
      location: shared.location,
      tagline:
        "8+ years building apps used by millions — from airline loyalty to EdTech and fintech. Tech Anchor @ Thoughtworks.",
      aiHighlight:
        "Now focused on AI-assisted engineering: shipping LLM-powered features and autonomous agents in production.",
      ctaEmail: "Get in touch",
      ctaResume: "View LinkedIn",
      ctaPdf: "Download PDF",
    },
    terminal: {
      prompt: "gustavo@portfolio ~ %",
      replay: "replay",
      lines: [
        { kind: "command", text: "ai whoami --as-agent" },
        { kind: "thinking", text: "✦ Thinking…" },
        { kind: "output", text: "Lead Mobile & Frontend Engineer @ Thoughtworks" },
        { kind: "output", text: "8+ years shipping apps used by millions of people" },
        { kind: "output", text: "stack: React Native · TypeScript · Next.js · Node.js" },
        { kind: "output", text: "now: building LLM features & autonomous agents 🤖" },
        { kind: "output", text: "open source: mac-cleaner-cli — 1.5k+ ⭐" },
        { kind: "success", text: "✓ done — let's build something together" },
      ],
    },
    about: {
      heading: "About",
      paragraphs: [
        "Mobile & Frontend Engineer with 8+ years building apps used by millions, across airline loyalty, EdTech, and fintech. As Tech Anchor at Thoughtworks, I steer the technical direction of a global-scale React Native product, working across Brazil and Chile.",
        "One of the founding engineers on the LatamPass mobile app — I helped define the architecture, tech standards, and CI/CD from day one, led a cross-functional team of 8+ engineers, and grew a strong TDD and code-review culture.",
        "Since late 2024, my focus has expanded into AI-assisted engineering — building AI-powered features, integrating LLMs into production, and developing autonomous agents to accelerate development workflows, working hands-on with tools like Claude and Cursor. On the side, I ship open source developer tools for fun.",
      ],
    },
    experience: {
      heading: "Experience",
      present: "Present",
      items: [
        {
          company: "Thoughtworks",
          role: "Tech Anchor",
          period: "Dec 2024 — Present",
          bullets: [
            "Drive the technical direction of the LatamPass mobile app, one of Latin America's largest airline loyalty platforms.",
            "Lead AI-assisted engineering: building AI-powered features, integrating LLMs into the product, and developing autonomous agents to accelerate delivery.",
            "Work hands-on with tools like Claude and Cursor to bring AI capabilities directly into production.",
          ],
        },
        {
          company: "Thoughtworks",
          role: "Technical Lead",
          period: "Apr 2023 — Present",
          location: "Brazil",
          bullets: [
            "Led a cross-functional React Native team of 8+ engineers across Brazil and Chile from day one.",
            "Defined architecture, tech standards, and CI/CD pipelines for a greenfield, global-scale product.",
            "Raised test coverage to 80%+ through TDD practices and a strong code-review culture.",
            "Reduced CI/CD pipeline runtime by ~35% (Bitrise + Jenkins).",
            "Mentored engineers through 1:1s, pairing, and technical coaching in an Agile/XP environment.",
          ],
        },
        {
          company: "Thoughtworks",
          role: "Mobile Engineer",
          period: "May 2022 — Jul 2023",
          location: "São Paulo, Brazil",
          bullets: [
            "Built and shipped core React Native features for iOS and Android, serving millions of users.",
            "Drove Clean Code and TDD practices that became team standards.",
            "Integrated Firebase Crashlytics, improving error visibility and incident response.",
            "Contributed to performance optimizations on high-traffic user flows.",
          ],
        },
        {
          company: "RecargaPay",
          role: "Mobile Developer",
          period: "Jan 2022 — May 2022",
          bullets: [
            "Built and shipped new features for a fintech app serving 18,000+ concurrent users on iOS and Android.",
            "Maintained and improved existing functionality to enhance the user experience.",
            "Ensured app security by keeping dependencies and libraries up to date.",
          ],
        },
        {
          company: "Descomplica",
          role: "Mobile Developer",
          period: "Feb 2021 — Jan 2022",
          bullets: [
            "Built the Descomplica EdTech app from scratch, achieving strong App Store and Play Store ratings.",
            "Worked with React Native, TypeScript, GraphQL, and Node.js in a full-stack mobile context.",
            "Delivered consistent releases through a Bitrise CI/CD pipeline.",
          ],
        },
        {
          company: "Equal — Smart Financial Management",
          role: "Web & Mobile Developer",
          period: "Aug 2019 — Feb 2021",
          location: "Lavras, Minas Gerais",
          bullets: [
            "Built a financial management platform for small businesses using React Native, React.js, and TypeScript.",
            "Developed payment flows, invoicing, and financial reporting features.",
            "Worked with Node.js and Java on backend integrations and APIs.",
          ],
        },
        {
          company: "LEMAF — Forest Management Lab",
          role: "Web Developer & Architect",
          period: "Feb 2018 — Aug 2019",
          location: "Lavras, Minas Gerais",
          bullets: [
            "Architected government-grade platforms for forest and environmental management in Brazil.",
            "Delivered SICAR/PA (Environmental Rural Registry) and SIGERH-PA (Water Resources System).",
            "Worked with .NET Core, Spring Framework, Node.js, React.js, Vue.js, and TypeScript applying clean architecture.",
          ],
        },
        {
          company: "Comp Júnior",
          role: "Trainee Developer",
          period: "Nov 2017 — Jan 2018",
          location: "Lavras, Brazil",
          bullets: [
            "Collaborated on team organization and the development of static websites, gaining early frontend experience.",
          ],
        },
      ],
    },
    skills: {
      heading: "Skills",
      groups: [
        { title: "Mobile", skills: ["React Native", "iOS", "Android"] },
        { title: "Frontend", skills: ["React", "Next.js", "TypeScript", "JavaScript"] },
        { title: "Backend", skills: ["Node.js", "GraphQL", "REST APIs", "Firebase"] },
        { title: "DevOps & Tooling", skills: ["CI/CD", "Bitrise", "Jenkins", "Git"] },
        { title: "AI Engineering", skills: ["LLM Integration", "AI Agents", "Claude", "Cursor"] },
        { title: "Practices", skills: ["TDD", "Clean Architecture", "Agile / XP", "Code Review"] },
      ],
    },
    projects: {
      heading: "Open Source",
      subtitle: "I ship developer tools for fun on the side.",
      items: [
        {
          name: "mac-cleaner-cli",
          description:
            "A fast command-line tool to free up disk space on macOS by cleaning caches, logs, and junk files.",
          meta: "1.5k+ ⭐ on GitHub",
          href: "https://github.com/guhcostan",
        },
      ],
    },
    education: {
      heading: "Education",
      degree: "BSc in Computer Science",
      school: "Federal University of Lavras (UFLA)",
      period: "2015 — 2019",
      certsHeading: "Certifications",
      certs: [
        "DevOps Essentials Professional Certificate (DEPCP)",
        "Scrum Foundations Professional Certificate (SFPC)",
        "Software Architecture Fundamentals",
        "Self-Leadership (Autoliderança)",
        "Active Listening: You Can Be a Great Listener",
      ],
      languagesHeading: "Languages",
      languages: [
        { name: "Portuguese", level: "Native" },
        { name: "English", level: "Professional Working" },
        { name: "Spanish", level: "Professional Working" },
      ],
    },
    contact: {
      heading: "Let's talk",
      subtitle:
        "Open to interesting problems in mobile, frontend, and AI engineering. Reach out and let's build something.",
      emailLabel: "Email me",
    },
    footer: {
      built: "Built with Next.js, TypeScript & Tailwind CSS.",
    },
  },
  pt: {
    nav: {
      about: "Sobre",
      experience: "Experiência",
      skills: "Habilidades",
      projects: "Open Source",
      education: "Formação",
      contact: "Contato",
    },
    hero: {
      greeting: "Olá, eu sou",
      name: shared.name,
      title:
        "Lead Mobile & Frontend Engineer · React Native · TypeScript · Features & Agentes com IA",
      location: shared.location,
      tagline:
        "8+ anos construindo apps usados por milhões — de fidelidade aérea a EdTech e fintech. Tech Anchor @ Thoughtworks.",
      aiHighlight:
        "Hoje focado em engenharia assistida por IA: entregando features com LLMs e agentes autônomos em produção.",
      ctaEmail: "Fale comigo",
      ctaResume: "Ver LinkedIn",
      ctaPdf: "Baixar PDF",
    },
    terminal: {
      prompt: "gustavo@portfolio ~ %",
      replay: "repetir",
      lines: [
        { kind: "command", text: "ai whoami --as-agent" },
        { kind: "thinking", text: "✦ Pensando…" },
        { kind: "output", text: "Lead Mobile & Frontend Engineer @ Thoughtworks" },
        { kind: "output", text: "8+ anos entregando apps usados por milhões de pessoas" },
        { kind: "output", text: "stack: React Native · TypeScript · Next.js · Node.js" },
        { kind: "output", text: "agora: criando features com LLMs e agentes autônomos 🤖" },
        { kind: "output", text: "open source: mac-cleaner-cli — 1.5k+ ⭐" },
        { kind: "success", text: "✓ pronto — vamos construir algo juntos" },
      ],
    },
    about: {
      heading: "Sobre",
      paragraphs: [
        "Engenheiro Mobile & Frontend com mais de 8 anos construindo apps usados por milhões de pessoas, em fidelidade aérea, EdTech e fintech. Como Tech Anchor na Thoughtworks, conduzo a direção técnica de um produto React Native de escala global, atuando entre Brasil e Chile.",
        "Um dos engenheiros fundadores do app LatamPass — ajudei a definir a arquitetura, os padrões técnicos e o CI/CD desde o primeiro dia, liderei um time multifuncional de mais de 8 engenheiros e construí uma forte cultura de TDD e code review.",
        "Desde o fim de 2024, meu foco se expandiu para engenharia assistida por IA — criando features com IA, integrando LLMs em produção e desenvolvendo agentes autônomos para acelerar o desenvolvimento, trabalhando com ferramentas como Claude e Cursor. Nas horas vagas, lanço ferramentas open source para devs.",
      ],
    },
    experience: {
      heading: "Experiência",
      present: "Atual",
      items: [
        {
          company: "Thoughtworks",
          role: "Tech Anchor",
          period: "Dez 2024 — Atual",
          bullets: [
            "Conduzo a direção técnica do app LatamPass, uma das maiores plataformas de fidelidade aérea da América Latina.",
            "Lidero a engenharia assistida por IA: criando features com IA, integrando LLMs ao produto e desenvolvendo agentes autônomos para acelerar a entrega.",
            "Trabalho diretamente com ferramentas como Claude e Cursor para levar capacidades de IA à produção.",
          ],
        },
        {
          company: "Thoughtworks",
          role: "Technical Lead",
          period: "Abr 2023 — Atual",
          location: "Brasil",
          bullets: [
            "Liderei um time multifuncional de React Native com mais de 8 engenheiros entre Brasil e Chile desde o início.",
            "Defini arquitetura, padrões técnicos e pipelines de CI/CD para um produto greenfield de escala global.",
            "Elevei a cobertura de testes para 80%+ com práticas de TDD e forte cultura de code review.",
            "Reduzi o tempo do pipeline de CI/CD em ~35% (Bitrise + Jenkins).",
            "Mentorei engenheiros com 1:1s, pareamento e coaching técnico em ambiente Ágil/XP.",
          ],
        },
        {
          company: "Thoughtworks",
          role: "Mobile Engineer",
          period: "Mai 2022 — Jul 2023",
          location: "São Paulo, Brasil",
          bullets: [
            "Construí e entreguei features core em React Native para iOS e Android, atendendo milhões de usuários.",
            "Promovi práticas de Clean Code e TDD que se tornaram padrão do time.",
            "Integrei o Firebase Crashlytics, melhorando a visibilidade de erros e a resposta a incidentes.",
            "Contribuí para otimizações de performance em fluxos de alto tráfego.",
          ],
        },
        {
          company: "RecargaPay",
          role: "Desenvolvedor Mobile",
          period: "Jan 2022 — Mai 2022",
          bullets: [
            "Construí e entreguei novas features para um app fintech com mais de 18.000 usuários simultâneos no iOS e Android.",
            "Mantive e aprimorei funcionalidades existentes para melhorar a experiência do usuário.",
            "Garanti a segurança do app mantendo dependências e bibliotecas atualizadas.",
          ],
        },
        {
          company: "Descomplica",
          role: "Desenvolvedor Mobile",
          period: "Fev 2021 — Jan 2022",
          bullets: [
            "Construí o app EdTech da Descomplica do zero, alcançando ótimas avaliações na App Store e Play Store.",
            "Trabalhei com React Native, TypeScript, GraphQL e Node.js em um contexto mobile full-stack.",
            "Entreguei releases consistentes através de um pipeline de CI/CD com Bitrise.",
          ],
        },
        {
          company: "Equal — Gestão Financeira Inteligente",
          role: "Desenvolvedor Web & Mobile",
          period: "Ago 2019 — Fev 2021",
          location: "Lavras, Minas Gerais",
          bullets: [
            "Construí uma plataforma de gestão financeira para pequenos negócios com React Native, React.js e TypeScript.",
            "Desenvolvi fluxos de pagamento, faturamento e relatórios financeiros.",
            "Trabalhei com Node.js e Java em integrações de backend e APIs.",
          ],
        },
        {
          company: "LEMAF — Lab. de Manejo Florestal",
          role: "Desenvolvedor Web & Arquiteto",
          period: "Fev 2018 — Ago 2019",
          location: "Lavras, Minas Gerais",
          bullets: [
            "Arquitetei plataformas de nível governamental para gestão florestal e ambiental no Brasil.",
            "Entreguei o SICAR/PA (Cadastro Ambiental Rural) e o SIGERH-PA (Sistema de Recursos Hídricos).",
            "Trabalhei com .NET Core, Spring Framework, Node.js, React.js, Vue.js e TypeScript aplicando arquitetura limpa.",
          ],
        },
        {
          company: "Comp Júnior",
          role: "Desenvolvedor Trainee",
          period: "Nov 2017 — Jan 2018",
          location: "Lavras, Brasil",
          bullets: [
            "Colaborei na organização do time e no desenvolvimento de sites estáticos, ganhando experiência inicial em frontend.",
          ],
        },
      ],
    },
    skills: {
      heading: "Habilidades",
      groups: [
        { title: "Mobile", skills: ["React Native", "iOS", "Android"] },
        { title: "Frontend", skills: ["React", "Next.js", "TypeScript", "JavaScript"] },
        { title: "Backend", skills: ["Node.js", "GraphQL", "APIs REST", "Firebase"] },
        { title: "DevOps & Ferramentas", skills: ["CI/CD", "Bitrise", "Jenkins", "Git"] },
        { title: "Engenharia de IA", skills: ["Integração de LLMs", "Agentes de IA", "Claude", "Cursor"] },
        { title: "Práticas", skills: ["TDD", "Arquitetura Limpa", "Ágil / XP", "Code Review"] },
      ],
    },
    projects: {
      heading: "Open Source",
      subtitle: "Nas horas vagas, lanço ferramentas para desenvolvedores.",
      items: [
        {
          name: "mac-cleaner-cli",
          description:
            "Uma ferramenta de linha de comando rápida para liberar espaço em disco no macOS, limpando caches, logs e arquivos inúteis.",
          meta: "1.5k+ ⭐ no GitHub",
          href: "https://github.com/guhcostan",
        },
      ],
    },
    education: {
      heading: "Formação",
      degree: "Bacharelado em Ciência da Computação",
      school: "Universidade Federal de Lavras (UFLA)",
      period: "2015 — 2019",
      certsHeading: "Certificações",
      certs: [
        "DevOps Essentials Professional Certificate (DEPCP)",
        "Scrum Foundations Professional Certificate (SFPC)",
        "Software Architecture Fundamentals",
        "Autoliderança",
        "Active Listening: You Can Be a Great Listener",
      ],
      languagesHeading: "Idiomas",
      languages: [
        { name: "Português", level: "Nativo" },
        { name: "Inglês", level: "Profissional" },
        { name: "Espanhol", level: "Profissional" },
      ],
    },
    contact: {
      heading: "Vamos conversar",
      subtitle:
        "Aberto a problemas interessantes em mobile, frontend e engenharia de IA. Entre em contato e vamos construir algo.",
      emailLabel: "Me mande um e-mail",
    },
    footer: {
      built: "Feito com Next.js, TypeScript & Tailwind CSS.",
    },
  },
};
