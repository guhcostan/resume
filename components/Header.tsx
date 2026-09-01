"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/LanguageProvider";
import { SparklesIcon } from "@/components/icons";

const NAV_LINKS = [
  { id: "projects", key: "projects" },
  { id: "about", key: "about" },
  { id: "experience", key: "experience" },
  { id: "skills", key: "skills" },
  { id: "contact", key: "contact" },
] as const;

export function Header() {
  const { t, locale, toggleLocale } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const onHome = usePathname() === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logo = <span className="font-mono text-[13px] font-semibold tracking-[-0.02em] text-ink">guhcostan<span className="text-clay">/</span>portfolio</span>;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-ink-line bg-paper/90 backdrop-blur"
          : "border-b border-ink-line/60 bg-paper/60 backdrop-blur-sm"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
        {onHome ? <a href="#top">{logo}</a> : <Link href="/">{logo}</Link>}

        <div className="hidden items-center gap-5 lg:flex">
          {NAV_LINKS.map(({ id, key }) => (
            <a
              key={id}
              href={`#${id}`}
              className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint transition-colors hover:text-ink"
            >
              {t.nav[key]}
            </a>
          ))}
          <a href="#resume" className="font-mono text-[10px] uppercase tracking-[0.12em] text-clay-deep transition-colors hover:text-ink">
            {locale === "pt" ? "Resumo" : "Resume"}
          </a>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/terminal"
            className="pill inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold"
          >
            <SparklesIcon className="h-3.5 w-3.5" />
            {locale === "pt" ? "Terminal IA" : "AI Terminal"}
          </Link>
          <button
            type="button"
            onClick={toggleLocale}
            aria-label="Toggle language"
            className="rounded-full border border-ink-line bg-paper-card px-2.5 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-clay/60 hover:text-clay-deep"
          >
            {locale === "pt" ? "EN" : "PT"}
          </button>
        </div>
      </nav>
    </header>
  );
}
