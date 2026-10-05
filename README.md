# guhcostan.dev

Site pessoal, currículo e blog de **Gustavo Costa (Guh)**, Lead Mobile & Frontend Engineer, Tech Anchor na Thoughtworks.

Estático e sem framework de runtime: HTML, CSS e JavaScript puros. A única etapa de build é o gerador do blog, que transforma Markdown em HTML. Conteúdo em português e inglês, alternável pelo seletor PT/EN no cabeçalho (o estado vive em `?lang=en`). Todas as informações vêm do currículo oficial em `files/gustavo-costa-curriculo.pdf`.

## Estrutura

- `index.html` — página única (currículo/portfólio) com todo o conteúdo nos dois idiomas
- `content/posts/*.md` — artigos do blog em Markdown (PT + EN no mesmo arquivo)
- `content/pages/*.md` — páginas institucionais (privacidade, termos), publicadas em `/<slug>/` no mesmo formato dos posts
- `tools/build.mjs` — gerador: blog, RSS e sitemap a partir de `content/posts`
- `css/styles.css` — folha de estilo minimalista em preto, branco e cinzas, tema claro/escuro com contraste AA+
- `js/main.js` — idioma, tema, menu móvel, seção ativa no menu e metadados por página (title, canonical, OG, JSON-LD)
- `assets/` — logo (original com fundo branco e versões transparentes preta/branca) e Inter auto-hospedada (OFL)
- `files/gustavo-costa-curriculo.pdf` — currículo completo em PDF
- `robots.txt`, `llms.txt`, `site.webmanifest` — SEO e AI SEO (`sitemap.xml` é gerado no build)
- `_headers` — headers de segurança e cache aplicados pela Cloudflare
- `wrangler.jsonc` — configuração do Worker que serve `dist/` na Cloudflare

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

O site roda no **Cloudflare Workers** (assets estáticos, sem código de servidor), no domínio https://guhcostan.dev/.

Push na `main` dispara o **Workers Builds** da Cloudflare, conectado a este repositório: ele roda `npm run build` e depois `npx wrangler deploy`, que publica `dist/` conforme o `wrangler.jsonc`. Endereços inexistentes caem na página `404.html` gerada pelo build.

Para testar localmente como na Cloudflare (headers, 404, barras no fim das URLs):

```sh
npm run build && npx wrangler dev
```

A implementação anterior (app Next.js + Vite) segue preservada no histórico do git até o commit `bbcd4e1`.

## Hospedagem e headers

Os headers de segurança (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) e de cache ficam no arquivo `_headers`, versionado aqui. O HSTS e o HTTPS obrigatório são configurações da zona na Cloudflare.

A CSP libera o script inline de bootstrap (tema e idioma, no `<head>` do `index.html`) pelo hash SHA-256 dele. Se esse script mudar, o `npm run build` falha e mostra o hash novo para colocar no `_headers`. Para calcular à mão:

```sh
node -e "const s=require('fs').readFileSync('index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];console.log('sha256-'+require('crypto').createHash('sha256').update(s).digest('base64'))"
```

