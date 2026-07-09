"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/LanguageProvider";
import { Section } from "@/components/sections/Section";
import { ArrowUpRightIcon, StarIcon } from "@/components/icons";

const GH_USER = "guhcostan";

const PROJECT_COLORS = [
  "bg-brand",
  "bg-accent",
  "bg-signal",
  "bg-sky-400",
  "bg-fuchsia-400",
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

export function OpenSource() {
  const { t } = useLocale();
  const items = t.projects.items;
  const liveStars = useGitHubStars(items.map((i) => i.repo));

  return (
    <Section id="projects" index="04" heading={t.projects.heading}>
      <p className="reveal -mt-5 mb-10 max-w-2xl text-sm font-medium leading-relaxed text-stone-500 dark:text-stone-400">
        {t.projects.subtitle}
      </p>
      <div className="grid gap-4 md:grid-cols-12">
        {items.map((item, index) => {
          const stars = liveStars[item.repo] ?? item.fallbackStars;
          const featured = index === 0;
          return (
            <a
              key={item.repo}
              href={`https://github.com/${GH_USER}/${item.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`surface-card reveal group relative flex overflow-hidden p-6 transition duration-300 hover:-translate-y-1 hover:border-brand/50 ${
                featured
                  ? "min-h-[390px] flex-col justify-between md:col-span-7 md:row-span-2 sm:p-8"
                  : "min-h-[185px] flex-col md:col-span-5"
              }`}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-10 -right-2 font-display text-[10rem] font-black leading-none text-stone-900/[0.035] transition-transform duration-500 group-hover:-translate-y-2 dark:text-white/[0.035]"
              >
                {item.name.charAt(0).toUpperCase()}
              </span>

              <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`h-3 w-3 rounded-full ${
                      PROJECT_COLORS[index % PROJECT_COLORS.length]
                    }`}
                  />
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-stone-400">
                    Open source / {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-900/10 bg-white/50 px-2.5 py-1 font-mono text-[10px] font-medium text-stone-600 dark:border-white/10 dark:bg-white/5 dark:text-stone-300">
                  <StarIcon className="h-3 w-3 text-brand" />
                  {formatStars(stars)}
                </span>
              </div>

              <div className={`relative ${featured ? "mt-20" : "mt-8"}`}>
                <h3
                  className={`font-display font-bold tracking-[-0.04em] text-stone-950 dark:text-white ${
                    featured ? "text-4xl sm:text-5xl" : "text-2xl"
                  }`}
                >
                  {item.name}
                </h3>
                <p
                  className={`mt-3 leading-relaxed text-stone-600 dark:text-stone-300 ${
                    featured ? "max-w-lg text-base" : "text-sm"
                  }`}
                >
                  {item.description}
                </p>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-stone-400">
                    {item.tag}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white transition-transform group-hover:rotate-45 group-hover:bg-brand dark:bg-white dark:text-ink">
                    <ArrowUpRightIcon className="h-4 w-4" />
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
