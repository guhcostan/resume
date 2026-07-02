import type { MetadataRoute } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const siteUrl = `https://guhcostan.github.io${basePath}`;

// Statically generated at build time (output: "export").
// /lab is intentionally left out — it's a hidden experiment.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/terminal/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
