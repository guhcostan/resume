"use client";

import Link from "next/link";
import { useLocale } from "@/components/LanguageProvider";
import { profile } from "@/lib/content";
import { ArrowUpRightIcon, DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon, MapPinIcon, SparklesIcon } from "@/components/icons";

const SOCIALS = [
  { label: "GitHub", href: profile.links.github, Icon: GitHubIcon },
  { label: "LinkedIn", href: profile.links.linkedin, Icon: LinkedInIcon },
];

export function Hero() {
  const { t, locale } = useLocale();

  return (
    <section id="top" className="scroll-mt-20">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 sm:py-12 lg:grid-cols-[310px_minmax(0,1fr)] lg:items-start">
        <aside className="sticker rise p-6 lg:sticky lg:top-24" style={{ "--rise-delay": "40ms" } as React.CSSProperties}>
          <div className="flex items-center justify-between">
            <div className="flex h-16 w-16 items-center justify-center rounded-[28%] bg-ink text-2xl font-semibold tracking-tight text-paper shadow-card">GC</div>
            <span className="section-label rounded-full border border-ink-line px-2.5 py-1">{locale === "pt" ? "disponível" : "available"}</span>
          </div>
          <h1 className="mt-6 text-[30px] font-semibold leading-none tracking-[-0.04em] text-ink">Gustavo Costa</h1>
          <p className="mt-2 font-mono text-[12px] text-ink-faint">@guhcostan · {locale === "pt" ? "engenheiro de produto" : "product engineer"}</p>
          <p className="mt-5 text-[14px] leading-[1.7] text-ink-soft">{t.hero.tagline}</p>
          <div className="mt-5 flex items-center gap-2 text-xs text-ink-faint"><MapPinIcon className="h-3.5 w-3.5" />{profile.location}</div>
          <div className="mt-6 grid grid-cols-2 gap-2">
            <a href={`mailto:${profile.email}`} className="pill inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-semibold"><MailIcon className="h-3.5 w-3.5" />{t.hero.ctaEmail}</a>
            <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-full border border-ink-line px-3 py-2 text-[12px] font-semibold text-ink transition-colors hover:border-clay/50 hover:text-clay-deep"><GitHubIcon className="h-3.5 w-3.5" />GitHub</a>
          </div>
          <div className="mt-6 flex items-center gap-1 border-t border-ink-line pt-4">{SOCIALS.map(({ label, href, Icon }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-8 w-8 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-paper-deep hover:text-ink"><Icon className="h-4 w-4" /></a>)}<a href={`mailto:${profile.email}`} aria-label="Email" className="flex h-8 w-8 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-paper-deep hover:text-ink"><MailIcon className="h-4 w-4" /></a></div>
        </aside>

        <div className="min-w-0 space-y-6">
          <div className="sticker rise overflow-hidden p-6 sm:p-9" style={{ "--rise-delay": "100ms" } as React.CSSProperties}>
            <div className="flex flex-wrap items-center justify-between gap-3"><p className="section-label">{locale === "pt" ? "engenharia mobile + frontend" : "mobile + frontend engineering"}</p><span className="font-mono text-[11px] text-ink-faint">{profile.email}</span></div>
            <h2 className="mt-7 max-w-4xl text-[clamp(2.4rem,4.6vw,4.5rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-ink">{t.hero.title.split(". ").map((part, i) => <span key={i} className="block">{part}{i === 0 ? "." : ""}</span>)}</h2>
            <div className="mt-8 flex flex-wrap items-center gap-3"><Link href="#projects" className="pill inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold">{locale === "pt" ? "Ver projetos" : "See projects"}<ArrowUpRightIcon className="h-4 w-4" /></Link><Link href="/terminal" className="inline-flex items-center gap-2 rounded-full border border-ink-line px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-clay/50 hover:text-clay-deep"><SparklesIcon className="h-4 w-4" />{locale === "pt" ? "Pergunte à IA" : "Ask the AI"}</Link><button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 px-2 py-2.5 text-sm font-semibold text-ink-faint transition-colors hover:text-ink"><DownloadIcon className="h-4 w-4" />{t.hero.ctaPdf}</button></div>
          </div>

          <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="sticker rise p-6" style={{ "--rise-delay": "160ms" } as React.CSSProperties}><p className="section-label">{locale === "pt" ? "o que estou fazendo agora" : "what I'm doing now"}</p><ul className="mt-5 space-y-3">{t.about.now.map((item) => <li key={item} className="flex items-start gap-3 border-b border-dashed border-ink-line pb-3 text-sm leading-relaxed text-ink-soft last:border-0 last:pb-0"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />{item}</li>)}</ul></div>
            <div className="rise rounded-[18px] bg-ink p-6 text-paper" style={{ "--rise-delay": "220ms" } as React.CSSProperties}><div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/50"><SparklesIcon className="h-3.5 w-3.5 text-gold" />AI in the loop</div><p className="mt-5 text-[15px] leading-[1.7] text-paper/80">{t.hero.aiHighlight}</p><Link href="/terminal" className="mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-gold hover:text-paper">{locale === "pt" ? "abrir terminal" : "open terminal"}<ArrowUpRightIcon className="h-3.5 w-3.5" /></Link></div>
          </div>
        </div>
      </div>

      <div aria-hidden data-print-hide className="overflow-hidden border-y border-ink-line bg-paper-deep py-3"><div className="marquee-track gap-8 pr-8">{[0, 1].map((copy) => <div key={copy} className="flex shrink-0 items-center gap-8">{["React Native", "TypeScript", "LLM Agents", "Next.js", "TDD", "Clean Architecture", "Claude Code"].map((item) => <span key={item} className="flex items-center gap-8 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">{item}<span className="h-1.5 w-1.5 rounded-full bg-clay" /></span>)}</div>)}</div></div>
    </section>
  );
}
