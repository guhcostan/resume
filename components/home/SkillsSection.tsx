"use client";

import { useLocale } from "@/components/providers/LanguageProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";

const BENTO_SPANS = [
  "md:col-span-2 md:row-span-2",
  "",
  "",
  "md:col-span-2",
  "",
  "",
];

export function SkillsSection() {
  const { t } = useLocale();

  return (
    <section id="skills" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <SectionHeading index="03 — Skills" title={t.skills.heading} />

      <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {t.skills.groups.map((group, i) => (
          <div
            key={group.title}
            className={`reveal flex flex-col rounded-2xl border border-ink/8 bg-surface p-5 shadow-card dark:border-ink-dark/10 dark:bg-surface-dark dark:shadow-card-dark ${BENTO_SPANS[i] ?? ""}`}
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <h3 className="font-mono text-xs uppercase tracking-widest text-accent dark:text-accent-dark">
              {group.title}
            </h3>
            <ul className="mt-4 flex flex-1 flex-wrap content-start gap-2">
              {group.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-ink/8 bg-surface-raised px-3 py-1 text-sm text-ink dark:border-ink-dark/10 dark:bg-surface-raised-dark dark:text-ink-dark"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
