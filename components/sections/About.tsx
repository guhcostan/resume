"use client";

import { useLocale } from "@/components/LanguageProvider";
import { Section } from "@/components/sections/Section";

export function About() {
  const { t } = useLocale();

  return (
    <Section id="about" index="01" kicker="profile" heading={t.about.heading}>
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="sticker p-6 sm:p-8">
          <div className="space-y-6">
          {t.about.paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="reveal max-w-2xl text-[15px] leading-[1.8] text-ink-soft"
            >
              {paragraph}
            </p>
          ))}
          </div>
        </div>

        {/* "Now" widget — a pinned note on the margin of the page. */}
        <aside className="sticker reveal h-fit p-6">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink-faint">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sage" />
            </span>
            {t.about.nowHeading}
          </div>
          <ul className="mt-5 space-y-4">
            {t.about.now.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 border-b border-dashed border-ink-line pb-4 text-sm leading-relaxed text-ink last:border-none last:pb-0"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </Section>
  );
}
