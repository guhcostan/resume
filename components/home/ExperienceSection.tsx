"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers/LanguageProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ExperienceSection() {
  const { t } = useLocale();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="experience"
      className="border-y border-ink/8 bg-surface-raised/50 dark:border-ink-dark/10 dark:bg-surface-raised-dark/30"
    >
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <SectionHeading index="02 — Experience" title={t.experience.heading} />

        <div className="space-y-3">
          {t.experience.items.map((item, i) => {
            const open = openIndex === i;
            return (
              <article
                key={`${item.company}-${item.role}-${i}`}
                className="reveal overflow-hidden rounded-2xl border border-ink/8 bg-surface shadow-card transition dark:border-ink-dark/10 dark:bg-surface-dark dark:shadow-card-dark"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left md:px-6 md:py-6"
                  aria-expanded={open}
                >
                  <div>
                    <p className="font-mono text-xs text-accent dark:text-accent-dark">
                      {item.period}
                    </p>
                    <h3 className="mt-1 font-display text-2xl text-ink dark:text-ink-dark">
                      {item.role}
                    </h3>
                    <p className="mt-1 text-sm text-ink-muted dark:text-ink-muted-dark">
                      {item.company}
                      {item.location ? ` · ${item.location}` : ""}
                    </p>
                  </div>
                  <span
                    className={`mt-1 shrink-0 font-mono text-lg text-ink-faint transition-transform dark:text-ink-muted-dark ${
                      open ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-out ${
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <ul className="space-y-3 border-t border-ink/8 px-5 pb-5 pt-4 md:px-6 md:pb-6 dark:border-ink-dark/10">
                      {item.bullets.map((bullet, j) => (
                        <li
                          key={j}
                          className="flex gap-3 text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent dark:bg-accent-dark" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
