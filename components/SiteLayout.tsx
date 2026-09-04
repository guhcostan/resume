import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@/app/globals.css";
import { asset, profile, siteUrl } from "@/lib/content";
import { dictionaries, localePath, type Locale } from "@/lib/i18n";

export function localizedMetadata(locale: Locale): Metadata {
  const t = dictionaries[locale].metadata;
  const url = `${siteUrl}${localePath(locale)}`;
  const image = `${siteUrl}/images/social-card${locale === "en" ? "-en" : ""}.png`;
  return {
    metadataBase: new URL(siteUrl), title: t.title, description: t.description,
    authors: [{ name: profile.name }],
    alternates: { canonical: url, languages: { "pt-BR": `${siteUrl}/`, en: `${siteUrl}/en/`, "x-default": `${siteUrl}/` } },
    verification: { google: "50jkrIuVHWs0TbxOT3t6V28olPFWAbUHqzknTrOnCuo" },
    icons: { icon: asset("/icon.svg") },
    openGraph: {
      title: t.title, description: t.description, url, siteName: "guh.",
      locale: locale === "en" ? "en_US" : "pt_BR", alternateLocale: locale === "en" ? "pt_BR" : "en_US", type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: t.imageAlt }],
    },
    twitter: { card: "summary_large_image", title: t.title, description: t.description, images: [image] },
  };
}

export const siteViewport: Viewport = { themeColor: "#f3f4f1" };

export function SiteLayout({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Person", name: profile.name,
    url: `${siteUrl}${localePath(locale)}`, jobTitle: dictionaries[locale].metadata.jobTitle, email: `mailto:${profile.email}`,
    sameAs: [profile.github, profile.linkedin],
    worksFor: { "@type": "Organization", name: "Thoughtworks" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Universidade Federal de Lavras" },
    address: { "@type": "PostalAddress", addressLocality: "São Sebastião", addressRegion: "SP", addressCountry: "BR" },
    knowsLanguage: ["pt-BR", "en", "es"],
  };
  const themeScript = `try{if(localStorage.getItem('gustavo-theme')==='dark')document.documentElement.dataset.theme='dark'}catch(e){}`;
  // Explicit English URLs always stay English. On the default URL, honor a
  // language selected with the switcher without changing the static HTML.
  const languageScript = locale === "pt"
    ? `try{if(localStorage.getItem('guh-language')==='en'&&(location.pathname===${JSON.stringify(asset("/"))}||location.pathname===${JSON.stringify(asset("/").replace(/\/$/, ""))}))location.replace(${JSON.stringify(asset("/en/"))}+location.search+location.hash)}catch(e){}`
    : "";
  return <html lang={locale === "en" ? "en" : "pt-BR"} suppressHydrationWarning><body><script dangerouslySetInnerHTML={{ __html: themeScript + languageScript }}/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />{children}</body></html>;
}
