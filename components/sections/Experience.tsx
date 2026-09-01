"use client";

import { useLocale } from "@/components/LanguageProvider";
import { Section } from "@/components/sections/Section";

/**
 * Experience as a magazine feature spread: a sticky left rail with the
 * section intro, and the career entries stacked on the right like article
 * clippings, newest first.
 */
export function Experience() {
  const { t } = useLocale();

  return (
    <Section id="experience" index="02" kicker="career" heading={t.experience.heading}>
      <div className="grid gap-6 lg:grid-cols-[230px_1fr]">
        {/* Sticky rail */}
        <aside className="hidden lg:block">
          <div className="sticker sticky top-24 space-y-4 p-5">
            <p className="font-mono text-xs leading-relaxed text-ink-faint">
              {t.experience.items.length} roles · 2017 → present
            </p>
            <p className="text-sm leading-relaxed text-ink-faint">
              {t.about.paragraphs[1]}
            </p>
          </div>
        </aside>

        {/* Entries */}
        <ol className="space-y-4">
          {t.experience.items.map((item, i) => {
            const isHead = i === 0;
            return (
              <li key={`${item.company}-${i}`} className="sticker reveal relative p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-xl font-semibold tracking-[-0.03em] text-ink sm:text-2xl">
                    {item.role}
                    <span className="text-clay"> · {item.company}</span>
                  </h3>
                  <time className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                    {item.period}
                  </time>
                </div>

                <div className="mt-1.5 flex items-center gap-3">
                  {isHead && (
                    <span className="rounded-full bg-clay px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white">
                      current
                    </span>
                  )}
                  {item.location && (
                    <p className="text-xs text-ink-faint">{item.location}</p>
                  )}
                </div>

                <ul className="mt-4 max-w-3xl space-y-2 border-l border-ink-line pl-5">
                  {item.bullets.map((bullet, j) => (
                    <li
                      key={j}
                      className="relative text-sm leading-relaxed text-ink-soft"
                    >
                      <span className="absolute -left-[1.42rem] top-[0.65rem] h-1 w-1 rounded-full bg-clay/70" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
