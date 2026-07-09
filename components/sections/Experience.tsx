"use client";

import { useLocale } from "@/components/LanguageProvider";
import { Section } from "@/components/sections/Section";

export function Experience() {
  const { t, locale } = useLocale();

  return (
    <Section id="experience" index="02" heading={t.experience.heading}>
      <div className="reveal mb-6 flex items-center justify-between">
        <p className="eyebrow">
          {locale === "pt" ? "Linha do tempo / 2017—hoje" : "Timeline / 2017—now"}
        </p>
        <span className="hidden font-mono text-[10px] text-stone-400 sm:block dark:text-stone-500">
          {t.experience.items.length} {locale === "pt" ? "cargos" : "roles"}
        </span>
      </div>

      <ol className="surface-card overflow-hidden">
        {t.experience.items.map((item, index) => {
          const current = index === 0;
          return (
            <li
              key={`${item.company}-${item.role}`}
              className={`reveal group grid gap-5 border-b border-stone-900/10 p-5 transition-colors last:border-b-0 sm:p-7 md:grid-cols-[11rem_1fr] lg:grid-cols-[13rem_1fr] dark:border-white/10 ${
                current
                  ? "bg-ink text-white dark:bg-brand"
                  : "hover:bg-white/55 dark:hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex items-start justify-between gap-4 md:block">
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.16em] ${
                    current ? "text-brand dark:text-white" : "text-stone-400"
                  }`}
                >
                  {locale === "pt" ? "Cargo" : "Role"} /{" "}
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p
                  className={`mt-0 font-mono text-xs md:mt-4 ${
                    current ? "text-stone-400 dark:text-white/70" : "text-stone-500"
                  }`}
                >
                  {item.period}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3
                      className={`font-display text-2xl font-bold tracking-[-0.03em] sm:text-3xl ${
                        current ? "text-white" : "text-stone-950 dark:text-white"
                      }`}
                    >
                      {item.role}
                    </h3>
                    <p
                      className={`mt-1 text-sm font-bold ${
                        current ? "text-brand dark:text-white" : "text-brand"
                      }`}
                    >
                      {item.company}
                    </p>
                  </div>
                  {current && (
                    <span className="rounded-full bg-signal px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-ink">
                      {t.experience.present}
                    </span>
                  )}
                </div>

                {item.location && (
                  <p
                    className={`mt-2 text-xs ${
                      current ? "text-stone-500 dark:text-white/60" : "text-stone-400"
                    }`}
                  >
                    {item.location}
                  </p>
                )}

                <ul className="mt-5 grid gap-2.5 lg:grid-cols-2 lg:gap-x-8">
                  {item.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className={`flex gap-3 text-sm leading-relaxed ${
                        current
                          ? "text-stone-300 dark:text-white/85"
                          : "text-stone-600 dark:text-stone-300"
                      }`}
                    >
                      <span
                        className={`mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full ${
                          current ? "bg-brand dark:bg-signal" : "bg-brand"
                        }`}
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
