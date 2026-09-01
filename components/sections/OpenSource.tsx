"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale } from "@/components/LanguageProvider";
import { Section } from "@/components/sections/Section";
import { ArrowUpRightIcon, StarIcon } from "@/components/icons";

const GH_USER = "guhcostan";

function formatStars(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
}

function useGitHubStars(repos: string[]) {
  const [stars, setStars] = useState<Record<string, number>>({});
  const repoKey = repos.join(",");
  useEffect(() => {
    let cancelled = false;
    Promise.all(repoKey.split(",").filter(Boolean).map(async (repo) => { try { const res = await fetch(`https://api.github.com/repos/${GH_USER}/${repo}`); if (!res.ok) return null; const data = await res.json(); return [repo, data.stargazers_count as number] as const; } catch { return null; } }))
      .then((pairs) => { if (cancelled) return; const next: Record<string, number> = {}; for (const pair of pairs) if (pair) next[pair[0]] = pair[1]; setStars(next); });
    return () => { cancelled = true; };
  }, [repoKey]);
  return stars;
}

export function OpenSource() {
  const { t, locale } = useLocale();
  const items = t.projects.items;
  const liveStars = useGitHubStars(items.map((item) => item.repo));

  return (
    <Section id="projects" index="04" kicker={locale === "pt" ? "projetos paralelos" : "side quests"} heading={t.projects.heading}>
      <p className="reveal -mt-6 mb-8 max-w-xl text-sm leading-relaxed text-ink-faint">{t.projects.subtitle}</p>
      <div className="flex flex-col gap-4">
        {items.map((item, i) => {
          const stars = liveStars[item.repo] ?? item.fallbackStars;
          return (
            <a key={item.repo} href={`https://github.com/${GH_USER}/${item.repo}`} target="_blank" rel="noopener noreferrer" className="sticker rise group flex flex-col gap-5 p-5 transition-transform duration-200 hover:-translate-y-1 sm:p-6" style={{ "--rise-delay": `${80 + i * 55}ms` } as React.CSSProperties}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-5">
                  <Image src={`/projects/${item.repo}.png`} alt={`${item.name} logo`} width={72} height={72} className="icon-lift h-[72px] w-[72px] shrink-0 rounded-[24%] object-cover" />
                  <div className="min-w-0 flex-1"><div className="flex min-w-0 items-center gap-2.5"><h3 className="truncate text-[22px] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-[28px]">{item.name}</h3><span className="hidden shrink-0 rounded-full bg-paper-deep px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint sm:inline-flex">{item.tag}</span></div><p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-ink-faint sm:text-[14px]">{item.description}</p></div>
                </div>
                <span className="pill inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-full px-4 py-2 text-[13px] font-semibold sm:self-auto">{locale === "pt" ? "abrir projeto" : "view project"}<ArrowUpRightIcon className="h-3.5 w-3.5" /></span>
              </div>
              <div className="flex items-center justify-between border-t border-dashed border-ink-line pt-3 font-mono text-[11px] text-ink-faint"><span>{item.tag}</span><span className="inline-flex items-center gap-1.5 text-clay-deep"><StarIcon className="h-3.5 w-3.5" />{formatStars(stars)}</span></div>
            </a>
          );
        })}
      </div>
    </Section>
  );
}
