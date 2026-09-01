"use client";

import { useLocale } from "@/components/LanguageProvider";
import { profile } from "@/lib/content";

export function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="pb-28 pt-10 lg:pb-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 border-t border-ink-line px-5 pt-6 text-center text-xs text-ink-faint sm:flex-row sm:px-8 sm:text-left">
        <p className="font-display italic">
          © {year} {profile.name}
        </p>
        <p>{t.footer.built}</p>
      </div>
    </footer>
  );
}
