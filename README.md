# guhcostan.dev

Site pessoal, currículo e blog de **Gustavo Costa (Guh)**, Lead Mobile & Frontend Engineer, Tech Anchor na Thoughtworks.

Estático e sem framework de runtime: HTML, CSS e JavaScript puros. A única etapa de build é o gerador do blog, que transforma Markdown em HTML. Conteúdo em português e inglês, alternável pelo seletor PT/EN no cabeçalho (o estado vive em `?lang=en`). Todas as informações vêm do currículo oficial em `files/gustavo-costa-curriculo.pdf`.

## Estrutura

- `index.html` — página única (currículo/portfólio) com todo o conteúdo nos dois idiomas
- `content/posts/*.md` — artigos do blog em Markdown (PT + EN no mesmo arquivo)
- `tools/build.mjs` — gerador: blog, RSS e sitemap a partir de `content/posts`
- `css/styles.css` — folha de estilo editorial, tema claro/escuro com contraste AA+
- `js/main.js` — idioma, tema, menu móvel e metadados por página (title, canonical, OG, JSON-LD)
- `assets/` — logo (original com fundo branco e versões transparentes preta/branca) e EB Garamond auto-hospedada (OFL)
- `files/gustavo-costa-curriculo.pdf` — currículo completo em PDF
- `robots.txt`, `llms.txt`, `site.webmanifest` — SEO e AI SEO (`sitemap.xml` é gerado no build)
- `CNAME` — domínio customizado `guhcostan.dev` (publicado no `gh-pages`)

## Rodar localmente

```sh
npm install
npm run dev      # gera dist/ e serve em http://localhost:8000
```

Sem blog? Só `npm run build` gera o site em `dist/`.

## Escrever um post

1. Crie um arquivo em `content/posts/` no formato `AAAA-MM-DD-slug.md`.
2. Preencha o frontmatter e escreva o corpo em PT e EN, separados por uma linha `<!-- en -->`:

```md
---
title: "Título em português"
title_en: "Title in English"
description: "Resumo curto (PT)"
description_en: "Short summary (EN)"
date: 2026-09-25
tags: [mobile, ia]
---

Texto em português.

<!-- en -->

English text.
```

O `slug` vem do nome do arquivo (sem a data), salvo se você definir `slug:` no frontmatter. O idioma do corpo é separado pelo `<!-- en -->` — que só conta **fora** de blocos de código, então pode aparecer em exemplos.

Rode `npm run build` e confira `dist/blog/`.

## Publicação

Push na `main` dispara `.github/workflows/deploy.yml`, que instala as dependências, roda o build e publica `dist/` na branch `gh-pages` (fonte do GitHub Pages): https://guhcostan.dev/

O arquivo `CNAME` na raiz (e a opção `cname` do workflow) define o domínio customizado; o `force_orphan` mantém a `gh-pages` enxuta.

A implementação anterior (app Next.js + Vite) segue preservada no histórico do git até o commit `bbcd4e1`.
