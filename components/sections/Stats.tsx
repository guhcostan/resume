"use client";

import { useLocale } from "@/components/LanguageProvider";

export function Stats() {
  const { t } = useLocale();

  return (
    <section className="border-y border-slate-200/70 bg-white/50 dark:border-ink-border dark:bg-ink-raised/40">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-slate-200/70 px-5 py-8 sm:grid-cols-4 sm:divide-x dark:divide-ink-border">
        {t.stats.map((stat) => (
          <div key={stat.label} className="reveal px-4 py-3 text-center">
            <div className="bg-gradient-to-r from-brand to-accent bg-clip-text font-display text-3xl font-bold text-transparent sm:text-4xl">
              {stat.value}
            </div>
            <div className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
