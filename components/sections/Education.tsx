"use client";

import { useLocale } from "@/components/LanguageProvider";
import { Section } from "@/components/sections/Section";
import { GlobeIcon, GraduationIcon, StarIcon } from "@/components/icons";

export function Education() {
  const { t } = useLocale();

  return (
    <Section id="education" index="05" heading={t.education.heading}>
      <div className="grid gap-5 md:grid-cols-3">
        {/* Degree */}
        <div className="reveal rounded-2xl border border-slate-200 bg-white p-5 dark:border-ink-border dark:bg-ink-raised">
          <div className="mb-3 flex items-center gap-2 text-slate-400 dark:text-slate-500">
            <GraduationIcon className="h-4 w-4" />
            <h3 className="text-xs font-semibold uppercase tracking-wide">
              {t.education.heading}
            </h3>
          </div>
          <p className="font-display font-semibold text-slate-900 dark:text-white">
            {t.education.degree}
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {t.education.school}
          </p>
          <p className="mt-2 font-mono text-xs text-slate-400">
            {t.education.period}
          </p>
        </div>

        {/* Certifications */}
        <div className="reveal rounded-2xl border border-slate-200 bg-white p-5 dark:border-ink-border dark:bg-ink-raised">
          <div className="mb-3 flex items-center gap-2 text-slate-400 dark:text-slate-500">
            <StarIcon className="h-4 w-4" />
            <h3 className="text-xs font-semibold uppercase tracking-wide">
              {t.education.certsHeading}
            </h3>
          </div>
          <ul className="space-y-2">
            {t.education.certs.map((cert) => (
              <li
                key={cert}
                className="flex gap-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
              >
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand/70" />
                <span>{cert}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Languages */}
        <div className="reveal h-fit rounded-2xl border border-slate-200 bg-white p-5 dark:border-ink-border dark:bg-ink-raised">
          <div className="mb-3 flex items-center gap-2 text-slate-400 dark:text-slate-500">
            <GlobeIcon className="h-4 w-4" />
            <h3 className="text-xs font-semibold uppercase tracking-wide">
              {t.education.languagesHeading}
            </h3>
          </div>
          <ul className="space-y-2.5">
            {t.education.languages.map((lang) => (
              <li
                key={lang.name}
                className="flex items-baseline justify-between gap-3 text-sm"
              >
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {lang.name}
                </span>
                <span className="font-mono text-xs text-slate-400">
                  {lang.level}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
