# Gustavo Costa — Portfolio / Resume

Personal portfolio website for **Gustavo Costa**, Lead Mobile & Frontend Engineer
(React Native · TypeScript · AI). Built with **Next.js + TypeScript + Tailwind CSS**,
fully bilingual (🇧🇷 PT / 🇺🇸 EN) with light/dark mode and a static export ready for
Vercel or GitHub Pages.

> Site pessoal do **Gustavo Costa**, Lead Mobile & Frontend Engineer. Feito com
> Next.js, TypeScript e Tailwind CSS, bilíngue (PT/EN), com tema claro/escuro.

## Features / Recursos

- 📱 **Phone-shaped AI chat in the hero** — a CSS-drawn phone running a real
  LLM (WebLLM/WebGPU, fully in-browser) that answers questions about me
- 🧭 Floating bottom dock navigation, styled like a mobile app tab bar
- 🌳 Experience timeline rendered as a `git log` of the career
- ⚡️ Static export (no server required) — deploy anywhere
- 🌐 Bilingual EN/PT with one-click toggle (persists in `localStorage`)
- 🌗 Dark / light theme (respects system preference, no flash on load)
- 📐 Fully responsive, accessible, with subtle scroll animations
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
the static site on every push to `main` and publishes it to the **`gh-pages`**
branch (via `peaceiris/actions-gh-pages`, which avoids the Actions artifact storage
quota). One-time setup: **Settings → Pages → Source: Deploy from a branch →
Branch: `gh-pages` / `(root)`**. The workflow sets `NEXT_PUBLIC_BASE_PATH` to the
repo name automatically; for a custom domain or user/org page, leave it empty.

---

Built with Next.js, TypeScript & Tailwind CSS.
