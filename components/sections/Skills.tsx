"use client";

import { useLocale } from "@/components/LanguageProvider";
import { Section } from "@/components/sections/Section";

const GROUP_ACCENTS = [
  "bg-brand",
  "bg-accent",
  "bg-signal",
  "bg-sky-400",
  "bg-fuchsia-400",
  "bg-amber-400",
];

export function Skills() {
  const { t, locale } = useLocale();

  return (
    <Section id="skills" index="03" heading={t.skills.heading}>
      <div className="grid gap-4 md:grid-cols-2">
        {t.skills.groups.map((group, index) => (
          <div
            key={group.title}
            className="surface-card reveal group relative overflow-hidden p-6 transition duration-300 hover:-translate-y-1 hover:border-brand/40 sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone-400 dark:text-stone-500">
                {locale === "pt" ? "Competência" : "Capability"} /{" "}
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                aria-hidden
                className={`h-3 w-3 rounded-full ${GROUP_ACCENTS[index % GROUP_ACCENTS.length]}`}
              />
            </div>
            <h3 className="mt-7 font-display text-2xl font-bold tracking-[-0.03em] text-stone-950 dark:text-white">
              {group.title}
            </h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-stone-900/10 bg-white/55 px-3 py-1.5 text-xs font-semibold text-stone-600 transition-colors group-hover:border-stone-900/15 dark:border-white/10 dark:bg-white/5 dark:text-stone-300"
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
