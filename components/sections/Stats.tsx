"use client";

import { useLocale } from "@/components/LanguageProvider";

/**
 * Full-width stat band under the hero marquee — big serif numerals separated
 * by hairlines, like a magazine fact box.
 */
export function Stats() {
  const { t } = useLocale();

  return (
    <section className="mx-auto max-w-7xl px-5 pt-2 sm:px-8">
      <div className="sticker grid grid-cols-2 divide-x divide-y divide-ink-line overflow-hidden sm:grid-cols-4 sm:divide-y-0">
        {t.stats.map((stat) => (
          <div key={stat.label} className="reveal px-4 py-6 text-center sm:py-7">
            <div className="text-4xl font-semibold tracking-[-0.05em] text-clay sm:text-5xl">
              {stat.value}
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
