import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

// Resolve the public URL (including the GitHub Pages base path) so that
// Open Graph image and canonical URLs are absolute and correct.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const siteUrl = `https://guhcostan.github.io${basePath}`;
const ogImage = `${siteUrl}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Gustavo Costa — Lead Mobile & Frontend Engineer",
  description:
    "Portfolio of Gustavo Costa, Lead Mobile & Frontend Engineer (React Native, TypeScript, AI). Tech Anchor @ Thoughtworks. 8+ years building apps used by millions.",
  keywords: [
    "Gustavo Costa",
    "React Native",
    "TypeScript",
    "Mobile Engineer",
    "Frontend Engineer",
    "Thoughtworks",
    "AI Engineering",
    "LLM",
    "Next.js",
  ],
  authors: [{ name: "Gustavo Costa", url: siteUrl }],
  openGraph: {
    title: "Gustavo Costa — Lead Mobile & Frontend Engineer",
    description:
      "8+ years building apps used by millions. React Native · TypeScript · AI-Powered Features & Agents.",
    url: siteUrl,
    siteName: "Gustavo Costa",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Gustavo Costa — Lead Mobile & Frontend Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gustavo Costa — Lead Mobile & Frontend Engineer",
    description:
      "8+ years building apps used by millions. React Native · TypeScript · AI-Powered Features & Agents.",
    images: [ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

// Avoid theme flash on first paint by setting the class before hydration.
const themeScript = `
(function() {
  try {
    var s = localStorage.getItem('portfolio-theme');
    var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (s === 'dark' || (!s && d)) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
