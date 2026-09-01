"use client";

import { useLocale } from "@/components/LanguageProvider";
import { Section } from "@/components/sections/Section";

/** Per-group accent dot so each category has its own identity. */
const GROUP_ACCENTS = ["bg-clay", "bg-gold", "bg-sage", "bg-clay-deep", "bg-gold", "bg-sage"];

/**
 * Skills as an index page at the back of a book: two-column list with serif
 * group titles and hairline separators.
 */
export function Skills() {
  const { t } = useLocale();

  return (
    <Section id="skills" index="04" kicker="toolkit" heading={t.skills.heading}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {t.skills.groups.map((group, i) => (
          <div key={group.title} className="sticker reveal p-5">
            <div className="mb-4 flex items-center gap-2.5">
              <span
                aria-hidden
                className={`h-2 w-2 rounded-full ${GROUP_ACCENTS[i % GROUP_ACCENTS.length]}`}
              />
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-ink">
                {group.title}
              </h3>
            </div>
            <ul className="space-y-2">
              {group.skills.map((skill) => (
                <li
                  key={skill}
                  className="border-b border-dashed border-ink-line pb-2 text-sm text-ink-soft"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
