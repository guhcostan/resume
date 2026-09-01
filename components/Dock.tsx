"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/LanguageProvider";
import { useAiTerminalDrawer } from "@/components/AiTerminalDrawer";
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
 * Floating bottom navigation for small screens (hidden on lg+, where the
 * masthead links take over). Tracks the visible section with an
 * IntersectionObserver to light up the active tab.
 */
export function Dock() {
  const { t, locale } = useLocale();
  const [active, setActive] = useState("top");
  const { open: openAiTerminal } = useAiTerminalDrawer();

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
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 lg:hidden"
    >
      <div className="flex items-center gap-0.5 rounded-2xl border border-ink-line bg-paper-card/95 px-1.5 py-1.5 shadow-card backdrop-blur-md">
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
                  ? "bg-clay/15 text-clay-deep"
                  : "text-ink-faint hover:bg-paper-deep hover:text-ink"
              }`}
            >
              <Icon className="h-5 w-5" />
              {/* Tooltip label */}
              <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[10px] font-semibold text-paper opacity-0 transition-opacity group-hover:opacity-100">
                {label}
              </span>
              {/* Active dot */}
              {isActive && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-clay" />
              )}
            </a>
          );
        })}

        <span className="mx-1 h-6 w-px bg-ink-line" />

        <button
          type="button"
          onClick={openAiTerminal}
          aria-label={locale === "pt" ? "Terminal IA" : "AI Terminal"}
          className="group relative flex h-11 w-11 items-center justify-center rounded-xl bg-clay text-white shadow-glow transition-transform hover:scale-105"
        >
          <SparklesIcon className="h-5 w-5" />
          <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[10px] font-semibold text-paper opacity-0 transition-opacity group-hover:opacity-100">
            {locale === "pt" ? "Terminal IA" : "AI Terminal"}
          </span>
        </button>
      </div>
    </nav>
  );
}
