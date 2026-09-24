# guhcostan.dev

Site pessoal e currículo de **Gustavo Costa (Guh)**, Lead Mobile & Frontend Engineer, Tech Anchor na Thoughtworks.

Estático de propósito: HTML, CSS e JavaScript puros, sem build e sem dependências de runtime.
Conteúdo em português e inglês, alternável pelo seletor PT/EN no cabeçalho (o estado vive em `?lang=en`).
Todas as informações vêm do currículo oficial em `files/gustavo-costa-curriculo.pdf`.

## Estrutura

- `index.html` — página única com todo o conteúdo nos dois idiomas
- `css/styles.css` — folha de estilo editorial, tema claro/escuro com contraste AA+
- `js/main.js` — idioma, tema, menu móvel e metadados dinâmicos (title, canonical, OG, JSON-LD)
- `assets/` — logo (original com fundo branco e versões transparentes preta/branca) e EB Garamond auto-hospedada (OFL)
- `files/gustavo-costa-curriculo.pdf` — currículo completo em PDF
- `robots.txt`, `sitemap.xml`, `llms.txt`, `site.webmanifest` — SEO e AI SEO
- `CNAME` — domínio customizado `guhcostan.dev` (publicado no `gh-pages`)

## Rodar localmente

```sh
python3 -m http.server 8000
```

Depois abra http://localhost:8000. Não há instalação de dependências.

## Publicação

Push na `main` dispara `.github/workflows/deploy.yml`, que publica a raiz do repositório
na branch `gh-pages` (fonte do GitHub Pages): https://guhcostan.dev/

O arquivo `CNAME` na raiz define o domínio customizado e é republicado a cada deploy
(o workflow usa `force_orphan`, então o CNAME precisa existir na origem).

A implementação anterior (app Next.js + Vite) segue preservada no histórico do git até o commit `bbcd4e1`.
