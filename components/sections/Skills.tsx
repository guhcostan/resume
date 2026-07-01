"use client";

import { useLocale } from "@/components/LanguageProvider";
import { Section } from "@/components/sections/Section";

/** Per-group accent so the grid reads like a set of app categories. */
const GROUP_ACCENTS = [
  "from-violet-500 to-fuchsia-500",
  "from-sky-500 to-cyan-400",
  "from-emerald-500 to-teal-400",
  "from-amber-500 to-orange-400",
  "from-fuchsia-500 to-pink-500",
  "from-cyan-400 to-blue-500",
];

export function Skills() {
  const { t } = useLocale();

  return (
    <Section id="skills" index="03" heading={t.skills.heading}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {t.skills.groups.map((group, i) => (
          <div
            key={group.title}
            className="reveal group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10 dark:border-ink-border dark:bg-ink-raised"
          >
            <div className="mb-4 flex items-center gap-2.5">
              <span
                aria-hidden
                className={`h-2.5 w-2.5 rounded-sm bg-gradient-to-br ${GROUP_ACCENTS[i % GROUP_ACCENTS.length]}`}
              />
              <h3 className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
                {group.title}
              </h3>
            </div>
            <ul className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-white/5 dark:bg-white/5 dark:text-slate-300"
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
