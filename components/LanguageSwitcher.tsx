"use client";

import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { asset } from "@/lib/content";
import { dictionaries, localePath, type Locale, type LocalizedProps } from "@/lib/i18n";

export function LanguageSwitcher({ locale }: LocalizedProps) {
  const router = useRouter();
  function select(event: MouseEvent<HTMLAnchorElement>, next: Locale) {
    try { localStorage.setItem("guh-language", next); } catch { /* The URL still selects the language. */ }
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    router.push(`${localePath(next)}${window.location.hash}`);
  }
  return <nav className="language-switch" aria-label={dictionaries[locale].common.language}>
    <a href={asset("/")} lang="pt-BR" hrefLang="pt-BR" aria-label="Português" aria-current={locale === "pt" ? "page" : undefined} onClick={event => select(event, "pt")}>PT</a>
    <a href={asset("/en/")} lang="en" hrefLang="en" aria-label="English" aria-current={locale === "en" ? "page" : undefined} onClick={event => select(event, "en")}>EN</a>
  </nav>;
}
