"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/providers/LanguageProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  CloseIcon,
  MenuIcon,
  MoonIcon,
  SparkIcon,
  SunIcon,
} from "@/components/ui/icons";

export function SiteHeader() {
  const { t, locale, toggleLocale } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "#about", label: t.nav.about },
    { href: "#experience", label: t.nav.experience },
    { href: "#skills", label: t.nav.skills },
    { href: "#projects", label: t.nav.projects },
    { href: "#education", label: t.nav.education },
    { href: "#contact", label: t.nav.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const hrefFor = (hash: string) => (onHome ? hash : `/${hash}`);

  const Logo = onHome ? (
    <a href="#top" className="group flex items-baseline gap-1">
      <span className="font-display text-xl text-ink dark:text-ink-dark">Gustavo</span>
      <span className="font-mono text-xs text-accent dark:text-accent-dark">Costa</span>
    </a>
  ) : (
    <Link href="/" className="group flex items-baseline gap-1">
      <span className="font-display text-xl text-ink dark:text-ink-dark">Gustavo</span>
      <span className="font-mono text-xs text-accent dark:text-accent-dark">Costa</span>
    </Link>
  );

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen
            ? "border-b border-ink/8 bg-canvas/85 backdrop-blur-xl dark:border-ink-dark/10 dark:bg-canvas-dark/85"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          {Logo}

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {links.map((link) =>
              onHome ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-3 py-1.5 text-sm text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink dark:text-ink-muted-dark dark:hover:bg-surface-raised-dark dark:hover:text-ink-dark"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={hrefFor(link.href)}
                  className="rounded-full px-3 py-1.5 text-sm text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink dark:text-ink-muted-dark dark:hover:bg-surface-raised-dark dark:hover:text-ink-dark"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/terminal"
              className="hidden items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-accent/90 sm:inline-flex"
            >
              <SparkIcon className="h-3.5 w-3.5" />
              {locale === "pt" ? "Pergunte à IA" : "Ask AI"}
            </Link>
            <button
              type="button"
              onClick={toggleLocale}
              className="rounded-full border border-ink/10 px-2.5 py-1.5 font-mono text-xs font-medium text-ink-muted transition hover:border-accent/40 hover:text-accent dark:border-ink-dark/15 dark:text-ink-muted-dark"
              aria-label="Toggle language"
            >
              {locale === "pt" ? "EN" : "PT"}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full border border-ink/10 p-2 text-ink-muted transition hover:border-accent/40 hover:text-accent dark:border-ink-dark/15 dark:text-ink-muted-dark"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <SunIcon className="h-4 w-4" />
              ) : (
                <MoonIcon className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-full border border-ink/10 p-2 text-ink-muted lg:hidden dark:border-ink-dark/15"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <CloseIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-canvas/95 pt-20 backdrop-blur-sm dark:bg-canvas-dark/95 lg:hidden">
          <nav className="flex flex-col gap-1 px-5 py-6">
            {links.map((link) =>
              onHome ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 font-display text-2xl text-ink dark:text-ink-dark"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={hrefFor(link.href)}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 font-display text-2xl text-ink dark:text-ink-dark"
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              href="/terminal"
              onClick={() => setMenuOpen(false)}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-white"
            >
              <SparkIcon className="h-4 w-4" />
              {locale === "pt" ? "Pergunte à IA" : "Ask AI"}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
