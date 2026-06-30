"use client";

import { useLocale } from "@/components/LanguageProvider";
import { Section } from "@/components/sections/Section";

export function Skills() {
  const { t } = useLocale();

  return (
    <Section id="skills" heading={t.skills.heading}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {t.skills.groups.map((group) => (
          <div
            key={group.title}
            className="reveal rounded-xl border border-slate-200 bg-slate-50/50 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-indigo-700"
          >
            <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
              {group.title}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
