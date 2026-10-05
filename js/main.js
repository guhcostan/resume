/* ==========================================================================
   Gustavo Costa (Guh) — comportamento do site
   JavaScript estático, sem dependências.
   Responsabilidades:
   1. Troca de idioma (PT/EN) com metadados coerentes (title, description,
      canonical, Open Graph, Twitter Card, JSON-LD, alt e aria-label)
   2. Tema claro/escuro com persistência e contraste garantido
   3. Menu móvel acessível e seção ativa no menu
   O movimento (entrada do hero e revelação ao rolar) é feito só em CSS,
   com degradação segura: o conteúdo nunca fica escondido.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var SITE = 'https://guhcostan.dev';
  var BASE = SITE + '/';
  var URLS = { 'pt-BR': BASE, en: BASE + '?lang=en' };

  // Metadados por página (no blog, cada post tem seu próprio title/description).
  var pageI18n = null;
  try {
    var pageI18nEl = document.getElementById('page-i18n');
    if (pageI18nEl) pageI18n = JSON.parse(pageI18nEl.textContent);
  } catch (e) {}

  // Canonical/og:url derivados da URL real da página (não do idioma exibido),
  // para funcionar igualmente na home e nos posts do blog.
  function pageUrl(locale) {
    var origin = location.origin && location.origin !== 'null' ? location.origin : SITE;
    return origin + location.pathname + (locale === 'en' ? '?lang=en' : '');
  }

  /* ---------------- Conteúdo por idioma (metadados e JSON-LD) ------------- */
  var I18N = {
    'pt-BR': {
      lang: 'pt-BR',
      ogLocale: 'pt_BR',
      title: 'Gustavo Costa (Guh) — Engenheiro mobile e frontend',
      description:
        'Guh (Gustavo Costa), engenheiro mobile e frontend. Tech Anchor na Thoughtworks, à frente do LatamPass. 8+ anos de React Native, TypeScript e IA.',
      jobTitle: 'Lead Mobile & Frontend Engineer',
      personDescription:
        'Engenheiro mobile e frontend com 8+ anos fazendo apps usados por milhões de pessoas. Tech Anchor na Thoughtworks, responsável pela direção técnica do app LatamPass, com IA em produção desde 2024.',
      profileName: 'Gustavo Costa (Guh): currículo e portfólio',
      alumni: 'Universidade Federal de Lavras',
      knows: ['Português', 'Inglês', 'Espanhol'],
      imageAlt: 'Retrato ilustrado em preto e branco de Gustavo Costa (Guh)',
      faq: [
        [
          "Quem é o Guh?",
          "Comecei em 2017, fazendo sites como trainee na Comp Júnior. De lá passei por sistemas ambientais do governo, gestão financeira, educação e pagamentos até chegar ao mobile em grande escala. Na Thoughtworks, fui um dos primeiros engenheiros do app LatamPass. Ajudei a definir arquitetura, padrões e CI/CD desde o primeiro dia, liderei um time de 8+ pessoas entre Brasil e Chile e hoje cuido da direção técnica do produto. Gosto de software rápido, confiável e fácil de manter, que entrega valor e não só feature. Desde o fim de 2024 também trabalho com IA: features com LLMs no produto e agentes que aceleram o dia a dia do time. Nas horas vagas, mantenho ferramentas open source."
        ],
        [
          "Com quais tecnologias o Guh trabalha?",
          "Gustavo Costa (Guh) trabalha principalmente com React Native e TypeScript em apps iOS e Android, e com React e Next.js na web. Em experiências anteriores usou Node.js, Java, Spring, .NET Core, GraphQL e PostgreSQL no backend. A entrega se apoia em CI/CD com Bitrise e Jenkins, TDD e Clean Code e, desde o fim de 2024, em LLMs e agentes de IA com Claude e Cursor."
        ],
        [
          "Onde o Guh estudou?",
          "Gustavo Costa (Guh) é bacharel em Ciência da Computação pela Universidade Federal de Lavras (UFLA), onde estudou de 2015 a 2019; começou a trabalhar como desenvolvedor em 2017, ainda na graduação. Também tem certificações em arquitetura de software, DevOps, Scrum, escuta ativa e autoliderança."
        ]
      ],
      openSourceName: 'Projetos open source de Gustavo Costa (Guh)',
      openSource: [
        {
          name: 'mac-cleaner-cli',
          repo: 'https://github.com/guhcostan/mac-cleaner-cli',
          lang: 'TypeScript',
          desc: 'Libera espaço no Mac com um comando: caches, logs e sobras de Homebrew e Xcode. Alternativa open source ao CleanMyMac.'
        },
        {
          name: 'b3analysis',
          repo: 'https://github.com/guhcostan/b3analysis',
          lang: 'Python',
          desc: 'Agente de análise de ações da B3 feito com Claude Code, sem API keys.'
        },
        {
          name: 'claude-mega-brain',
          repo: 'https://github.com/guhcostan/claude-mega-brain',
          lang: 'Python',
          desc: 'Plugin que dá ao Claude Code a base de conhecimento do seu projeto em toda sessão.'
        },
        {
          name: 'windows-cleaner-cli',
          repo: 'https://github.com/guhcostan/windows-cleaner-cli',
          lang: 'JavaScript',
          desc: 'Limpa caches e arquivos temporários do Windows direto do terminal.'
        },
        {
          name: 'brasilapi-sdk',
          repo: 'https://github.com/guhcostan/brasilapi-sdk',
          lang: 'TypeScript',
          desc: 'SDK tipado para a BrasilAPI: CEP, CNPJ, bancos, FIPE e IBGE.'
        }
      ]
    },
    en: {
      lang: 'en',
      ogLocale: 'en_US',
      title: 'Gustavo Costa (Guh) — Mobile & frontend engineer',
      description:
        "Guh (Gustavo Costa), mobile & frontend engineer. Tech Anchor at Thoughtworks, leading LatamPass. 8+ years of React Native, TypeScript and AI.",
      jobTitle: 'Lead Mobile & Frontend Engineer',
      personDescription:
        "Mobile and frontend engineer with 8+ years building apps used by millions of people. Tech Anchor at Thoughtworks, leading the technical direction of the LatamPass app, with AI in production since 2024.",
      profileName: 'Gustavo Costa (Guh): résumé and portfolio',
      alumni: 'Federal University of Lavras',
      knows: ['Portuguese', 'English', 'Spanish'],
      imageAlt: 'Black and white illustrated portrait of Gustavo Costa (Guh)',
      faq: [
        [
          "Who is Guh?",
          "I started in 2017, building websites as a trainee at Comp Júnior. From there I worked on government environmental systems, financial management, education and payments before landing in mobile at scale. At Thoughtworks I was one of the founding engineers of the LatamPass app. I helped set the architecture, standards and CI/CD from day one, led a team of 8+ people across Brazil and Chile, and now own the product's technical direction. I care about software that is fast, reliable and easy to maintain, and that delivers value rather than just features. Since late 2024 I've also been working with AI: LLM-powered features in the product and agents that speed up the team's day-to-day. On the side, I maintain open source tools."
        ],
        [
          "What technologies does Guh work with?",
          "Gustavo Costa (Guh) works mainly with React Native and TypeScript on iOS and Android apps, and with React and Next.js on the web. In previous roles he used Node.js, Java, Spring, .NET Core, GraphQL and PostgreSQL on the backend. His delivery relies on CI/CD with Bitrise and Jenkins, TDD and Clean Code and, since late 2024, LLMs and AI agents with Claude and Cursor."
        ],
        [
          "Where did Guh study?",
          "Gustavo Costa (Guh) holds a BSc in Computer Science from the Federal University of Lavras (UFLA), where he studied from 2015 to 2019; he started working as a developer in 2017, while still in college. He also holds certifications in software architecture, DevOps, Scrum, active listening and self-leadership."
        ]
      ],
      openSourceName: 'Open source projects by Gustavo Costa (Guh)',
      openSource: [
        {
          name: 'mac-cleaner-cli',
          repo: 'https://github.com/guhcostan/mac-cleaner-cli',
          lang: 'TypeScript',
          desc: 'Frees up space on your Mac with one command: caches, logs, and Homebrew and Xcode leftovers. An open source alternative to CleanMyMac.'
        },
        {
          name: 'b3analysis',
          repo: 'https://github.com/guhcostan/b3analysis',
          lang: 'Python',
          desc: 'A Brazilian stock (B3) analysis agent built with Claude Code, no API keys needed.'
        },
        {
          name: 'claude-mega-brain',
          repo: 'https://github.com/guhcostan/claude-mega-brain',
          lang: 'Python',
          desc: "A plugin that gives Claude Code your project's knowledge base in every session."
        },
        {
          name: 'windows-cleaner-cli',
          repo: 'https://github.com/guhcostan/windows-cleaner-cli',
          lang: 'JavaScript',
          desc: 'Clears Windows caches and temp files straight from the terminal.'
        },
        {
          name: 'brasilapi-sdk',
          repo: 'https://github.com/guhcostan/brasilapi-sdk',
          lang: 'TypeScript',
          desc: 'A typed SDK for BrasilAPI: postal codes, company IDs, banks, FIPE and IBGE data.'
        }
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
            'https://www.npmjs.com/~guhcostan'
          ]
        },
        {
          '@type': 'WebSite',
          '@id': BASE + '#website',
          name: 'Gustavo Costa (Guh)',
          alternateName: 'guhcostan.dev',
          url: BASE,
          inLanguage: ['pt-BR', 'en'],
          publisher: { '@id': personId }
        },
        {
          '@type': 'ProfilePage',
          '@id': BASE + '#profilepage',
          name: M.profileName,
          url: URLS[locale],
          inLanguage: ['pt-BR', 'en'],
          isPartOf: { '@id': BASE + '#website' },
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
    var M = (pageI18n && pageI18n[locale]) || I18N[locale];
    var url = pageUrl(locale);

    document.title = M.title;
    setMeta('meta[name="description"]', 'content', M.description);
    setMeta('link[rel="canonical"]', 'href', url);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[property="og:locale"]', 'content', locale === 'en' ? 'en_US' : 'pt_BR');
    setMeta('meta[property="og:title"]', 'content', M.title);
    setMeta('meta[property="og:description"]', 'content', M.description);
    setMeta('meta[name="twitter:title"]', 'content', M.title);
    setMeta('meta[name="twitter:description"]', 'content', M.description);
    if (M.imageAlt) {
      setMeta('meta[property="og:image:alt"]', 'content', M.imageAlt);
      setMeta('meta[name="twitter:image:alt"]', 'content', M.imageAlt);
    }

    // O grafo Person só existe na home; no blog o JSON-LD é próprio do post.
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

  function setLocale(locale) {
    if (!I18N[locale]) locale = 'pt-BR';
    root.setAttribute('data-locale', locale);
    root.setAttribute('lang', I18N[locale].lang);

    // Mantém a URL coerente com o idioma exibido — e, portanto, com o
    // canonical e o og:url. A raiz é sempre pt-BR; o inglês vive em ?lang=en.
    // Isso evita canonical instável para buscadores (que chegam sem localStorage).
    if (window.history && window.history.replaceState) {
      try {
        var target = locale === 'en' ? '?lang=en' : location.pathname;
        window.history.replaceState({}, '', target + location.hash);
      } catch (e) {}
    }

    syncLanguage();
    try { localStorage.setItem('guh-locale', locale); } catch (e) {}
  }

  /* ---------------- Logo por tema (tinta preta no claro, branca no escuro) */
  function applyLogo(theme) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-logo]'), function (img) {
      var src = theme === 'dark' ? img.getAttribute('data-src-dark') : img.getAttribute('data-src-light');
      var srcset = theme === 'dark' ? img.getAttribute('data-srcset-dark') : img.getAttribute('data-srcset-light');
      if (srcset && img.getAttribute('srcset') !== srcset) img.setAttribute('srcset', srcset);
      if (src && img.getAttribute('src') !== src) img.setAttribute('src', src);
    });
  }

  /* ---------------- Tema ------------------------------------------------- */
  function setTheme(theme, persist) {
    currentTheme = theme === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', currentTheme);
    setMeta('meta[name="theme-color"]', 'content', currentTheme === 'dark' ? '#0a0a0a' : '#fafafa');
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

  /* ---------------- Seção ativa no menu (só na home) --------------------- */
  // Marca com aria-current="location" o link da seção visível. No blog o
  // link ativo já vem com aria-current="page" do build e nada é alterado.
  function initScrollSpy() {
    if (!('IntersectionObserver' in window)) return;
    var links = {};
    Array.prototype.forEach.call(document.querySelectorAll('.nav a[href^="#"]'), function (link) {
      var section = document.getElementById(link.getAttribute('href').slice(1));
      if (section) links[section.id] = { link: link, section: section };
    });
    var ids = Object.keys(links);
    if (!ids.length) return;

    var visible = {};
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { visible[entry.target.id] = entry.isIntersecting; });
      var active = null;
      ids.forEach(function (id) { if (!active && visible[id]) active = id; });
      ids.forEach(function (id) {
        if (id === active) links[id].link.setAttribute('aria-current', 'location');
        else links[id].link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-35% 0px -60% 0px' });

    ids.forEach(function (id) { observer.observe(links[id].section); });
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
        setLocale(btn.getAttribute('data-lang-btn'));
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
    setLocale(root.getAttribute('data-locale') === 'en' ? 'en' : 'pt-BR');

    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());

    initMenu();
    initScrollSpy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
