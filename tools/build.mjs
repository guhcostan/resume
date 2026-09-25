/* ==========================================================================
   Gerador do site guhcostan.dev
   Sem framework: lê Markdown, aplica o "shell" (header/footer do index.html)
   e escreve o site final em dist/. Gera também blog index, RSS e sitemap.

   Uso: npm run build
   ========================================================================== */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const POSTS_DIR = path.join(ROOT, 'content', 'posts');
const SITE = 'https://guhcostan.dev';

const log = (...a) => console.log('[build]', ...a);
const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jsonLd = (obj) => JSON.stringify(obj, null, 2).replace(/</g, '\\u003c');

/* ---------- Markdown ---------- */
marked.setOptions({ gfm: true, breaks: false });

/* ---------- Frontmatter (key: value, arrays com [a, b]) ---------- */
function parseFrontmatter(text) {
  const fm = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (/^\[.*\]$/.test(value)) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((v) => v.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else {
      value = value.replace(/^["']|["']$/g, '');
    }
    fm[key] = value;
  }
  return fm;
}

/* ---------- Separação PT/EN ciente de blocos de código ----------
   O delimitador `<!-- en -->` só conta fora de cercas ``` ou ~~~, para não
   quebrar exemplos de código que mostrem o próprio delimitador. */
function splitLanguages(body) {
  const pt = [];
  const en = [];
  let target = pt;
  let fence = null;
  for (const line of body.split(/\r?\n/)) {
    const m = line.match(/^\s*(`{3,}|~{3,})/);
    if (m) {
      const marker = m[1][0];
      if (!fence) fence = marker;
      else if (marker === fence) fence = null;
    }
    if (!fence && /^\s*<!--\s*en\s*-->\s*$/.test(line)) {
      target = en;
      continue;
    }
    target.push(line);
  }
  return [pt.join('\n'), en.join('\n')];
}

function slugFromFilename(file) {
  return file.replace(/\.mdx?$/i, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

async function readPosts() {
  let files = [];
  try {
    files = (await fs.readdir(POSTS_DIR)).filter((f) => /\.mdx?$/i.test(f));
  } catch {
    log('nenhum diretório content/posts — seguindo sem posts');
  }

  const posts = [];
  for (const file of files) {
    const raw = await fs.readFile(path.join(POSTS_DIR, file), 'utf8');
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!match) throw new Error(`Frontmatter ausente em ${file} (use --- no topo)`);
    const fm = parseFrontmatter(match[1]);
    const [ptBody, enBody] = splitLanguages(match[2]);

    const required = ['title', 'title_en', 'description', 'description_en', 'date'];
    for (const key of required) {
      if (!fm[key]) throw new Error(`Campo "${key}" faltando em ${file}`);
    }
    if (!ptBody?.trim() || !enBody?.trim()) {
      throw new Error(`Post ${file}: faltou o corpo PT e/ou EN (separe os idiomas com uma linha <!-- en -->)`);
    }
    if (fm.draft === true || fm.draft === 'true') {
      log(`ignorando rascunho: ${file}`);
      continue;
    }

    const date = new Date(fm.date);
    if (Number.isNaN(date.getTime())) throw new Error(`Data inválida em ${file}: ${fm.date}`);

    const htmlPt = marked.parse(ptBody);
    const htmlEn = marked.parse(enBody);
    const words = ptBody.replace(/[#>*`_\-\[\]()!]/g, ' ').split(/\s+/).filter(Boolean).length;

    posts.push({
      slug: fm.slug || slugFromFilename(file),
      title: fm.title,
      title_en: fm.title_en,
      description: fm.description,
      description_en: fm.description_en,
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      date,
      updated: fm.updated ? new Date(fm.updated) : date,
      htmlPt,
      htmlEn,
      readingTime: Math.max(1, Math.round(words / 200)),
      file
    });
  }

  const seen = new Set();
  for (const p of posts) {
    if (seen.has(p.slug)) throw new Error(`Slug duplicado: ${p.slug}`);
    seen.add(p.slug);
  }
  return posts.sort((a, b) => b.date - a.date);
}

/* ---------- Formatação ---------- */
const fmtPT = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
const fmtEN = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const iso = (d) => d.toISOString().slice(0, 10);

/* ---------- Shell reaproveitado do index.html ---------- */
function extract(html, re, name) {
  const m = html.match(re);
  if (!m) throw new Error(`Não encontrei ${name} no index.html`);
  return m[0];
}
const toAbsolute = (s) =>
  s
    .replace(/href="#/g, 'href="/#')
    .replace(/(\bsrc|\bhref|data-src-light|data-src-dark)="assets\//g, '$1="/assets/');

/* ---------- Head comum ---------- */
function head({ title, description, canonicalPt, canonicalEn, ogType = 'website', article, feed = true }) {
  const canonicalEnFull = canonicalEn;
  const ogImage = `${SITE}/assets/guh-logo.png`;
  return `
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <meta name="color-scheme" content="light dark">
  <meta name="theme-color" content="#f4f4f2">

  <link rel="canonical" href="${canonicalPt}">
  <link rel="alternate" hreflang="pt-BR" href="${canonicalPt}">
  <link rel="alternate" hreflang="en" href="${canonicalEnFull}">
  <link rel="alternate" hreflang="x-default" href="${canonicalPt}">
${feed ? `  <link rel="alternate" type="application/rss+xml" title="Guh — Blog (PT)" href="/feed.xml">
  <link rel="alternate" type="application/rss+xml" title="Guh — Blog (EN)" href="/feed-en.xml">
` : ''}
  <meta property="og:type" content="${ogType}">
  <meta property="og:site_name" content="Gustavo Costa (Guh)">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:locale:alternate" content="en_US">
  <meta property="og:url" content="${canonicalPt}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1317">
  <meta property="og:image:height" content="1194">
  <meta property="og:image:alt" content="Retrato ilustrado de Gustavo Costa (Guh)">
${article ? `  <meta property="article:published_time" content="${article.published}">
  <meta property="article:modified_time" content="${article.modified}">
${article.tags.map((t) => `  <meta property="article:tag" content="${esc(t)}">`).join('\n')}
` : ''}
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${ogImage}">
  <meta name="twitter:image:alt" content="Retrato ilustrado de Gustavo Costa (Guh)">

  <link rel="icon" type="image/png" href="/assets/guh-logo.png">
  <link rel="apple-touch-icon" href="/assets/guh-logo.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="preload" href="/assets/fonts/ebgaramond-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/css/styles.css">`;
}

/* ---------- Página completa ---------- */
function page({ headExtras, bootstrap, pageI18n, jsonld, header, main, footer }) {
  return `<!DOCTYPE html>
<html lang="pt-BR" data-locale="pt-BR" data-theme="light">
<head>
${headExtras}

  <script type="application/json" id="page-i18n">${jsonLd(pageI18n)}</script>
${bootstrap}
  <script type="application/ld+json">${jsonld}</script>
</head>
<body>
  <a class="skip-link" href="#conteudo">
    <span data-t="pt">Ir para o conteúdo</span><span data-t="en">Skip to content</span>
  </a>

${header}

${main}

${footer}

  <script src="/js/main.js" defer></script>
</body>
</html>
`;
}

/* ---------- Blog: card de post ---------- */
function postCard(p) {
  const tags = p.tags.length
    ? `\n        <ul class="tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`
    : '';
  return `      <li class="post-card">
        <a class="post-card__link" href="/blog/${p.slug}/">
          <p class="post-card__meta">
            <time datetime="${iso(p.date)}">
              <span data-t="pt">${esc(fmtPT.format(p.date))}</span><span data-t="en">${esc(fmtEN.format(p.date))}</span>
            </time>
            <span aria-hidden="true">·</span>
            <span data-t="pt">${p.readingTime} min de leitura</span><span data-t="en">${p.readingTime} min read</span>
          </p>
          <h2 class="post-card__title">
            <span data-t="pt">${esc(p.title)}</span><span data-t="en">${esc(p.title_en)}</span>
          </h2>
          <p class="post-card__desc">
            <span data-t="pt">${esc(p.description)}</span><span data-t="en">${esc(p.description_en)}</span>
          </p>${tags}
        </a>
      </li>`;
}

function blogJsonLd(posts) {
  return jsonLd({
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE}/blog/#blog`,
    name: 'Guh — Blog',
    url: `${SITE}/blog/`,
    inLanguage: ['pt-BR', 'en'],
    author: { '@type': 'Person', name: 'Gustavo Costa', url: `${SITE}/` },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${SITE}/blog/${p.slug}/`,
      datePublished: iso(p.date)
    }))
  });
}

function blogIndexHtml(posts, shell) {
  const cards = posts.map(postCard).join('\n');
  const empty = `      <p class="post-empty">
        <span data-t="pt">Os primeiros artigos estão a caminho.</span>
        <span data-t="en">The first posts are on the way.</span>
      </p>`;
  const list = posts.length
    ? `    <ol class="post-list">\n${cards}\n    </ol>`
    : empty;

  const main = `  <main id="conteudo">
    <section class="section">
      <div class="shell">
        <header class="sec-head" data-reveal>
          <h1 class="sec-title"><span data-t="pt">Blog</span><span data-t="en">Blog</span></h1>
          <p class="sec-lede">
            <span data-t="pt">Artigos sobre engenharia mobile, IA, open source e o processo de construir produtos que as pessoas usam.</span>
            <span data-t="en">Articles on mobile engineering, AI, open source and the craft of building products people use.</span>
          </p>
        </header>

${list}

        <p class="projects__more" data-reveal>
          <a href="/feed.xml"><span data-t="pt">Assinar o RSS</span><span data-t="en">Subscribe via RSS</span> <span aria-hidden="true">↗</span></a>
        </p>
      </div>
    </section>
  </main>`;

  return page({
    headExtras: head({
      title: 'Blog — Gustavo Costa (Guh)',
      description: 'Artigos de Gustavo Costa (Guh) sobre engenharia mobile, IA, open source e produtos digitais.',
      canonicalPt: `${SITE}/blog/`,
      canonicalEn: `${SITE}/blog/?lang=en`
    }),
    bootstrap: shell.bootstrap,
    pageI18n: {
      'pt-BR': { title: 'Blog — Gustavo Costa (Guh)', description: 'Artigos de Gustavo Costa (Guh) sobre engenharia mobile, IA, open source e produtos digitais.' },
      en: { title: 'Blog — Gustavo Costa (Guh)', description: "Gustavo Costa (Guh)'s articles on mobile engineering, AI, open source and digital products." }
    },
    jsonld: blogJsonLd(posts),
    header: shell.header,
    main,
    footer: shell.footer
  });
}

function postJsonLd(p) {
  return jsonLd({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    alternativeHeadline: p.title_en,
    description: p.description,
    inLanguage: ['pt-BR', 'en'],
    datePublished: p.date.toISOString(),
    dateModified: p.updated.toISOString(),
    author: { '@type': 'Person', name: 'Gustavo Costa', url: `${SITE}/` },
    publisher: { '@type': 'Person', name: 'Gustavo Costa' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/blog/${p.slug}/` },
    url: `${SITE}/blog/${p.slug}/`,
    image: `${SITE}/assets/guh-logo.png`,
    keywords: p.tags.join(', '),
    isPartOf: { '@type': 'Blog', '@id': `${SITE}/blog/#blog` }
  });
}

function postHtml(p, shell) {
  const tags = p.tags.length ? `\n          <ul class="tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : '';
  const url = `${SITE}/blog/${p.slug}/`;

  const main = `  <main id="conteudo">
    <article class="post">
      <div class="shell">
        <div class="post__inner">
          <header class="post__header" data-reveal>
            <p class="post__meta">
              <a class="post__back-link" href="/blog/"><span data-t="pt">Blog</span><span data-t="en">Blog</span></a>
              <span aria-hidden="true">/</span>
              <time datetime="${iso(p.date)}">
                <span data-t="pt">${esc(fmtPT.format(p.date))}</span><span data-t="en">${esc(fmtEN.format(p.date))}</span>
              </time>
              <span aria-hidden="true">·</span>
              <span data-t="pt">${p.readingTime} min de leitura</span><span data-t="en">${p.readingTime} min read</span>
            </p>
            <h1 class="post__title">
              <span data-t="pt">${esc(p.title)}</span><span data-t="en">${esc(p.title_en)}</span>
            </h1>
            <p class="post__lead">
              <span data-t="pt">${esc(p.description)}</span><span data-t="en">${esc(p.description_en)}</span>
            </p>${tags}
          </header>

          <div class="prose">
            <div data-t="pt">${p.htmlPt}</div>
            <div data-t="en">${p.htmlEn}</div>
          </div>

          <footer class="post__footer">
            <a class="project__link" href="/blog/">
              <span data-t="pt">Voltar para o blog</span><span data-t="en">Back to the blog</span>
            </a>
          </footer>
        </div>
      </div>
    </article>
  </main>`;

  return page({
    headExtras: head({
      title: `${p.title} — Guh`,
      description: p.description,
      canonicalPt: url,
      canonicalEn: `${url}?lang=en`,
      ogType: 'article',
      article: { published: p.date.toISOString(), modified: p.updated.toISOString(), tags: p.tags }
    }),
    bootstrap: shell.bootstrap,
    pageI18n: {
      'pt-BR': { title: `${p.title} — Guh`, description: p.description },
      en: { title: `${p.title_en} — Guh`, description: p.description_en }
    },
    jsonld: postJsonLd(p),
    header: shell.header,
    main,
    footer: shell.footer
  });
}

/* ---------- Feeds ---------- */
function rss(locale, posts) {
  const pt = locale === 'pt-BR';
  const title = pt ? 'Guh — Blog' : 'Guh — Blog (English)';
  const desc = pt
    ? 'Artigos de Gustavo Costa (Guh) sobre engenharia mobile, IA e open source.'
    : "Gustavo Costa (Guh)'s articles on mobile engineering, AI and open source.";
  const items = posts
    .map((p) => {
      const link = `${SITE}/blog/${p.slug}/${pt ? '' : '?lang=en'}`;
      const t = pt ? p.title : p.title_en;
      const d = pt ? p.description : p.description_en;
      return `    <item>
      <title>${esc(t)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${p.date.toUTCString()}</pubDate>
      <description>${esc(d)}</description>
    </item>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(title)}</title>
    <link>${SITE}/blog/</link>
    <description>${esc(desc)}</description>
    <language>${locale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

/* ---------- Sitemap ---------- */
function sitemap(posts) {
  const today = new Date().toISOString().slice(0, 10);
  const entries = [
    { path: '/', lastmod: today, priority: '1.0' },
    { path: '/blog/', lastmod: today, priority: '0.8' },
    ...posts.map((p) => ({ path: `/blog/${p.slug}/`, lastmod: iso(p.updated), priority: '0.7' }))
  ];
  const urlEntry = (pathName, lastmod, priority) => {
    const pt = `${SITE}${pathName}`;
    const en = `${pt}?lang=en`;
    return `  <url>
    <loc>${pt}</loc>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${pt}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${pt}"/>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>
  <url>
    <loc>${en}</loc>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${pt}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${pt}"/>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  };
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map((e) => urlEntry(e.path, e.lastmod, e.priority)).join('\n')}
</urlset>
`;
}

/* ---------- Cópia de arquivos estáticos ---------- */
async function copyRecursive(from, to) {
  await fs.mkdir(to, { recursive: true });
  for (const entry of await fs.readdir(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) await copyRecursive(src, dst);
    else await fs.copyFile(src, dst);
  }
}

/* ---------- Build ---------- */
async function build() {
  const indexHtml = await fs.readFile(path.join(ROOT, 'index.html'), 'utf8');
  const shell = {
    bootstrap: extract(indexHtml, /<script>\s*\(function \(\) \{[\s\S]*?\}\)\(\);\s*<\/script>/, 'o script de bootstrap'),
    header: toAbsolute(extract(indexHtml, /<header class="site-header">[\s\S]*?<\/header>/, 'o <header>'))
      .replace(/(<a[^>]*href="\/blog\/")/, '$1 aria-current="page"'),
    footer: toAbsolute(extract(indexHtml, /<footer class="site-footer">[\s\S]*?<\/footer>/, 'o <footer>'))
  };

  const posts = await readPosts();
  log(`${posts.length} post(s)`);

  await fs.rm(DIST, { recursive: true, force: true });
  await fs.mkdir(DIST, { recursive: true });

  // Estáticos
  await fs.copyFile(path.join(ROOT, 'index.html'), path.join(DIST, 'index.html'));
  await fs.copyFile(path.join(ROOT, 'CNAME'), path.join(DIST, 'CNAME'));
  await fs.copyFile(path.join(ROOT, 'robots.txt'), path.join(DIST, 'robots.txt'));
  await fs.copyFile(path.join(ROOT, 'site.webmanifest'), path.join(DIST, 'site.webmanifest'));
  for (const dir of ['assets', 'css', 'js', 'files']) {
    try {
      await copyRecursive(path.join(ROOT, dir), path.join(DIST, dir));
    } catch (err) {
      if (err.code === 'ENOENT') log(`aviso: ${dir}/ não encontrado — ignorado`);
      else throw err;
    }
  }
  await fs.writeFile(path.join(DIST, '.nojekyll'), '');

  // llms.txt = base + seção de blog gerada
  const llmsBase = await fs.readFile(path.join(ROOT, 'llms.txt'), 'utf8');
  const blogSection = posts.length
    ? `\n## Blog\n\n- [Blog](${SITE}/blog/): artigos sobre engenharia mobile, IA e open source / articles on mobile engineering, AI and open source\n` +
      posts
        .map((p) => `  - [${p.title}](${SITE}/blog/${p.slug}/) (${iso(p.date)}): ${p.description}`)
        .join('\n') +
      `\n- Feeds: [PT](${SITE}/feed.xml) · [EN](${SITE}/feed-en.xml)\n`
    : '';
  await fs.writeFile(path.join(DIST, 'llms.txt'), llmsBase.trimEnd() + '\n' + blogSection);

  // Blog
  await fs.mkdir(path.join(DIST, 'blog'), { recursive: true });
  await fs.writeFile(path.join(DIST, 'blog', 'index.html'), blogIndexHtml(posts, shell));
  for (const p of posts) {
    const dir = path.join(DIST, 'blog', p.slug);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, 'index.html'), postHtml(p, shell));
  }

  // Feeds + sitemap
  await fs.writeFile(path.join(DIST, 'feed.xml'), rss('pt-BR', posts));
  await fs.writeFile(path.join(DIST, 'feed-en.xml'), rss('en', posts));
  await fs.writeFile(path.join(DIST, 'sitemap.xml'), sitemap(posts));

  log('site gerado em dist/');
}

build().catch((err) => {
  console.error('[build] falhou:', err.message);
  process.exit(1);
});
