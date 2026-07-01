"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/LanguageProvider";
import { useTheme } from "@/components/ThemeProvider";
import { MoonIcon, SparklesIcon, SunIcon } from "@/components/icons";

const TOGGLE_CLASS =
  "rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-brand/60 hover:text-brand-fg dark:border-ink-border dark:text-slate-300 dark:hover:border-brand/60 dark:hover:text-violet-300";

/**
 * Minimal top bar: identity on the left, "Ask AI" + language/theme toggles on
 * the right. Section navigation lives in the bottom Dock (mobile-app style).
 */
export function Header() {
  const { locale, toggleLocale } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const onHome = usePathname() === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logo = (
    <span className="font-mono text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
      <span className="text-brand">~/</span>guhcostan
      <span className="text-brand">_</span>
    </span>
  );

  return (
    <header
      className={`sticky top-0 z-50 transition-colors ${
        scrolled
          ? "border-b border-slate-200/70 bg-slate-50/85 backdrop-blur dark:border-ink-border/80 dark:bg-ink/80"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        {onHome ? <a href="#top">{logo}</a> : <Link href="/">{logo}</Link>}

        <div className="flex items-center gap-2">
          <Link
            href="/terminal"
            className="inline-flex items-center gap-1.5 rounded-lg border border-brand/30 bg-brand/10 px-2.5 py-1.5 text-xs font-semibold text-brand-fg transition-colors hover:bg-brand/20 dark:text-violet-300"
          >
            <SparklesIcon className="h-3.5 w-3.5" />
            {locale === "pt" ? "Terminal IA" : "AI Terminal"}
          </Link>
          <button
            type="button"
            onClick={toggleLocale}
            aria-label="Toggle language"
            className={TOGGLE_CLASS}
          >
            {locale === "pt" ? "EN" : "PT"}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`${TOGGLE_CLASS} p-2`}
          >
            {theme === "dark" ? (
              <SunIcon className="h-4 w-4" />
            ) : (
              <MoonIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
