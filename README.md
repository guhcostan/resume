# guhcostan.dev

Site pessoal, currículo e blog de **Gustavo Costa (Guh)**, Lead Mobile & Frontend Engineer, Tech Anchor na Thoughtworks.

Estático e sem framework de runtime: HTML, CSS e JavaScript puros. A única etapa de build é o gerador, que transforma Markdown em HTML para o blog e injeta na home o gráfico de contribuições e o post mais recente.

Conteúdo em português e inglês. O padrão é PT-BR; `?lang=en` abre em inglês, e o seletor PT/EN no cabeçalho troca o idioma e lembra a escolha no navegador (`localStorage`, chave `guh-locale`).

O conteúdo segue o currículo oficial em `files/gustavo-costa-curriculo.pdf`. As estrelas dos projetos e o contador "2.000+" da home não vêm do currículo: são valores fixos no `index.html` (as estrelas também estão no `llms.txt`) e precisam ser atualizados à mão.

## Estrutura

- `index.html` — página única (currículo/portfólio) com todo o conteúdo nos dois idiomas
- `content/posts/*.md` — artigos do blog em Markdown (PT + EN no mesmo arquivo)
- `content/pages/*.md` — páginas institucionais (privacidade, termos), publicadas em `/<slug>/` no mesmo formato dos posts
- `content/data/contributions.json` — snapshot do último ano de contribuições no GitHub (seção "Um ano em blocos")
- `tools/build.mjs` — gerador: blog, RSS, sitemap e a home (injeta o gráfico de contribuições e o post mais recente)
- `tools/contributions.mjs` — atualiza o snapshot de contribuições (`npm run contributions`)
- `css/styles.css` — visual escuro: fundo quase preto, Silkscreen nos títulos e rótulos, Inter nos textos longos
- `js/main.js` — idioma (PT/EN), menu móvel, seção ativa no menu e metadados trocados com o idioma (title, canonical, OG, JSON-LD)
- `js/home.js` — efeitos da home, todos opcionais: aurora em WebGL, revelação ao rolar, contadores, terminais que digitam, paleta de comandos (Ctrl/Cmd+K) e cópia do e-mail
- `assets/` — avatar em pixel art (`avatar-pixel.png`, gerado a partir da logo), imagem de compartilhamento, ícones e as fontes Silkscreen e Inter auto-hospedadas (OFL)
- `files/gustavo-costa-curriculo.pdf` — currículo completo em PDF
- `robots.txt`, `llms.txt`, `site.webmanifest` — SEO e AI SEO (`sitemap.xml` é gerado no build)
- `_headers` — headers de segurança e cache aplicados pela Cloudflare
- `wrangler.jsonc` — configuração do Worker que serve `dist/` na Cloudflare

## Visual

Fundo escuro com tokens de cor em `:root`, Silkscreen nos títulos e rótulos e Inter nos textos longos, as duas fontes auto-hospedadas. Os projetos são cards de terminal, com o comando digitado e a saída.

A aurora de fundo é um shader WebGL renderizado em 1/3 da resolução e ampliado com `image-rendering: pixelated`, o que mantém o custo baixo e dá aspecto de pixel art.

Sem JavaScript, a página inteira aparece em português, sem animação. O `js/home.js` liga os efeitos e marca `html.is-live` quando inicializa. A classe `html.fx`, que liga o movimento, não é aplicada com `prefers-reduced-motion`: nesse caso o conteúdo já aparece no estado final.

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

### Prévia em /preview/

`npm run build:preview` gera `dist-preview/` com o site inteiro sob `/preview/` (links prefixados, `noindex`). O Worker separado `resume-preview` (`wrangler.preview.jsonc`) publica essa pasta na rota `guhcostan.dev/preview*`, sem tocar no Worker de produção:

```sh
npm run build:preview && npx wrangler deploy -c wrangler.preview.jsonc
```

Para tirar a prévia do ar, apague o Worker `resume-preview` no painel da Cloudflare.

Para testar localmente como na Cloudflare (headers, 404, barras no fim das URLs):

```sh
npm run build && npx wrangler dev
```

A implementação anterior (app Next.js + Vite) segue preservada no histórico do git até o commit `bbcd4e1`.

## Hospedagem e headers

Os headers de segurança (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) e de cache ficam no arquivo `_headers`, versionado aqui. O HSTS e o HTTPS obrigatório são configurações da zona na Cloudflare.

A CSP libera o script inline de bootstrap (idioma, no `<head>` do `index.html`) pelo hash SHA-256 dele. Se esse script mudar, o `npm run build` falha e mostra o hash novo para colocar no `_headers`. Para calcular à mão:

```sh
node -e "const s=require('fs').readFileSync('index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];console.log('sha256-'+require('crypto').createHash('sha256').update(s).digest('base64'))"
```

