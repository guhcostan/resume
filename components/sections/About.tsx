"use client";

import { useLocale } from "@/components/LanguageProvider";
import { Section } from "@/components/sections/Section";

export function About() {
  const { t, locale } = useLocale();

  return (
    <Section id="about" index="01" heading={t.about.heading}>
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-6 lg:col-span-7">
          {t.about.paragraphs.map((paragraph, index) => (
            <p
              key={paragraph}
              className={`reveal max-w-3xl leading-relaxed text-stone-600 dark:text-stone-300 ${
                index === 0
                  ? "font-display text-2xl font-semibold leading-snug tracking-[-0.025em] text-stone-900 sm:text-3xl dark:text-white"
                  : "text-[15px] sm:text-base"
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        <aside className="reveal relative h-fit overflow-hidden rounded-[2rem] bg-ink p-6 text-white sm:p-8 lg:col-span-5">
          <div
            aria-hidden
            className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-brand/25 blur-3xl"
          />
          <div className="relative flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400">
            <span className="text-brand">
              {locale === "pt" ? "Nota ao vivo" : "Live note"}
            </span>
            <span className="text-stone-600">/</span>
            {t.about.nowHeading}
            <span className="relative ml-auto flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
          </div>
          <p className="relative mt-7 font-display text-3xl font-bold leading-tight tracking-[-0.04em]">
            {locale === "pt" ? (
              <>
                O que estou
                <br />
                construindo agora.
              </>
            ) : (
              <>
                What I&apos;m
                <br />
                shipping now.
              </>
            )}
          </p>
          <ul className="relative mt-8">
            {t.about.now.map((item, index) => (
              <li
                key={item}
                className="grid grid-cols-[2rem_1fr] gap-3 border-t border-white/10 py-4 text-sm leading-relaxed text-stone-300"
              >
                <span className="font-mono text-[10px] text-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </Section>
  );
}
