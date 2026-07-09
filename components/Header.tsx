"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/LanguageProvider";
import { useTheme } from "@/components/ThemeProvider";
import {
  ArrowUpRightIcon,
  MoonIcon,
  SparklesIcon,
  SunIcon,
} from "@/components/icons";

const TOGGLE_CLASS =
  "inline-flex h-10 items-center justify-center rounded-full border border-stone-900/15 bg-paper/70 text-xs font-bold text-stone-700 transition-all hover:border-brand hover:text-brand-fg dark:border-white/15 dark:bg-ink-raised/70 dark:text-stone-200 dark:hover:border-brand dark:hover:text-brand";

export function Header() {
  const { locale, t, toggleLocale } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const onHome = usePathname() === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { id: "about", label: t.nav.about },
    { id: "experience", label: t.nav.experience },
    { id: "skills", label: t.nav.skills },
    { id: "projects", label: t.nav.projects },
    { id: "contact", label: t.nav.contact },
  ];

  const logo = (
    <span className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand font-display text-sm font-extrabold text-white">
        GC
      </span>
      <span className="hidden leading-tight sm:block">
        <span className="block font-display text-sm font-bold text-stone-950 dark:text-white">
          Gustavo Costa
        </span>
        <span className="block font-mono text-[9px] uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
          Mobile · Frontend · AI
        </span>
      </span>
    </span>
  );

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-stone-900/10 bg-canvas/85 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-ink/85"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-10">
        {onHome ? (
          <a href="#top" aria-label="Gustavo Costa — home">
            {logo}
          </a>
        ) : (
          <Link href="/" aria-label="Gustavo Costa — home">
            {logo}
          </Link>
        )}

        <div className="hidden items-center gap-1 rounded-full border border-stone-900/10 bg-paper/55 p-1 lg:flex dark:border-white/10 dark:bg-white/5">
          {navItems.map((item, index) => (
            <Link
              key={item.id}
              href={onHome ? `#${item.id}` : `/#${item.id}`}
              className="rounded-full px-3 py-2 text-[11px] font-bold text-stone-600 transition-colors hover:bg-white hover:text-stone-950 dark:text-stone-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <span className="mr-1 font-mono text-[9px] text-brand">
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/terminal"
            className="group inline-flex h-10 items-center gap-2 rounded-full bg-ink px-3 text-xs font-bold text-white transition-all hover:bg-brand sm:px-4 dark:bg-brand dark:hover:bg-white dark:hover:text-ink"
          >
            <SparklesIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {locale === "pt" ? "Pergunte à IA" : "Ask the AI"}
            </span>
            <ArrowUpRightIcon className="hidden h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block" />
          </Link>
          <button
            type="button"
            onClick={toggleLocale}
            aria-label="Toggle language"
            className={`${TOGGLE_CLASS} w-10 sm:w-12`}
          >
            {locale === "pt" ? "EN" : "PT"}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`${TOGGLE_CLASS} w-10`}
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
