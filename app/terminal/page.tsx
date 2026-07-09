"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/sections/Footer";
import { AiTerminal } from "@/components/AiTerminal";
import { useLocale } from "@/components/LanguageProvider";
import { SparklesIcon } from "@/components/icons";

export default function TerminalPage() {
  const { locale } = useLocale();
  const t =
    locale === "pt"
      ? {
          back: "← voltar",
          heading: "Pergunte à IA sobre o Gustavo",
          sub: "Um agente com IA que roda 100% no seu navegador (WebLLM/WebGPU), respondendo sobre minha carreira — nada sai do seu dispositivo. Digite /help para comandos.",
        }
      : {
          back: "← back",
          heading: "Ask the AI about Gustavo",
          sub: "An AI agent that runs entirely in your browser (WebLLM/WebGPU), answering about my career — nothing leaves your device. Type /help for commands.",
        };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-5 pb-24 pt-10 sm:px-8 sm:pt-16 lg:px-10">
        <div className="mb-10 border-t border-stone-900/15 pt-5 dark:border-white/15">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="eyebrow transition-colors hover:text-brand"
            >
              {t.back}
            </Link>
            <span className="inline-flex items-center gap-2 rounded-full bg-signal px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-ink" />
              beta / local
            </span>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <h1 className="max-w-3xl font-display text-5xl font-bold leading-[0.95] tracking-[-0.055em] text-stone-950 sm:text-7xl dark:text-white">
              <SparklesIcon className="mb-4 h-7 w-7 text-brand" />
              {t.heading}
            </h1>
            <p className="max-w-xl text-sm font-medium leading-relaxed text-stone-600 lg:justify-self-end dark:text-stone-300">
              {t.sub}
            </p>
          </div>
        </div>
        <div className="relative">
          <div
            aria-hidden
            className="hero-halo pointer-events-none absolute inset-x-20 inset-y-0 -z-10 opacity-60"
          />
          <AiTerminal />
        </div>
      </main>
      <Footer />
    </div>
  );
}
