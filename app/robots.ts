import type { MetadataRoute } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const siteUrl = `https://guhcostan.github.io${basePath}`;

// Note: on a GitHub Pages *project* site this is served from the base path,
// which crawlers don't read as the domain-root robots.txt — but it becomes
// effective as-is on a custom domain or user page, and it's harmless here.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
