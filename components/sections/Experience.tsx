"use client";

import { useLocale } from "@/components/LanguageProvider";
import { Section } from "@/components/sections/Section";

export function Experience() {
  const { t } = useLocale();

  return (
    <Section id="experience" heading={t.experience.heading}>
      <ol className="relative space-y-8 border-l border-slate-200 pl-6 dark:border-slate-800">
        {t.experience.items.map((item, i) => (
          <li key={`${item.company}-${i}`} className="reveal relative">
            <span className="absolute -left-[1.6rem] top-1.5 h-3 w-3 rounded-full border-2 border-indigo-500 bg-white dark:bg-slate-950" />
            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {item.role}
                <span className="text-indigo-500"> · {item.company}</span>
              </h3>
              <span className="shrink-0 text-xs font-medium text-slate-500 dark:text-slate-400">
                {item.period}
              </span>
            </div>
            {item.location && (
              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                {item.location}
              </p>
            )}
            <ul className="mt-3 space-y-1.5">
              {item.bullets.map((bullet, j) => (
                <li
                  key={j}
                  className="flex gap-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-indigo-400" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}
