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
      className="fixed bottom-3 left-1/2 z-50 max-w-[calc(100vw-1rem)] -translate-x-1/2 md:hidden"
    >
      <div className="flex items-center gap-0.5 rounded-full border border-white/15 bg-ink/95 p-1.5 shadow-2xl shadow-black/25 backdrop-blur-xl">
        {items.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              aria-label={label}
              aria-current={isActive ? "true" : undefined}
              className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                isActive
                  ? "bg-brand text-white"
                  : "text-stone-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
              <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-ink opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                {label}
              </span>
            </a>
          );
        })}

        <span className="mx-0.5 h-6 w-px bg-white/15" />

        <Link
          href="/terminal"
          aria-label={locale === "pt" ? "Terminal IA" : "AI Terminal"}
          className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink transition-transform hover:scale-105"
        >
          <SparklesIcon className="h-[18px] w-[18px]" />
          <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-ink opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            {locale === "pt" ? "Terminal IA" : "AI Terminal"}
          </span>
        </Link>
      </div>
    </nav>
  );
}
