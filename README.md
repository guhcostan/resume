# guhcostan.dev

Site pessoal, currículo e blog de **Gustavo Costa (Guh)**, Lead Mobile & Frontend Engineer, Tech Anchor na Thoughtworks.

Estático e sem framework de runtime: HTML, CSS e JavaScript puros. A única etapa de build é o gerador do blog, que transforma Markdown em HTML. Conteúdo em português e inglês, alternável pelo seletor PT/EN no cabeçalho (o estado vive em `?lang=en`). Todas as informações vêm do currículo oficial em `files/gustavo-costa-curriculo.pdf`.

## Estrutura

- `index.html` — página única (currículo/portfólio) com todo o conteúdo nos dois idiomas
- `content/posts/*.md` — artigos do blog em Markdown (PT + EN no mesmo arquivo)
- `content/pages/*.md` — páginas institucionais (privacidade, termos), publicadas em `/<slug>/` no mesmo formato dos posts
- `content/data/contributions.json` — snapshot do último ano de contribuições no GitHub (seção "Um ano em blocos")
- `tools/build.mjs` — gerador: blog, RSS, sitemap e a home (injeta o gráfico de contribuições e o post mais recente)
- `tools/contributions.mjs` — atualiza o snapshot de contribuições (`npm run contributions`)
- `css/styles.css` — visual em pixel art: fundo quase preto, Silkscreen nos títulos e rótulos, Inter nos textos longos
- `js/main.js` — idioma, menu móvel, seção ativa no menu e metadados por página (title, canonical, OG, JSON-LD)
- `js/play.js` — a parte lúdica: agentes que constroem o nome na intro, agente que anda no chão, prévias dos projetos, terminal do contato (com jogo da velha) e segredos
- `assets/` — avatar em pixel art (`avatar-pixel.png`, gerado a partir da logo), imagem de compartilhamento, ícones e as fontes Silkscreen e Inter auto-hospedadas (OFL)
- `files/gustavo-costa-curriculo.pdf` — currículo completo em PDF
- `robots.txt`, `llms.txt`, `site.webmanifest` — SEO e AI SEO (`sitemap.xml` é gerado no build)
- `_headers` — headers de segurança e cache aplicados pela Cloudflare
- `wrangler.jsonc` — configuração do Worker que serve `dist/` na Cloudflare

## Visual

Tudo é construído com blocos. A Silkscreen desenha numa grade de 1/8 em, então com 32 ou 64px cada pixel da fonte vira um bloco inteiro na tela; a intro usa isso para amostrar o nome dos pixels reais da fonte e uma equipe de agentes larga cada bloco no lugar. No fim, o canvas sai e fica o texto de verdade, pixel sobre pixel.

Sem JavaScript, o site continua inteiro: só não tem intro, agentes, terminal nem segredos. Com `prefers-reduced-motion`, nada se mexe. A intro roda uma vez por sessão, só na home, e dá para pular com Esc.

O gráfico "Um ano em blocos" vem do build: ele tenta baixar as contribuições mais recentes e, se a rede falhar, usa o snapshot versionado. Para builds sem rede, `CONTRIB_OFFLINE=1 npm run build`.

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

Branches e PRs usam `npx wrangler preview` para publicar uma prévia. O bloco `previews: {}` no `wrangler.jsonc` habilita esse comando; os assets e as configurações de compatibilidade continuam no nível principal.

Para testar localmente como na Cloudflare (headers, 404, barras no fim das URLs):

```sh
npm run build && npx wrangler dev
```

A implementação anterior (app Next.js + Vite) segue preservada no histórico do git até o commit `bbcd4e1`.

## Hospedagem e headers

Os headers de segurança (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) e de cache ficam no arquivo `_headers`, versionado aqui. O HSTS e o HTTPS obrigatório são configurações da zona na Cloudflare.

A CSP libera o script inline de bootstrap (idioma e intro, no `<head>` do `index.html`) pelo hash SHA-256 dele. Se esse script mudar, o `npm run build` falha e mostra o hash novo para colocar no `_headers`. Para calcular à mão:

```sh
node -e "const s=require('fs').readFileSync('index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];console.log('sha256-'+require('crypto').createHash('sha256').update(s).digest('base64'))"
```

