"use client";

import { useLocale } from "@/components/LanguageProvider";
import { Section } from "@/components/sections/Section";

export function About() {
  const { t } = useLocale();

  return (
    <Section id="about" heading={t.about.heading}>
      <div className="reveal max-w-3xl space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
        {t.about.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </Section>
  );
}
