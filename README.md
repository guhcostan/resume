# Gustavo Costa — Portfolio / Resume

Personal portfolio website for **Gustavo Costa**, Lead Mobile & Frontend Engineer
(React Native · TypeScript · AI). Built with **Next.js + TypeScript + Tailwind CSS**,
fully bilingual (🇧🇷 PT / 🇺🇸 EN) with light/dark mode and a static export ready for
Vercel or GitHub Pages.

> Site pessoal do **Gustavo Costa**, Lead Mobile & Frontend Engineer. Feito com
> Next.js, TypeScript e Tailwind CSS, bilíngue (PT/EN), com tema claro/escuro.

## Features / Recursos

- ⚡️ Static export (no server required) — deploy anywhere
- 🌐 Bilingual EN/PT with one-click toggle (persists in `localStorage`)
- 🌗 Dark / light theme (respects system preference, no flash on load)
- 📱 Fully responsive, accessible, with subtle scroll animations
- ✏️ All content lives in a single typed file: [`lib/content.ts`](lib/content.ts)

## Getting started / Como rodar

```bash
npm install
npm run dev      # http://localhost:3000
```

Build the static site:

```bash
npm run build    # outputs to ./out
```

## Editing content / Editando o conteúdo

Every piece of text (experience, skills, certifications, contact, etc.) is stored
in [`lib/content.ts`](lib/content.ts), keyed by locale (`en` / `pt`). Edit there —
no need to touch the components.

## Deploy

### Vercel (recommended)
Import the repo at [vercel.com/new](https://vercel.com/new). No config needed.

### GitHub Pages
A workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds
and deploys on every push to `main`. Enable **Settings → Pages → Source: GitHub
Actions**. The workflow sets `NEXT_PUBLIC_BASE_PATH` to the repo name automatically;
for a custom domain or user/org page, leave it empty.

---

Built with Next.js, TypeScript & Tailwind CSS.
