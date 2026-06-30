"use client";

import Link from "next/link";
import { LiteRtChatPanel } from "@/components/ai/LiteRtChatPanel";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useLocale } from "@/components/providers/LanguageProvider";

export function LabPageClient() {
  const { locale } = useLocale();
  const copy =
    locale === "pt"
      ? {
          back: "← Início",
          title: "Lab — Gemma 4",
          subtitle:
            "Página experimental para testar LiteRT-LM do Google. Pode falhar fora do Chrome/Edge desktop.",
        }
      : {
          back: "← Home",
          title: "Lab — Gemma 4",
          subtitle:
            "Experimental page to test Google's LiteRT-LM runtime. May fail outside desktop Chrome/Edge.",
        };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-8">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-widest text-ink-faint transition hover:text-accent"
        >
          {copy.back}
        </Link>
        <h1 className="mt-6 font-display text-4xl text-ink dark:text-ink-dark">{copy.title}</h1>
        <p className="mt-4 text-base text-ink-muted dark:text-ink-muted-dark">{copy.subtitle}</p>
        <div className="mt-10">
          <LiteRtChatPanel />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
