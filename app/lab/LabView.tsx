"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/sections/Footer";
import { LiteRtTerminal } from "@/components/LiteRtTerminal";
import { useLocale } from "@/components/LanguageProvider";

export function LabView() {
  const { locale } = useLocale();
  const t =
    locale === "pt"
      ? {
          back: "← voltar",
          heading: "Lab — Gemma 4 (LiteRT-LM)",
          sub: "Página escondida pra testar o runtime LiteRT-LM do Google com Gemma 4 (E2B), rodando no navegador via WebGPU. Experimental — pode falhar dependendo do navegador/dispositivo.",
        }
      : {
          back: "← back",
          heading: "Lab — Gemma 4 (LiteRT-LM)",
          sub: "Hidden page to test Google's LiteRT-LM runtime with Gemma 4 (E2B), running in the browser via WebGPU. Experimental — may fail depending on browser/device.",
        };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-5xl px-5 pb-24 pt-10 sm:px-8 sm:pt-16 lg:px-10">
        <Link
          href="/"
          className="eyebrow transition-colors hover:text-brand"
        >
          {t.back}
        </Link>
        <h1 className="mt-8 flex flex-wrap items-center gap-4 font-display text-4xl font-bold tracking-[-0.04em] text-stone-950 sm:text-6xl dark:text-white">
          <span>{t.heading}</span>
          <span className="rounded-full bg-signal px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-ink">
            experimental
          </span>
        </h1>
        <p className="mb-10 mt-5 max-w-2xl text-sm font-medium leading-relaxed text-stone-600 dark:text-stone-300">
          {t.sub}
        </p>
        <LiteRtTerminal />
      </main>
      <Footer />
    </div>
  );
}
