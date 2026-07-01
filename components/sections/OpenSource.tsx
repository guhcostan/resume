"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/LanguageProvider";
import { Section } from "@/components/sections/Section";
import { ArrowUpRightIcon, StarIcon } from "@/components/icons";

const GH_USER = "guhcostan";

/** App-icon-style gradient tiles, one per project. */
const TILE_GRADIENTS = [
  "from-violet-500 to-fuchsia-500",
  "from-sky-500 to-cyan-400",
  "from-emerald-500 to-teal-400",
  "from-amber-500 to-orange-500",
  "from-pink-500 to-rose-500",
];

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

/** Open source projects presented like an app-store listing. */
export function OpenSource() {
  const { t } = useLocale();
  const items = t.projects.items;
  const liveStars = useGitHubStars(items.map((i) => i.repo));

  return (
    <Section id="projects" index="04" heading={t.projects.heading}>
      <p className="reveal -mt-4 mb-8 text-sm text-slate-500 dark:text-slate-400">
        {t.projects.subtitle}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item, i) => {
          const stars = liveStars[item.repo] ?? item.fallbackStars;
          return (
            <a
              key={item.repo}
              href={`https://github.com/${GH_USER}/${item.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal group flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10 dark:border-ink-border dark:bg-ink-raised"
            >
              {/* App icon tile */}
              <div
                aria-hidden
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br font-mono text-lg font-bold text-white ${TILE_GRADIENTS[i % TILE_GRADIENTS.length]}`}
              >
                {item.name.charAt(0)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate font-mono text-sm font-semibold text-slate-900 dark:text-white">
                    {item.name}
                  </h3>
                  <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400 dark:text-slate-500">
                    {item.tag}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                    <StarIcon className="h-3.5 w-3.5" />
                    {formatStars(stars)}
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </Section>
  );
}
