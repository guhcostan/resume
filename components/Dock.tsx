"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/LanguageProvider";
import {
  BriefcaseIcon,
  CpuIcon,
  GitHubIcon,
  HomeIcon,
  MailIcon,
  SparklesIcon,
  UserIcon,
} from "@/components/icons";

const SECTION_IDS = ["top", "about", "experience", "skills", "projects", "contact"];

/**
 * Floating bottom navigation, styled like a mobile app tab bar — a small nod
 * to a career spent building phone apps. Tracks the visible section with an
 * IntersectionObserver to light up the active tab.
 */
export function Dock() {
  const { t, locale } = useLocale();
  const [active, setActive] = useState("top");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the visible section closest to the top of the viewport.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const items = [
    { id: "top", label: locale === "pt" ? "Início" : "Home", Icon: HomeIcon },
    { id: "about", label: t.nav.about, Icon: UserIcon },
    { id: "experience", label: t.nav.experience, Icon: BriefcaseIcon },
    { id: "skills", label: t.nav.skills, Icon: CpuIcon },
    { id: "projects", label: t.nav.projects, Icon: GitHubIcon },
    { id: "contact", label: t.nav.contact, Icon: MailIcon },
  ];

  return (
    <nav
      data-print-hide
      aria-label="Sections"
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2"
    >
      <div className="flex items-center gap-0.5 rounded-2xl border border-slate-200/80 bg-white/85 px-1.5 py-1.5 shadow-lg shadow-slate-900/10 backdrop-blur-md dark:border-white/10 dark:bg-ink-raised/85 dark:shadow-black/50">
        {items.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              aria-label={label}
              aria-current={isActive ? "true" : undefined}
              className={`group relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                isActive
                  ? "bg-brand/15 text-brand-fg dark:text-violet-300"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-100"
              }`}
            >
              <Icon className="h-5 w-5" />
              {/* Tooltip label */}
              <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white dark:text-slate-900">
                {label}
              </span>
              {/* Active dot, tab-bar style */}
              {isActive && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-brand" />
              )}
            </a>
          );
        })}

        <span className="mx-1 h-6 w-px bg-slate-200 dark:bg-white/10" />

        <Link
          href="/terminal"
          aria-label={locale === "pt" ? "Terminal IA" : "AI Terminal"}
          className="group relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-accent text-white shadow-glow transition-transform hover:scale-105"
        >
          <SparklesIcon className="h-5 w-5" />
          <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white dark:text-slate-900">
            {locale === "pt" ? "Terminal IA" : "AI Terminal"}
          </span>
        </Link>
      </div>
    </nav>
  );
}
