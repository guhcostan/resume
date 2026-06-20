"use client";

import { useLocale } from "@/components/LanguageProvider";
import { Section } from "@/components/sections/Section";
import { ArrowUpRightIcon, GitHubIcon } from "@/components/icons";

export function OpenSource() {
  const { t } = useLocale();

  return (
    <Section id="projects" heading={t.projects.heading}>
      <p className="reveal mb-6 text-sm text-slate-500 dark:text-slate-400">
        {t.projects.subtitle}
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        {t.projects.items.map((item) => (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="reveal group flex flex-col rounded-xl border border-slate-200 bg-slate-50/50 p-5 transition-colors hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-indigo-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitHubIcon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                <h3 className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
                  {item.name}
                </h3>
              </div>
              <ArrowUpRightIcon className="h-4 w-4 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-indigo-500" />
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {item.description}
            </p>
            <p className="mt-4 text-xs font-semibold text-amber-600 dark:text-amber-400">
              {item.meta}
            </p>
          </a>
        ))}
      </div>
    </Section>
  );
}
