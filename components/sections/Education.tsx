"use client";

import { useLocale } from "@/components/LanguageProvider";
import { Section } from "@/components/sections/Section";
import { GlobeIcon, GraduationIcon, StarIcon } from "@/components/icons";

/**
 * Education as a colophon page: degree as the headline entry, certifications
 * and languages as supporting columns.
 */
export function Education() {
  const { t } = useLocale();

  return (
    <Section id="education" index="05" kicker="foundations" heading={t.education.heading}>
      <div className="grid gap-4 md:grid-cols-3">
        {/* Degree */}
        <div className="sticker reveal p-5">
          <div className="mb-4 flex items-center gap-2 text-clay">
            <GraduationIcon className="h-4 w-4" />
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest">
              {t.education.heading}
            </h3>
          </div>
          <p className="text-xl font-semibold leading-snug tracking-[-0.03em] text-ink">
            {t.education.degree}
          </p>
          <p className="mt-2 text-sm text-ink-soft">{t.education.school}</p>
          <p className="mt-3 font-mono text-xs text-ink-faint">
            {t.education.period}
          </p>
        </div>

        {/* Certifications */}
        <div className="sticker reveal p-5">
          <div className="mb-4 flex items-center gap-2 text-gold">
            <StarIcon className="h-4 w-4" />
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest">
              {t.education.certsHeading}
            </h3>
          </div>
          <ul className="space-y-3">
            {t.education.certs.map((cert) => (
              <li
                key={cert}
                className="border-b border-dashed border-ink-line pb-3 text-sm leading-relaxed text-ink-soft last:border-none last:pb-0"
              >
                {cert}
              </li>
            ))}
          </ul>
        </div>

        {/* Languages */}
        <div className="sticker reveal p-5">
          <div className="mb-4 flex items-center gap-2 text-sage">
            <GlobeIcon className="h-4 w-4" />
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest">
              {t.education.languagesHeading}
            </h3>
          </div>
          <ul className="space-y-3">
            {t.education.languages.map((lang) => (
              <li
                key={lang.name}
                className="flex items-baseline justify-between gap-3 border-b border-dashed border-ink-line pb-3 text-sm last:border-none last:pb-0"
              >
                <span className="font-medium text-ink">{lang.name}</span>
                <span className="font-mono text-xs text-ink-faint">
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
