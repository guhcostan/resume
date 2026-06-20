"use client";

import { useLocale } from "@/components/LanguageProvider";
import { profile } from "@/lib/content";

export function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-5 py-8 text-center text-xs text-slate-400 sm:flex-row sm:text-left">
        <p>
          © {year} {profile.name}.
        </p>
        <p>{t.footer.built}</p>
      </div>
    </footer>
  );
}
