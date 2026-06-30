"use client";

import { useLocale } from "@/components/providers/LanguageProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function EducationSection() {
  const { t } = useLocale();

  return (
    <section id="education" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <SectionHeading index="05 — Education" title={t.education.heading} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="reveal rounded-2xl border border-ink/8 bg-surface p-6 shadow-card dark:border-ink-dark/10 dark:bg-surface-dark dark:shadow-card-dark lg:col-span-1">
          <p className="font-mono text-xs uppercase tracking-widest text-accent dark:text-accent-dark">
            {t.education.heading}
          </p>
          <h3 className="mt-3 font-display text-2xl text-ink dark:text-ink-dark">
            {t.education.degree}
          </h3>
          <p className="mt-2 text-sm text-ink-muted dark:text-ink-muted-dark">
            {t.education.school}
          </p>
          <p className="mt-1 font-mono text-xs text-ink-faint">{t.education.period}</p>
        </div>

        <div className="reveal rounded-2xl border border-ink/8 bg-surface p-6 shadow-card dark:border-ink-dark/10 dark:bg-surface-dark dark:shadow-card-dark lg:col-span-1">
          <p className="font-mono text-xs uppercase tracking-widest text-accent dark:text-accent-dark">
            {t.education.certsHeading}
          </p>
          <ul className="mt-4 space-y-2.5">
            {t.education.certs.map((cert) => (
              <li
                key={cert}
                className="text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark"
              >
                {cert}
              </li>
            ))}
          </ul>
        </div>

        <div className="reveal rounded-2xl border border-ink/8 bg-surface p-6 shadow-card dark:border-ink-dark/10 dark:bg-surface-dark dark:shadow-card-dark lg:col-span-1">
          <p className="font-mono text-xs uppercase tracking-widest text-accent dark:text-accent-dark">
            {t.education.languagesHeading}
          </p>
          <ul className="mt-4 space-y-3">
            {t.education.languages.map((lang) => (
              <li key={lang.name} className="flex items-baseline justify-between gap-3">
                <span className="font-medium text-ink dark:text-ink-dark">{lang.name}</span>
                <span className="text-xs text-ink-faint dark:text-ink-muted-dark">
                  {lang.level}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
