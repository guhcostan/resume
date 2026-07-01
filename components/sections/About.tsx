"use client";

import { useLocale } from "@/components/LanguageProvider";
import { Section } from "@/components/sections/Section";

export function About() {
  const { t } = useLocale();

  return (
    <Section id="about" index="01" heading={t.about.heading}>
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          {t.about.paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="reveal max-w-2xl leading-relaxed text-slate-600 dark:text-slate-300"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* "Now" widget — what I'm doing right now, phone-widget style */}
        <aside className="reveal h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-ink-border dark:bg-ink-raised">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 dark:text-slate-500">
            <span className="text-brand">{"//"}</span> {t.about.nowHeading}
            <span className="relative ml-auto flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
          </div>
          <ul className="mt-4 space-y-3">
            {t.about.now.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-brand to-accent" />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </Section>
  );
}
