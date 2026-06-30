"use client";

import { useLocale } from "@/components/providers/LanguageProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AboutSection() {
  const { t } = useLocale();

  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <SectionHeading index="01 — About" title={t.about.heading} />
      <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:gap-16">
        <div className="reveal hidden md:block">
          <div className="sticky top-28 rounded-3xl border border-ink/8 bg-surface-raised p-8 dark:border-ink-dark/10 dark:bg-surface-raised-dark">
            <p className="font-display text-3xl leading-snug text-ink dark:text-ink-dark">
              {t.hero.tagline.split("—")[0]?.trim()}
            </p>
            <div className="mt-6 h-px w-12 bg-accent dark:bg-accent-dark" />
            <p className="mt-6 font-mono text-xs uppercase tracking-widest text-ink-faint">
              Thoughtworks · LatamPass · AI
            </p>
          </div>
        </div>
        <div className="space-y-6">
          {t.about.paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="reveal text-lg leading-[1.75] text-ink-muted dark:text-ink-muted-dark"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
