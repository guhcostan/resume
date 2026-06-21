"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/sections/Footer";
import { AiTerminal } from "@/components/AiTerminal";
import { useLocale } from "@/components/LanguageProvider";

export default function TerminalPage() {
  const { locale } = useLocale();
  const t =
    locale === "pt"
      ? {
          back: "← voltar",
          heading: "Pergunte à IA sobre o Gustavo",
          sub: "Um agente com IA respondendo sobre minha carreira — roda na nuvem (Groq) ou direto no seu navegador (WebLLM/WebGPU). Digite /help para comandos.",
        }
      : {
          back: "← back",
          heading: "Ask the AI about Gustavo",
          sub: "An AI agent answering about my career — runs in the cloud (Groq) or right in your browser (WebLLM/WebGPU). Type /help for commands.",
        };

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <Link
          href="/"
          className="text-sm text-slate-500 transition-colors hover:text-indigo-500 dark:text-slate-400"
        >
          {t.back}
        </Link>
        <h1 className="mt-4 flex flex-wrap items-center gap-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          <span>
            <span className="text-indigo-500">$</span> {t.heading}
          </span>
          <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
            beta
          </span>
        </h1>
        <p className="mb-8 mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {t.sub}
        </p>
        <AiTerminal />
      </main>
      <Footer />
    </div>
  );
}
