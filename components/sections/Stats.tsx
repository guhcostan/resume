"use client";

import { useLocale } from "@/components/LanguageProvider";

export function Stats() {
  const { t, locale } = useLocale();

  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
      <div className="grid grid-cols-2 overflow-hidden rounded-3xl border border-stone-900/15 bg-ink text-white sm:grid-cols-4 dark:border-white/10">
        {t.stats.map((stat, index) => (
          <div
            key={stat.label}
            className="reveal relative min-h-40 border-b border-r border-white/10 p-5 last:border-r-0 sm:border-b-0 sm:p-6"
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-stone-500">
              {locale === "pt" ? "Sinal" : "Signal"} /{" "}
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="mt-5 font-display text-4xl font-bold tracking-[-0.05em] text-white sm:text-5xl">
              {stat.value}
            </div>
            <div className="mt-2 max-w-40 text-xs font-medium leading-relaxed text-stone-400">
              {stat.label}
            </div>
            <span
              aria-hidden
              className={`absolute bottom-5 right-5 h-2 w-2 rounded-full ${
                index === 0 ? "bg-signal" : "bg-brand"
              }`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
