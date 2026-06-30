"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/providers/LanguageProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowUpRightIcon, GitHubIcon, StarIcon } from "@/components/ui/icons";

const GH_USER = "guhcostan";

function formatStars(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
}

function useGitHubStars(repos: string[]) {
  const [stars, setStars] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      repos.map(async (repo) => {
        try {
          const res = await fetch(`https://api.github.com/repos/${GH_USER}/${repo}`);
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
  }, [repos.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  return stars;
}

export function ProjectsSection() {
  const { t } = useLocale();
  const items = t.projects.items;
  const liveStars = useGitHubStars(items.map((i) => i.repo));

  return (
    <section
      id="projects"
      className="border-y border-ink/8 bg-surface-raised/50 dark:border-ink-dark/10 dark:bg-surface-raised-dark/30"
    >
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <SectionHeading
          index="04 — Open Source"
          title={t.projects.heading}
          subtitle={t.projects.subtitle}
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((item, i) => {
            const stars = liveStars[item.repo] ?? item.fallbackStars;
            return (
              <a
                key={item.repo}
                href={`https://github.com/${GH_USER}/${item.repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="reveal group relative overflow-hidden rounded-2xl border border-ink/8 bg-surface p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-glow dark:border-ink-dark/10 dark:bg-surface-dark dark:shadow-card-dark"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <div className="absolute inset-x-0 top-0 h-1 scale-x-0 bg-gradient-to-r from-accent to-accent-dark transition-transform group-hover:scale-x-100" />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <GitHubIcon className="h-5 w-5 text-ink-muted dark:text-ink-muted-dark" />
                    <h3 className="font-mono text-base font-semibold text-ink dark:text-ink-dark">
                      {item.name}
                    </h3>
                  </div>
                  <ArrowUpRightIcon className="h-4 w-4 text-ink-faint transition group-hover:text-accent dark:text-ink-muted-dark" />
                </div>

                <p className="mt-4 text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark">
                  {item.description}
                </p>

                <div className="mt-5 flex items-center justify-between text-xs">
                  <span className="font-mono text-ink-faint dark:text-ink-muted-dark">
                    {item.tag}
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium text-accent dark:text-accent-dark">
                    <StarIcon className="h-3.5 w-3.5" />
                    {formatStars(stars)}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
