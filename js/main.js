/* ==========================================================================
   Gustavo Costa (Guh) — comportamento do site
   JavaScript estático, sem dependências.
   Responsabilidades:
   1. Troca de idioma (PT/EN) com metadados coerentes (title, description,
      canonical, Open Graph, Twitter Card, JSON-LD, alt e aria-label)
   2. Tema claro/escuro com persistência e contraste garantido
   3. Menu móvel acessível
   O movimento (entrada do hero e revelação ao rolar) é feito só em CSS,
   com degradação segura: o conteúdo nunca fica escondido.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var BASE = 'https://guhcostan.github.io/resume/';
  var URLS = { 'pt-BR': BASE, en: BASE + '?lang=en' };

  /* ---------------- Conteúdo por idioma (metadados e JSON-LD) ------------- */
  var I18N = {
    'pt-BR': {
      lang: 'pt-BR',
      ogLocale: 'pt_BR',
      title: 'Gustavo Costa (Guh) — Engenheiro Lead Mobile e Frontend',
      description:
        'Currículo de Gustavo Costa (Guh): 8+ anos criando apps usados por milhões. Tech Anchor na Thoughtworks. React Native, TypeScript, iOS, Android e IA em produção.',
      jobTitle: 'Lead Mobile & Frontend Engineer',
      personDescription:
        'Engenheiro Lead de Mobile e Frontend com 8+ anos criando apps usados por milhões, de fidelidade aérea a EdTech e fintech. Tech Anchor na Thoughtworks, conduzindo a direção técnica do app LatamPass e trabalhando com engenharia assistida por IA.',
      profileName: 'Gustavo Costa (Guh): currículo e portfólio',
      alumni: 'Universidade Federal de Lavras',
      knows: ['Português', 'Inglês', 'Espanhol'],
      imageAlt: 'Retrato ilustrado em preto e branco de Gustavo Costa (Guh)',
      openSourceName: 'Projetos open source de Gustavo Costa (Guh)',
      openSource: [
        {
          name: 'mac-cleaner-cli',
          repo: 'https://github.com/guhcostan/mac-cleaner-cli',
          lang: 'TypeScript',
          desc: 'CLI open source para liberar espaço em disco no macOS (caches, logs, Homebrew, Xcode), alternativa ao CleanMyMac.'
        },
        {
          name: 'b3analysis',
          repo: 'https://github.com/guhcostan/b3analysis',
          lang: 'Python',
          desc: 'Agente de análise de ações brasileiras (B3) construído com Claude Code, sem API keys.'
        },
        {
          name: 'claude-mega-brain',
          repo: 'https://github.com/guhcostan/claude-mega-brain',
          lang: 'Python',
          desc: 'Plugin que injeta a base de conhecimento do projeto nas sessões do Claude Code.'
        },
        {
          name: 'brasilapi-sdk',
          repo: 'https://github.com/guhcostan/brasilapi-sdk',
          lang: 'TypeScript',
          desc: 'SDK TypeScript para a BrasilAPI: CEP, CNPJ, bancos, preços FIPE e dados do IBGE.'
        },
        {
          name: 'windows-cleaner-cli',
          repo: 'https://github.com/guhcostan/windows-cleaner-cli',
          lang: 'JavaScript',
          desc: 'CLI open source de limpeza de caches e arquivos temporários para Windows.'
        }
      ],
      faq: [
        [
          'O que você faz hoje?',
          'Sou Tech Anchor na Thoughtworks desde dezembro de 2024, conduzindo a direção técnica do app LatamPass, uma das maiores plataformas de fidelidade aérea da América Latina. Desde o fim de 2024 meu foco inclui engenharia assistida por IA: features com IA, integração de LLMs em produtos em produção e agentes autônomos.'
        ],
        [
          'Há quanto tempo você trabalha com desenvolvimento?',
          'Mais de 8 anos. Desde 2017 passei por Comp Júnior, LEMAF, Equal, Descomplica, RecargaPay e Thoughtworks, construindo apps usados por milhões de usuários em iOS e Android.'
        ],
        [
          'Quais tecnologias você usa no dia a dia?',
          'React Native, TypeScript, iOS, Android, React, Next.js, Node.js, Firebase e CI/CD com Bitrise e Jenkins. Em experiências anteriores também GraphQL, Vue.js, AngularJS, Spring Framework, .NET Core, Java e PostgreSQL.'
        ],
        [
          'Você tem experiência liderando equipes?',
          'Sim. Liderei uma equipe multifuncional de 8+ engenheiros no Brasil e no Chile, defini arquitetura, padrões técnicos e pipelines de CI/CD em um projeto greenfield, elevei a cobertura de testes para 80%+ com TDD e code review e mentorei engenheiros em 1:1s, pairing e coaching técnico.'
        ],
        [
          'Você trabalha com inteligência artificial?',
          'Desde o fim de 2024. Construo features com IA, integro LLMs em produtos em produção e desenvolvo agentes autônomos para acelerar fluxos de trabalho de desenvolvimento, com ferramentas como Claude e Cursor.'
        ],
        [
          'Quais idiomas você fala?',
          'Português nativo, inglês e espanhol em nível profissional (Professional Working).'
        ],
        [
          'Onde vejo seu currículo completo e seu código?',
          'O currículo completo em PDF está no link Baixar currículo (guhcostan.github.io/resume/files/gustavo-costa-curriculo.pdf) e o código aberto está no GitHub em github.com/guhcostan.'
        ]
      ]
    },
    en: {
      lang: 'en',
      ogLocale: 'en_US',
      title: 'Gustavo Costa (Guh) — Lead Mobile & Frontend Engineer',
      description:
        "Gustavo Costa (Guh) résumé: 8+ years building apps used by millions. Tech Anchor at Thoughtworks. React Native, TypeScript, iOS, Android and AI in production.",
      jobTitle: 'Lead Mobile & Frontend Engineer',
      personDescription:
        "Lead Mobile & Frontend Engineer with 8+ years building apps used by millions, from airline loyalty to EdTech and fintech. Tech Anchor at Thoughtworks, steering the technical direction of the LatamPass app and working on AI-assisted engineering.",
      profileName: 'Gustavo Costa (Guh): résumé and portfolio',
      alumni: 'Federal University of Lavras',
      knows: ['Portuguese', 'English', 'Spanish'],
      imageAlt: 'Black and white illustrated portrait of Gustavo Costa (Guh)',
      openSourceName: 'Open source projects by Gustavo Costa (Guh)',
      openSource: [
        {
          name: 'mac-cleaner-cli',
          repo: 'https://github.com/guhcostan/mac-cleaner-cli',
          lang: 'TypeScript',
          desc: 'Open-source macOS CLI to reclaim disk space (caches, logs, Homebrew, Xcode), an alternative to CleanMyMac.'
        },
        {
          name: 'b3analysis',
          repo: 'https://github.com/guhcostan/b3analysis',
          lang: 'Python',
          desc: 'Brazilian stock (B3) analysis agent built with Claude Code, no API keys required.'
        },
        {
          name: 'claude-mega-brain',
          repo: 'https://github.com/guhcostan/claude-mega-brain',
          lang: 'Python',
          desc: "Plugin that injects your project's knowledge base into Claude Code sessions."
        },
        {
          name: 'brasilapi-sdk',
          repo: 'https://github.com/guhcostan/brasilapi-sdk',
          lang: 'TypeScript',
          desc: 'TypeScript SDK for BrasilAPI: postal codes, companies, banks, FIPE and IBGE data.'
        },
        {
          name: 'windows-cleaner-cli',
          repo: 'https://github.com/guhcostan/windows-cleaner-cli',
          lang: 'JavaScript',
          desc: 'Open-source Windows cleaner CLI for caches and temporary files.'
        }
      ],
      faq: [
        [
          'What do you do today?',
          "I have been a Tech Anchor at Thoughtworks since December 2024, driving the technical direction of the LatamPass app, one of Latin America's largest airline loyalty platforms. Since late 2024 my focus also covers AI-assisted engineering: AI-powered features, LLM integration into production products and autonomous agents."
        ],
        [
          'How long have you been building software?',
          'More than 8 years. Since 2017 I have worked at Comp Júnior, LEMAF, Equal, Descomplica, RecargaPay and Thoughtworks, building apps used by millions of users on iOS and Android.'
        ],
        [
          'Which technologies do you work with?',
          'React Native, TypeScript, iOS, Android, React, Next.js, Node.js, Firebase and CI/CD with Bitrise and Jenkins. In previous roles also GraphQL, Vue.js, AngularJS, Spring Framework, .NET Core, Java and PostgreSQL.'
        ],
        [
          'Do you have team leadership experience?',
          'Yes. I led a cross-functional team of 8+ engineers across Brazil and Chile, defined architecture, tech standards and CI/CD pipelines for a greenfield project, raised test coverage to 80%+ with TDD and code review, and mentored engineers through 1:1s, pairing sessions and technical coaching.'
        ],
        [
          'Do you work with AI?',
          'Since late 2024. I build AI-powered features, integrate LLMs into production products and develop autonomous agents to accelerate development workflows, using tools like Claude and Cursor.'
        ],
        [
          'Which languages do you speak?',
          'Native Portuguese, English and Spanish at professional working proficiency.'
        ],
        [
          'Where can I see your full résumé and your code?',
          'The full résumé PDF is available through the Download résumé link (guhcostan.github.io/resume/files/gustavo-costa-curriculo.pdf) and open source code is on GitHub at github.com/guhcostan.'
        ]
      ]
    }
  };

  var currentTheme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  var storedTheme = null;
  try { storedTheme = localStorage.getItem('guh-theme'); } catch (e) {}

  /* ---------------- Utilidades de metadados ------------------------------ */
  function setMeta(selector, attr, value) {
    var el = document.head.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  }

  function buildGraph(locale) {
    var M = I18N[locale];
    var personId = BASE + '#person';
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          '@id': personId,
          name: 'Gustavo Costa',
          alternateName: 'Guh',
          jobTitle: M.jobTitle,
          description: M.personDescription,
          email: 'mailto:guhcostan@gmail.com',
          telephone: '+5535998785953',
          url: BASE,
          image: BASE + 'assets/guh-logo.png',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'São Sebastião',
            addressRegion: 'São Paulo',
            addressCountry: 'BR'
          },
          worksFor: { '@type': 'Organization', name: 'Thoughtworks' },
          alumniOf: { '@type': 'CollegeOrUniversity', name: M.alumni },
          knowsLanguage: M.knows.map(function (name) {
            return { '@type': 'Language', name: name };
          }),
          sameAs: [
            'https://www.linkedin.com/in/guhcostan',
            'https://github.com/guhcostan',
            'https://guhcostan.dev/'
          ]
        },
        {
          '@type': 'ProfilePage',
          '@id': BASE + '#profilepage',
          name: M.profileName,
          url: URLS[locale],
          inLanguage: ['pt-BR', 'en'],
          mainEntity: { '@id': personId }
        },
        {
          '@type': 'FAQPage',
          '@id': BASE + '#faq',
          inLanguage: M.lang,
          mainEntity: M.faq.map(function (item) {
            return {
              '@type': 'Question',
              name: item[0],
              acceptedAnswer: { '@type': 'Answer', text: item[1] }
            };
          })
        },
        {
          '@type': 'ItemList',
          '@id': BASE + '#open-source',
          name: M.openSourceName,
          itemListElement: M.openSource.map(function (project, index) {
            return {
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'SoftwareSourceCode',
                name: project.name,
                description: project.desc,
                codeRepository: project.repo,
                programmingLanguage: project.lang,
                author: { '@id': personId }
              }
            };
          })
        }
      ]
    };
  }

  function syncLanguage() {
    var locale = root.getAttribute('data-locale') === 'en' ? 'en' : 'pt-BR';
    var M = I18N[locale];

    document.title = M.title;
    setMeta('meta[name="description"]', 'content', M.description);
    setMeta('link[rel="canonical"]', 'href', URLS[locale]);
    setMeta('meta[property="og:url"]', 'content', URLS[locale]);
    setMeta('meta[property="og:locale"]', 'content', M.ogLocale);
    setMeta('meta[property="og:title"]', 'content', M.title);
    setMeta('meta[property="og:description"]', 'content', M.description);
    setMeta('meta[property="og:image:alt"]', 'content', M.imageAlt);
    setMeta('meta[name="twitter:title"]', 'content', M.title);
    setMeta('meta[name="twitter:description"]', 'content', M.description);
    setMeta('meta[name="twitter:image:alt"]', 'content', M.imageAlt);

    var ld = document.getElementById('ld-graph');
    if (ld) ld.textContent = JSON.stringify(buildGraph(locale), null, 2);

    Array.prototype.forEach.call(document.querySelectorAll('[data-aria-pt]'), function (el) {
      el.setAttribute('aria-label', el.getAttribute(locale === 'en' ? 'data-aria-en' : 'data-aria-pt'));
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-alt-pt]'), function (el) {
      el.setAttribute('alt', el.getAttribute(locale === 'en' ? 'data-alt-en' : 'data-alt-pt'));
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-lang-btn]'), function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-lang-btn') === locale ? 'true' : 'false');
    });

    renderThemeSwitch();
  }

  /* O switch de tema não usa texto: o estado vive em aria-checked */
  function renderThemeSwitch() {
    var sw = document.querySelector('[data-theme-toggle]');
    if (sw) sw.setAttribute('aria-checked', currentTheme === 'dark' ? 'true' : 'false');
  }

  function setLocale(locale, updateUrl) {
    if (!I18N[locale]) locale = 'pt-BR';
    root.setAttribute('data-locale', locale);
    root.setAttribute('lang', I18N[locale].lang);
    syncLanguage();
    try { localStorage.setItem('guh-locale', locale); } catch (e) {}

    if (updateUrl && window.history && window.history.replaceState) {
      try {
        var target = locale === 'en' ? '?lang=en' : location.pathname;
        window.history.replaceState({}, '', target + location.hash);
      } catch (e) {}
    }
  }

  /* ---------------- Logo por tema (tinta preta no claro, branca no escuro) */
  function applyLogo(theme) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-logo]'), function (img) {
      var src = theme === 'dark' ? img.getAttribute('data-src-dark') : img.getAttribute('data-src-light');
      if (src && img.getAttribute('src') !== src) img.setAttribute('src', src);
    });
  }

  /* ---------------- Tema ------------------------------------------------- */
  function setTheme(theme, persist) {
    currentTheme = theme === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', currentTheme);
    setMeta('meta[name="theme-color"]', 'content', currentTheme === 'dark' ? '#0c0c0c' : '#f4f4f2');
    if (persist) {
      storedTheme = currentTheme;
      try { localStorage.setItem('guh-theme', currentTheme); } catch (e) {}
    }
    applyLogo(currentTheme);
    renderThemeSwitch();
  }

  /* ---------------- Menu móvel ------------------------------------------- */
  function initMenu() {
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('[data-menu-toggle]');
    if (!header || !toggle) return;

    function close() {
      header.setAttribute('data-menu-open', 'false');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      var open = header.getAttribute('data-menu-open') === 'true';
      header.setAttribute('data-menu-open', open ? 'false' : 'true');
      toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') close();
    });

    Array.prototype.forEach.call(document.querySelectorAll('.nav a'), function (link) {
      link.addEventListener('click', close);
    });

    if (window.matchMedia) {
      var desktop = window.matchMedia('(min-width: 900px)');
      var onChange = function (event) { if (event.matches) close(); };
      if (desktop.addEventListener) desktop.addEventListener('change', onChange);
      else if (desktop.addListener) desktop.addListener(onChange);
    }
  }

  /* ---------------- Impressão -------------------------------------------- */
  function initPrint() {
    var opened = [];
    window.addEventListener('beforeprint', function () {
      opened = [];
      Array.prototype.forEach.call(document.querySelectorAll('.faq__item'), function (item) {
        if (!item.open) { opened.push(item); item.open = true; }
      });
    });
    window.addEventListener('afterprint', function () {
      opened.forEach(function (item) { item.open = false; });
      opened = [];
    });
  }

  /* ---------------- Inicialização ---------------------------------------- */
  function init() {
    var themeButton = document.querySelector('[data-theme-toggle]');
    if (themeButton) {
      themeButton.addEventListener('click', function () {
        setTheme(currentTheme === 'dark' ? 'light' : 'dark', true);
      });
    }

    Array.prototype.forEach.call(document.querySelectorAll('[data-lang-btn]'), function (btn) {
      btn.addEventListener('click', function () {
        setLocale(btn.getAttribute('data-lang-btn'), true);
      });
    });

    if (!storedTheme && window.matchMedia) {
      var dark = window.matchMedia('(prefers-color-scheme: dark)');
      var onSchemeChange = function (event) {
        if (!storedTheme) setTheme(event.matches ? 'dark' : 'light', false);
      };
      if (dark.addEventListener) dark.addEventListener('change', onSchemeChange);
      else if (dark.addListener) dark.addListener(onSchemeChange);
    }

    setTheme(currentTheme, false);
    setLocale(root.getAttribute('data-locale') === 'en' ? 'en' : 'pt-BR', false);

    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());

    initMenu();
    initPrint();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
