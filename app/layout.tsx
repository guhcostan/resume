import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "./globals.css";
import { profile, siteUrl } from "@/lib/content";

const description = "Gustavo Costa, o Guh. Engenheiro de software com foco em IA, agentes e LLMs. Tech Anchor na Thoughtworks, experiência em React Native e aberto a freelas.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "guh. — Gustavo Costa · Engenharia de IA",
  description,
  authors: [{ name: profile.name }],
  alternates: { canonical: `${siteUrl}/` },
  verification: { google: "50jkrIuVHWs0TbxOT3t6V28olPFWAbUHqzknTrOnCuo" },
  openGraph: {
    title: "guh. — Gustavo Costa · Engenharia de IA",
    description,
    url: `${siteUrl}/`,
    siteName: "guh.",
    locale: "pt_BR",
    type: "website",
    images: [{ url: `${siteUrl}/images/social-card.png`, width: 1200, height: 630, alt: "guh. — Gustavo Costa. Engenharia de IA, agentes e open source." }],
  },
  twitter: { card: "summary_large_image", title: "guh. — Gustavo Costa · Engenharia de IA", description, images: [`${siteUrl}/images/social-card.png`] },
};

export const viewport: Viewport = { themeColor: "#f3f4f1" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Person", name: profile.name,
    url: `${siteUrl}/`, jobTitle: profile.role, email: `mailto:${profile.email}`,
    sameAs: [profile.github, profile.linkedin],
    worksFor: { "@type": "Organization", name: "Thoughtworks" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Universidade Federal de Lavras" },
    address: { "@type": "PostalAddress", addressLocality: "São Sebastião", addressRegion: "SP", addressCountry: "BR" },
    knowsLanguage: ["pt-BR", "en", "es"],
  };
  const themeScript = `try{var t=localStorage.getItem('gustavo-theme');if(t==='dark')document.documentElement.dataset.theme='dark'}catch(e){}`;
  return <html lang="pt-BR" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }}/></head><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />{children}</body></html>;
}
