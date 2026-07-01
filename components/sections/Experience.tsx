"use client";

import { useLocale } from "@/components/LanguageProvider";
import { Section } from "@/components/sections/Section";

/**
 * Deterministic short "commit hash" for a career entry, so the git-log-styled
 * timeline is stable across renders and locales.
 */
function commitHash(seed: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0").slice(0, 7);
}

/** Experience rendered as a `git log` of the career — newest commit on top. */
export function Experience() {
  const { t } = useLocale();

  return (
    <Section id="experience" index="02" heading={t.experience.heading}>
      <p
        className="reveal -mt-6 mb-10 font-mono text-xs text-slate-400 dark:text-slate-500"
        data-print-hide
      >
        $ git log --career
      </p>

      <ol className="relative space-y-10 border-l border-slate-200 pl-8 dark:border-ink-border">
        {t.experience.items.map((item, i) => {
          const hash = commitHash(`${item.company}-${item.period}`);
          const isHead = i === 0;
          return (
            <li key={`${item.company}-${i}`} className="reveal relative">
              {/* Commit dot */}
              <span
                className={`absolute -left-[2.55rem] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                  isHead
                    ? "border-brand bg-brand/20"
                    : "border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-ink"
                }`}
              >
                {isHead && <span className="h-1.5 w-1.5 rounded-full bg-brand" />}
              </span>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="font-mono text-xs text-amber-600 dark:text-amber-400">
                  {hash}
                </span>
                {isHead && (
                  <span className="rounded-full border border-brand/40 bg-brand/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-brand-fg dark:text-violet-300">
                    HEAD → main
                  </span>
                )}
                <span className="ml-auto shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500 dark:bg-white/5 dark:text-slate-400">
                  {item.period}
                </span>
              </div>

              <h3 className="mt-2 font-display text-lg font-semibold text-slate-900 dark:text-white">
                {item.role}
                <span className="text-brand-fg dark:text-violet-400"> @ {item.company}</span>
              </h3>
              {item.location && (
                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                  {item.location}
                </p>
              )}

              <ul className="mt-3 space-y-1.5">
                {item.bullets.map((bullet, j) => (
                  <li
                    key={j}
                    className="flex gap-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                  >
                    <span className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-brand/70" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
