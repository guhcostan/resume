---
title: "Como este blog é feito: Markdown, build e zero JavaScript no conteúdo"
title_en: "How this blog is built: Markdown, a build step and zero JavaScript in the content"
description: "Um blog bilíngue, estático e rápido: escrevo em Markdown, um gerador de ~400 linhas publica o HTML no GitHub Pages."
description_en: "A bilingual, static and fast blog: I write in Markdown and a ~400-line generator publishes the HTML to GitHub Pages."
date: 2026-09-25
tags: [static-site, markdown, github-pages, seo]
---

Gosto de sites que carregam instantaneamente e continuam funcionando daqui a dez anos. Por isso este blog não tem banco de dados, CMS nem framework de front-end. O fluxo é simples: eu escrevo em Markdown e um gerador monta o HTML.

## O fluxo

1. Um arquivo Markdown por post, com um cabeçalho de metadados.
2. `npm run build` lê os arquivos, converte para HTML e escreve tudo em `dist/`.
3. O GitHub Actions roda o build e publica `dist/` no GitHub Pages.

O frontmatter separa os metadados dos dois idiomas:

```yaml
---
title: "Título em português"
title_en: "Title in English"
description: "Resumo curto"
description_en: "Short summary"
date: 2026-09-25
tags: [static-site, markdown]
---
```

O corpo do post traz as duas línguas, separadas por um marcador:

```markdown
Texto em português.

<!-- en -->

English text.
```

## Por que gerar HTML em vez de renderizar no navegador

Renderizar Markdown no cliente é tentador, mas ruim para SEO: o conteúdo não está no HTML inicial. Gerando no build, cada post é uma página completa, indexável, com canonical, `hreflang` e dados estruturados — exatamente como o resto do site.

> O melhor JavaScript para o conteúdo é aquele que não precisa existir.

O único JavaScript que roda nas páginas é o mínimo para alternar idioma e tema. Nada de conteúdo depende dele.

## O que o gerador produz

- A lista de posts em `/blog/`
- Uma página por post, em português e inglês
- Feeds RSS em `/feed.xml` e `/feed-en.xml`
- O `sitemap.xml` e a seção de blog do `llms.txt`

Tudo versionado no Git e reproduzível: o mesmo Markdown sempre gera o mesmo HTML.

<!-- en -->

I like sites that load instantly and still work ten years from now. That is why this blog has no database, no CMS and no front-end framework. The flow is simple: I write in Markdown and a generator builds the HTML.

## The flow

1. One Markdown file per post, with a header of metadata.
2. `npm run build` reads the files, converts them to HTML and writes everything to `dist/`.
3. GitHub Actions runs the build and publishes `dist/` to GitHub Pages.

The frontmatter keeps the metadata for both languages apart:

```yaml
---
title: "Título em português"
title_en: "Title in English"
description: "Resumo curto"
description_en: "Short summary"
date: 2026-09-25
tags: [static-site, markdown]
---
```

The post body carries both languages, separated by a marker:

```markdown
Texto em português.

<!-- en -->

English text.
```

## Why generate HTML instead of rendering in the browser

Rendering Markdown on the client is tempting but bad for SEO: the content is not in the initial HTML. By generating at build time, every post is a complete, indexable page with canonical, `hreflang` and structured data — just like the rest of the site.

> The best JavaScript for content is the one that does not need to exist.

The only JavaScript running on the pages is the minimum to switch language and theme. No content depends on it.

## What the generator produces

- The post list at `/blog/`
- One page per post, in Portuguese and English
- RSS feeds at `/feed.xml` and `/feed-en.xml`
- The `sitemap.xml` and the blog section of `llms.txt`

Everything versioned in Git and reproducible: the same Markdown always generates the same HTML.
