"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/LanguageProvider";
import { useTheme } from "@/components/ThemeProvider";
import { MoonIcon, SunIcon } from "@/components/icons";

export function Header() {
  const { t, locale, toggleLocale } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { href: "#about", label: t.nav.about },
    { href: "#experience", label: t.nav.experience },
    { href: "#skills", label: t.nav.skills },
    { href: "#projects", label: t.nav.projects },
    { href: "#education", label: t.nav.education },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-colors ${
        scrolled
          ? "border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/80"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <a
          href="#top"
          className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white"
        >
          GC<span className="text-indigo-500">.</span>
        </a>

        <ul className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-sm text-slate-600 transition-colors hover:text-indigo-500 dark:text-slate-300 dark:hover:text-indigo-400"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/terminal"
              className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20"
            >
              <span className="text-xs">✦</span>
              {locale === "pt" ? "Pergunte à IA" : "Ask AI"}
              <span className="rounded bg-amber-500/15 px-1 py-0.5 text-[9px] font-semibold uppercase text-amber-600 dark:text-amber-400">
                beta
              </span>
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLocale}
            aria-label="Toggle language"
            className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-indigo-400 hover:text-indigo-500 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-500"
          >
            {locale === "pt" ? "EN" : "PT"}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-md border border-slate-200 p-2 text-slate-700 transition-colors hover:border-indigo-400 hover:text-indigo-500 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-500"
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
