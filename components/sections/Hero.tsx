"use client";

import { useLocale } from "@/components/LanguageProvider";
import { profile } from "@/lib/content";
import { PhoneChat } from "@/components/PhoneChat";
import {
  DownloadIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  MapPinIcon,
  SparklesIcon,
} from "@/components/icons";

const FLOATING_TAGS = ["React Native", "TypeScript", "Claude", "Next.js"];

export function Hero() {
  const { t } = useLocale();

  return (
    <section id="top" className="relative overflow-hidden">
      <div aria-hidden className="bg-blueprint pointer-events-none absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.16),transparent_60%)]"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-16 pt-14 sm:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:pb-24">
        {/* ------------------------------------------------ intro column */}
        <div>
          <span className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            {t.hero.badge}
          </span>

          <p className="mt-6 animate-fade-up font-mono text-sm text-brand-fg dark:text-violet-300">
            {t.hero.greeting}
          </p>

          <h1 className="mt-3 max-w-xl animate-fade-up font-display text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-[3.4rem] dark:text-white">
            {t.hero.title.split(". ").map((part, i, arr) => (
              <span key={i} className="block">
                {i === arr.length - 1 ? (
                  <span className="bg-gradient-to-r from-brand via-violet-400 to-accent bg-clip-text text-transparent">
                    {part}
                  </span>
                ) : (
                  `${part}.`
                )}
              </span>
            ))}
          </h1>

          <p className="mt-6 max-w-xl animate-fade-up text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {t.hero.tagline}
          </p>

          <p className="mt-4 flex max-w-xl animate-fade-up gap-2.5 rounded-xl border border-brand/25 bg-brand/5 p-3.5 text-sm leading-relaxed text-slate-700 dark:bg-brand/10 dark:text-slate-200">
            <SparklesIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <span>{t.hero.aiHighlight}</span>
          </p>

          <div className="mt-8 flex animate-fade-up flex-wrap items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
            >
              <MailIcon className="h-4 w-4" />
              {t.hero.ctaEmail}
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-brand/60 hover:text-brand-fg dark:border-ink-border dark:text-slate-200 dark:hover:border-brand/60 dark:hover:text-violet-300"
            >
              <LinkedInIcon className="h-4 w-4" />
              {t.hero.ctaResume}
            </a>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-brand/60 hover:text-brand-fg dark:border-ink-border dark:text-slate-200 dark:hover:border-brand/60 dark:hover:text-violet-300"
            >
              <GitHubIcon className="h-4 w-4" />
              GitHub
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-2 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:text-brand-fg dark:text-slate-400 dark:hover:text-violet-300"
            >
              <DownloadIcon className="h-4 w-4" />
              {t.hero.ctaPdf}
            </button>
          </div>

          <div className="mt-6 flex animate-fade-up items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <MapPinIcon className="h-4 w-4" />
            <span>{t.hero.location}</span>
          </div>
        </div>

        {/* ------------------------------------------------ phone column */}
        <div className="relative animate-fade-up" data-print-hide>
          <div
            aria-hidden
            className="glow-violet pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2"
          />
          <PhoneChat />

          {/* Floating tech tags orbiting the phone */}
          <div aria-hidden className="pointer-events-none absolute inset-0 hidden xl:block">
            {FLOATING_TAGS.map((tag, i) => (
              <span
                key={tag}
                className={`absolute rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 font-mono text-[11px] text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-ink-raised/80 dark:text-slate-300 ${
                  i % 2 ? "animate-float-slow" : "animate-float"
                } ${TAG_POSITIONS[i]}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const TAG_POSITIONS = [
  "-left-4 top-16",
  "-right-2 top-32",
  "-left-8 bottom-36",
  "-right-6 bottom-16",
];
