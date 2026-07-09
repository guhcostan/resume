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

const FLOATING_TAGS = ["React Native", "TypeScript", "AI agents", "Next.js"];

export function Hero() {
  const { t, locale } = useLocale();
  const titleParts = t.hero.title.split(". ");

  return (
    <section id="top" className="relative overflow-hidden pb-10 pt-6 sm:pt-10">
      <div
        aria-hidden
        className="editorial-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[78%] opacity-35 [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div className="pointer-events-none absolute -left-24 top-32 -z-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(380px,0.88fr)] lg:gap-10 lg:px-10">
        <div className="pb-4 pt-8 lg:py-14">
          <div className="flex animate-fade-up flex-wrap items-center gap-x-5 gap-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-stone-900/15 bg-paper/60 px-3 py-1.5 text-[11px] font-bold text-stone-700 dark:border-white/15 dark:bg-white/5 dark:text-stone-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
              </span>
              {t.hero.badge}
            </span>
            <span className="eyebrow">
              {locale === "pt" ? "Brasil · Remoto" : "Brazil · Remote"}
            </span>
          </div>

          <p className="mt-9 animate-fade-up font-mono text-xs uppercase tracking-[0.16em] text-brand">
            {t.hero.greeting}
          </p>

          <h1 className="mt-4 max-w-4xl animate-fade-up font-display text-[clamp(3.25rem,7.6vw,7rem)] font-bold leading-[0.92] tracking-[-0.065em] text-stone-950 dark:text-white">
            {titleParts.map((part, index) => (
              <span key={part} className="block">
                {index === titleParts.length - 1 ? (
                  <span className="text-brand">{part}</span>
                ) : (
                  `${part}.`
                )}
              </span>
            ))}
          </h1>

          <p className="mt-8 max-w-2xl animate-fade-up text-base font-medium leading-relaxed text-stone-600 sm:text-lg dark:text-stone-300">
            {t.hero.tagline}
          </p>

          <div className="mt-8 flex animate-fade-up flex-wrap items-center gap-3">
            <a href={`mailto:${profile.email}`} className="button-primary">
              <MailIcon className="h-4 w-4" />
              {t.hero.ctaEmail}
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="button-secondary"
            >
              <LinkedInIcon className="h-4 w-4" />
              {t.hero.ctaResume}
            </a>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="button-secondary"
            >
              <GitHubIcon className="h-4 w-4" />
              GitHub
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-2 py-3 text-sm font-bold text-stone-500 transition-colors hover:text-brand dark:text-stone-400"
            >
              <DownloadIcon className="h-4 w-4" />
              {t.hero.ctaPdf}
            </button>
          </div>

          <div className="mt-10 grid animate-fade-up gap-5 border-t border-stone-900/15 pt-5 sm:grid-cols-[1fr_auto] dark:border-white/15">
            <p className="flex max-w-xl gap-3 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
              <SparklesIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <span>{t.hero.aiHighlight}</span>
            </p>
            <div className="flex items-start gap-2 text-xs font-semibold text-stone-500 sm:justify-end dark:text-stone-400">
              <MapPinIcon className="h-4 w-4 shrink-0 text-brand" />
              <span className="max-w-48">{t.hero.location}</span>
            </div>
          </div>
        </div>

        <div className="relative animate-fade-up" data-print-hide>
          <div className="relative mx-auto max-w-[470px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-ink px-4 pb-7 pt-5 shadow-editorial sm:px-8 sm:pb-9">
            <div className="relative z-10 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-400">
                <span className="h-2 w-2 rounded-full bg-signal" />
                {locale === "pt" ? "Ao vivo / no dispositivo" : "Live / on-device"}
              </div>
              <span className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-stone-400">
                WebGPU
              </span>
            </div>

            <div
              aria-hidden
              className="hero-halo pointer-events-none absolute inset-0"
            />
            <span
              aria-hidden
              className="text-outline pointer-events-none absolute -right-3 top-12 font-display text-[10rem] font-black leading-none"
            >
              AI
            </span>

            <div className="relative z-10">
              <PhoneChat />
            </div>

            <div className="relative z-10 mt-6 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-stone-500">
              <span>{locale === "pt" ? "Privado por design" : "Private by design"}</span>
              <span>01 / 01</span>
            </div>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden xl:block"
          >
            {FLOATING_TAGS.map((tag, index) => (
              <span
                key={tag}
                className={`absolute rounded-full border border-stone-900/10 bg-paper/90 px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-wide text-stone-600 shadow-sm backdrop-blur dark:border-white/15 dark:bg-ink-raised/90 dark:text-stone-300 ${
                  index % 2 ? "animate-float-slow" : "animate-float"
                } ${TAG_POSITIONS[index]}`}
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
  "-left-9 top-24",
  "-right-8 top-44",
  "-left-12 bottom-48",
  "-right-10 bottom-24",
];
