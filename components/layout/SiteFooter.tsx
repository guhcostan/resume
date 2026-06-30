"use client";

import { useLocale } from "@/components/providers/LanguageProvider";
import { profile } from "@/lib/content";

export function SiteFooter() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink/8 dark:border-ink-dark/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-10 text-sm text-ink-muted dark:text-ink-muted-dark md:flex-row md:items-center md:justify-between md:px-8">
        <p>
          © {year} {profile.name}
        </p>
        <p className="font-mono text-xs">{t.footer.built}</p>
      </div>
    </footer>
  );
}
