"use client";

import { useLocale } from "@/components/LanguageProvider";
import { Section } from "@/components/sections/Section";

export function Education() {
  const { t } = useLocale();

  return (
    <Section id="education" heading={t.education.heading}>
      <div className="grid gap-8 md:grid-cols-3">
        {/* Education */}
        <div className="reveal">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
            {t.education.heading}
          </h3>
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-900/40">
            <p className="font-semibold text-slate-900 dark:text-white">
              {t.education.degree}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {t.education.school}
            </p>
            <p className="mt-1 text-xs text-slate-400">{t.education.period}</p>
          </div>
        </div>

        {/* Certifications */}
        <div className="reveal">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
            {t.education.certsHeading}
          </h3>
          <ul className="space-y-2">
            {t.education.certs.map((cert) => (
              <li
                key={cert}
                className="flex gap-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                <span>{cert}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Languages */}
        <div className="reveal">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
            {t.education.languagesHeading}
          </h3>
          <ul className="space-y-2">
            {t.education.languages.map((lang) => (
              <li
                key={lang.name}
                className="flex items-baseline justify-between gap-3 text-sm"
              >
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {lang.name}
                </span>
                <span className="text-xs text-slate-400">{lang.level}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
