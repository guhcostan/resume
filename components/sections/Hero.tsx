"use client";

import { useLocale } from "@/components/LanguageProvider";
import { profile } from "@/lib/content";
import { AiTerminal } from "@/components/AiTerminal";
import {
  DownloadIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  MapPinIcon,
} from "@/components/icons";

export function Hero() {
  const { t } = useLocale();

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-slate-200/60 dark:border-slate-800/60"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_55%)]"
      />
      <div className="mx-auto grid max-w-5xl items-center gap-12 px-5 py-20 sm:py-24 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
        <p className="animate-fade-up text-sm font-medium text-indigo-500">
          {t.hero.greeting}
        </p>
        <h1 className="mt-2 animate-fade-up text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
          {t.hero.name}
        </h1>
        <p className="mt-4 max-w-3xl animate-fade-up text-lg font-medium text-slate-700 sm:text-xl dark:text-slate-200">
          {t.hero.title}
        </p>

        <div className="mt-3 flex animate-fade-up items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <MapPinIcon className="h-4 w-4" />
          <span>{t.hero.location}</span>
        </div>

        <p className="mt-6 max-w-2xl animate-fade-up text-base leading-relaxed text-slate-600 dark:text-slate-300">
          {t.hero.tagline}
        </p>
        <p className="mt-3 max-w-2xl animate-fade-up rounded-lg border border-indigo-200/60 bg-indigo-50/60 p-3 text-sm leading-relaxed text-indigo-900 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200">
          ✦ {t.hero.aiHighlight}
        </p>

        <div className="mt-8 flex animate-fade-up flex-wrap items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
          >
            <MailIcon className="h-4 w-4" />
            {t.hero.ctaEmail}
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-400 hover:text-indigo-500 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-500"
          >
            <LinkedInIcon className="h-4 w-4" />
            {t.hero.ctaResume}
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-400 hover:text-indigo-500 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-500"
          >
            <DownloadIcon className="h-4 w-4" />
            {t.hero.ctaPdf}
          </button>
        </div>

        <div className="mt-6 flex animate-fade-up items-center gap-4 text-slate-500 dark:text-slate-400">
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="transition-colors hover:text-indigo-500"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="transition-colors hover:text-indigo-500"
          >
            <LinkedInIcon className="h-5 w-5" />
          </a>
        </div>
        </div>

        <div className="animate-fade-up lg:pt-2" data-print-hide>
          <AiTerminal autoPreload={false} autoFocusInput={false} />
        </div>
      </div>
    </section>
  );
}
