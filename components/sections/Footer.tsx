"use client";

import { useLocale } from "@/components/LanguageProvider";
import { profile } from "@/lib/content";

export function Footer() {
  const { t, locale } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="pb-24 md:pb-0">
      <div className="mx-auto flex max-w-7xl flex-col gap-7 border-t border-stone-900/15 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10 dark:border-white/15">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-[10px] font-bold text-white dark:bg-white dark:text-ink">
            GC
          </span>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
            © {year} {profile.name}
          </p>
        </div>
        <div className="flex items-center gap-5 text-xs text-stone-500 dark:text-stone-400">
          <p>{t.footer.built}</p>
          <a
            href="#top"
            className="font-mono text-[10px] uppercase tracking-[0.14em] transition-colors hover:text-brand"
          >
            ↑ {locale === "pt" ? "Topo" : "Top"}
          </a>
        </div>
      </div>
    </footer>
  );
}
