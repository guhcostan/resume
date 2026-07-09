"use client";

import { useLocale } from "@/components/LanguageProvider";
import { Section } from "@/components/sections/Section";
import { GlobeIcon, GraduationIcon, StarIcon } from "@/components/icons";

export function Education() {
  const { t } = useLocale();

  return (
    <Section id="education" index="05" heading={t.education.heading}>
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="reveal relative overflow-hidden rounded-3xl bg-brand p-7 text-white lg:col-span-5 sm:p-8">
          <span
            aria-hidden
            className="absolute -bottom-8 -right-3 font-display text-[9rem] font-black leading-none text-white/10"
          >
            01
          </span>
          <div className="relative flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70">
            <GraduationIcon className="h-4 w-4 text-white" />
            <h3>
              {t.education.heading}
            </h3>
          </div>
          <p className="relative mt-12 max-w-sm font-display text-3xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-4xl">
            {t.education.degree}
          </p>
          <p className="relative mt-4 text-sm font-semibold text-white/85">
            {t.education.school}
          </p>
          <p className="relative mt-7 font-mono text-[10px] uppercase tracking-[0.16em] text-white/65">
            {t.education.period}
          </p>
        </div>

        <div className="surface-card reveal p-7 lg:col-span-4 sm:p-8">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-400">
            <StarIcon className="h-4 w-4" />
            <h3>
              {t.education.certsHeading}
            </h3>
          </div>
          <ul className="mt-7">
            {t.education.certs.map((cert, index) => (
              <li
                key={cert}
                className="grid grid-cols-[1.75rem_1fr] gap-2 border-t border-stone-900/10 py-3 text-sm leading-relaxed text-stone-600 first:border-t-0 dark:border-white/10 dark:text-stone-300"
              >
                <span className="font-mono text-[9px] text-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{cert}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="surface-card reveal h-fit p-7 lg:col-span-3 sm:p-8">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-400">
            <GlobeIcon className="h-4 w-4" />
            <h3>
              {t.education.languagesHeading}
            </h3>
          </div>
          <ul className="mt-7">
            {t.education.languages.map((lang) => (
              <li
                key={lang.name}
                className="border-t border-stone-900/10 py-4 first:border-t-0 dark:border-white/10"
              >
                <span className="block font-display text-lg font-bold text-stone-900 dark:text-white">
                  {lang.name}
                </span>
                <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.12em] text-stone-400">
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
