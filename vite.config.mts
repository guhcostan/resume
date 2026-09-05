import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { dictionaries } from "./lib/i18n/index.ts";
import { profile, projects } from "./lib/content.ts";
const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
const site = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  `https://guhcostan.github.io${base || "/resume"}`
).replace(/\/$/, "");
const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export default defineConfig({
  plugins: [
    react(),
    {
      name: "portfolio-static-metadata",
      transformIndexHtml(html, context) {
        const en = context.path.includes("/en/");
        const t = dictionaries[en ? "en" : "pt"];
        const url = `${site}${en ? "/en/" : "/"}`;
        const image = `${site}/images/social-card${en ? "-en" : ""}.png`;
        // Keep the real professional content available to crawlers and without JavaScript.
        const fallback = `<main style="max-width:760px;margin:60px auto;padding:24px;font-family:system-ui"><h1>Gustavo Costa</h1><p>${escape(t.profile.bio)}</p><h2>${escape(t.projectSection.title)}</h2>${projects.map((p) => `<article><h3><a href="${profile.github}/${p.name}">${p.name}</a></h3><p>${escape(t.projects[p.name].detail)}</p></article>`).join("")}<h2>${escape(t.about.title)}</h2>${t.about.paragraphs.map((p) => `<p>${escape(p)}</p>`).join("")}<p><a href="mailto:${profile.email}">${profile.email}</a> · <a href="${base}/files/gustavo-costa-curriculo.pdf">${escape(t.common.resume)}</a></p></main>`;
        return {
          html: html.replace(
            '<div id="root"></div>',
            `<div id="root">${fallback}</div>`,
          ),
          tags: [
            { tag: "link", attrs: { rel: "canonical", href: url } },
            ...[
              ["pt-BR", "/"],
              ["en", "/en/"],
              ["x-default", "/"],
            ].map(([lang, path]) => ({
              tag: "link",
              attrs: {
                rel: "alternate",
                hreflang: lang,
                href: `${site}${path}`,
              },
            })),
            ...Object.entries({
              "og:title": t.metadata.title,
              "og:description": t.metadata.description,
              "og:type": "website",
              "og:url": url,
              "og:image": image,
              "og:locale": en ? "en_US" : "pt_BR",
            }).map(([property, content]) => ({
              tag: "meta",
              attrs: { property, content },
            })),
            {
              tag: "meta",
              attrs: { name: "twitter:card", content: "summary_large_image" },
            },
            {
              tag: "meta",
              attrs: {
                name: "google-site-verification",
                content: "50jkrIuVHWs0TbxOT3t6V28olPFWAbUHqzknTrOnCuo",
              },
            },
            {
              tag: "script",
              attrs: { type: "application/ld+json" },
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                name: profile.name,
                url,
                jobTitle: t.metadata.jobTitle,
                email: `mailto:${profile.email}`,
                sameAs: [profile.github, profile.linkedin],
              }).replace(/</g, "\\u003c"),
            },
          ],
        };
      },
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "robots.txt",
          source: `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`,
        });
        this.emitFile({
          type: "asset",
          fileName: "sitemap.xml",
          source: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site}/</loc></url><url><loc>${site}/en/</loc></url></urlset>`,
        });
      },
    },
  ],
  base: `${base}/`,
  define: {
    "process.env.NEXT_PUBLIC_BASE_PATH": JSON.stringify(base),
    "process.env.NEXT_PUBLIC_SITE_URL": JSON.stringify(
      process.env.NEXT_PUBLIC_SITE_URL || "",
    ),
  },
  build: {
    outDir: "out",
    rollupOptions: { input: { main: "index.html", en: "en/index.html" } },
  },
  server: { host: "0.0.0.0" },
});
