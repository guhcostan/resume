"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/LanguageProvider";
import { profile } from "@/lib/content";
import {
  ArrowUpRightIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  MapPinIcon,
} from "@/components/ui/icons";

const STATS = [
  { value: "8+", labelEn: "years shipping", labelPt: "anos entregando" },
  { value: "M+", labelEn: "users reached", labelPt: "usuários alcançados" },
  { value: "1.8k", labelEn: "GitHub stars", labelPt: "stars no GitHub" },
];

export function HeroSection() {
  const { t, locale } = useLocale();

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-ink/8 dark:border-ink-dark/10"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-28 md:px-8 md:pb-28 md:pt-36">
        <div className="max-w-4xl">
          <p
            className="animate-fade-in font-mono text-xs uppercase tracking-[0.25em] text-accent dark:text-accent-dark"
            style={{ animationDelay: "0.05s" }}
          >
            {t.hero.greeting}
          </p>

          <h1
            className="animate-slide-up mt-4 font-display text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.95] tracking-tight text-ink dark:text-ink-dark"
            style={{ animationDelay: "0.12s" }}
          >
            {t.hero.name}
          </h1>

          <p
            className="animate-slide-up mt-6 max-w-3xl text-lg leading-relaxed text-ink-muted dark:text-ink-muted-dark md:text-xl"
            style={{ animationDelay: "0.2s" }}
          >
            {t.hero.title}
          </p>

          <div
            className="animate-slide-up mt-4 flex items-center gap-2 text-sm text-ink-faint dark:text-ink-muted-dark"
            style={{ animationDelay: "0.26s" }}
          >
            <MapPinIcon className="h-4 w-4 shrink-0" />
            <span>{t.hero.location}</span>
          </div>
        </div>

        <div
          className="animate-slide-up mt-10 grid gap-4 sm:grid-cols-3"
          style={{ animationDelay: "0.32s" }}
        >
          {STATS.map((stat) => (
            <div
              key={stat.value}
              className="rounded-2xl border border-ink/8 bg-surface/80 p-5 shadow-card backdrop-blur-sm dark:border-ink-dark/10 dark:bg-surface-dark/80 dark:shadow-card-dark"
            >
              <p className="font-display text-3xl text-accent dark:text-accent-dark">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-ink-muted dark:text-ink-muted-dark">
                {locale === "pt" ? stat.labelPt : stat.labelEn}
              </p>
            </div>
          ))}
        </div>

        <p
          className="animate-slide-up mt-10 max-w-2xl text-base leading-relaxed text-ink dark:text-ink-dark/90"
          style={{ animationDelay: "0.38s" }}
        >
          {t.hero.tagline}
        </p>

        <div
          className="animate-slide-up mt-6 inline-flex max-w-2xl items-start gap-3 rounded-2xl border border-accent/20 bg-accent-soft/60 px-4 py-3 dark:border-accent-dark/25 dark:bg-accent/10"
          style={{ animationDelay: "0.44s" }}
          data-print-hide
        >
          <span className="mt-0.5 text-accent dark:text-accent-dark">✦</span>
          <p className="text-sm leading-relaxed text-ink dark:text-ink-dark/90">
            {t.hero.aiHighlight}
          </p>
        </div>

        <div
          className="animate-slide-up mt-10 flex flex-wrap items-center gap-3"
          style={{ animationDelay: "0.5s" }}
        >
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-canvas transition hover:bg-ink/90 dark:bg-ink-dark dark:text-canvas-dark dark:hover:bg-ink-dark/90"
          >
            <MailIcon className="h-4 w-4" />
            {t.hero.ctaEmail}
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-ink/12 bg-surface px-5 py-2.5 text-sm font-medium text-ink transition hover:border-accent/40 hover:text-accent dark:border-ink-dark/15 dark:bg-surface-dark dark:text-ink-dark"
          >
            <LinkedInIcon className="h-4 w-4" />
            {t.hero.ctaResume}
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full border border-ink/12 px-5 py-2.5 text-sm font-medium text-ink-muted transition hover:text-accent dark:border-ink-dark/15 dark:text-ink-muted-dark"
          >
            {t.hero.ctaPdf}
          </button>
          <Link
            href="/terminal"
            data-print-hide
            className="inline-flex items-center gap-2 rounded-full border border-accent/30 px-5 py-2.5 text-sm font-medium text-accent transition hover:bg-accent hover:text-white dark:text-accent-dark dark:hover:bg-accent-dark dark:hover:text-ink"
          >
            {locale === "pt" ? "Conversar com IA" : "Chat with AI"}
            <ArrowUpRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <div
          className="animate-slide-up mt-8 flex items-center gap-4"
          style={{ animationDelay: "0.56s" }}
        >
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-ink-muted transition hover:text-accent dark:text-ink-muted-dark"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-ink-muted transition hover:text-accent dark:text-ink-muted-dark"
          >
            <LinkedInIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
