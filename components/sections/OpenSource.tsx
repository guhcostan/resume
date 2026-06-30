"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/LanguageProvider";
import { Section } from "@/components/sections/Section";
import { ArrowUpRightIcon, GitHubIcon, StarIcon } from "@/components/icons";

const GH_USER = "guhcostan";

function formatStars(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
}

/**
 * Fetches live star counts from the public GitHub API (no auth needed, ~60
 * req/h per IP — plenty for a portfolio). Falls back to the bundled counts
 * while loading or if the request is rate-limited/unavailable.
 */
function useGitHubStars(repos: string[]) {
  const [stars, setStars] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      repos.map(async (repo) => {
        try {
          const res = await fetch(
            `https://api.github.com/repos/${GH_USER}/${repo}`
          );
          if (!res.ok) return null;
          const data = await res.json();
          return [repo, data.stargazers_count as number] as const;
        } catch {
          return null;
        }
      })
    ).then((pairs) => {
      if (cancelled) return;
      const next: Record<string, number> = {};
      for (const p of pairs) if (p) next[p[0]] = p[1];
      setStars(next);
    });
    return () => {
      cancelled = true;
    };
    // repos is a stable list from content; join to satisfy exhaustive-deps
  }, [repos.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  return stars;
}

export function OpenSource() {
  const { t } = useLocale();
  const items = t.projects.items;
  const liveStars = useGitHubStars(items.map((i) => i.repo));

  return (
    <Section id="projects" heading={t.projects.heading}>
      <p className="reveal mb-6 text-sm text-slate-500 dark:text-slate-400">
        {t.projects.subtitle}
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        {items.map((item) => {
          const stars = liveStars[item.repo] ?? item.fallbackStars;
          return (
            <a
              key={item.repo}
              href={`https://github.com/${GH_USER}/${item.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal group flex flex-col rounded-xl border border-slate-200 bg-slate-50/50 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-indigo-700"
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
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-400 dark:text-slate-500">
                  {item.tag}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                  <StarIcon className="h-3.5 w-3.5" />
                  {formatStars(stars)}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </Section>
  );
}
