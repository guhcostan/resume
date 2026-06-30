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
    <div>
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <Link
          href="/"
          className="text-sm text-slate-500 transition-colors hover:text-fuchsia-500 dark:text-slate-400"
        >
          {t.back}
        </Link>
        <h1 className="mt-4 flex flex-wrap items-center gap-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          <span>
            <span className="text-fuchsia-500">$</span> {t.heading}
          </span>
          <span className="rounded-full bg-fuchsia-500/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-fuchsia-600 dark:text-fuchsia-400">
            experimental
          </span>
        </h1>
        <p className="mb-8 mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {t.sub}
        </p>
        <LiteRtTerminal />
      </main>
      <Footer />
    </div>
  );
}
