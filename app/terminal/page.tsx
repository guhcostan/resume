"use client";

import Link from "next/link";
import { AiChatPanel } from "@/components/ai/AiChatPanel";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useLocale } from "@/components/providers/LanguageProvider";

export default function TerminalPage() {
  const { locale } = useLocale();
  const copy =
    locale === "pt"
      ? {
          back: "← Início",
          title: "Assistente sobre o Gustavo",
          subtitle:
            "IA local no navegador (WebLLM + WebGPU). Pergunte sobre experiência, stack e projetos — nada sai do seu dispositivo.",
        }
      : {
          back: "← Home",
          title: "Assistant about Gustavo",
          subtitle:
            "Local in-browser AI (WebLLM + WebGPU). Ask about experience, stack, and projects — nothing leaves your device.",
        };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-8">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-widest text-ink-faint transition hover:text-accent dark:text-ink-muted-dark"
        >
          {copy.back}
        </Link>
        <h1 className="mt-6 font-display text-4xl text-ink dark:text-ink-dark md:text-5xl">
          {copy.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted dark:text-ink-muted-dark">
          {copy.subtitle}
        </p>
        <div className="mt-10">
          <AiChatPanel />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
