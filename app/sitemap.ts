import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/content";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/en/"].map(path => ({ url: `${siteUrl}${path}`, changeFrequency: "monthly", priority: 1, alternates: { languages: { "pt-BR": `${siteUrl}/`, en: `${siteUrl}/en/` } } }));
}
