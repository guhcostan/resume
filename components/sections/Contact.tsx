"use client";

import { useLocale } from "@/components/LanguageProvider";
import { profile } from "@/lib/content";
import { Section } from "@/components/sections/Section";
import {
  ArrowUpRightIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
} from "@/components/icons";

export function Contact() {
  const { t, locale } = useLocale();

  return (
    <Section id="contact" className="pb-28 pt-10">
      <div className="reveal relative overflow-hidden rounded-[2.5rem] bg-brand p-6 text-white sm:p-10 lg:p-14">
        <div
          aria-hidden
          className="editorial-grid pointer-events-none absolute inset-0 opacity-15"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -right-5 -top-20 font-display text-[16rem] font-black leading-none text-white/[0.08]"
        >
          @
        </span>

        <div className="relative grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
              {locale === "pt" ? "Próximo projeto / 2026" : "Next project / 2026"}
            </p>
            <h2 className="mt-6 max-w-3xl font-display text-5xl font-bold leading-[0.92] tracking-[-0.06em] text-white sm:text-7xl lg:text-8xl">
              {t.contact.heading}
            </h2>
            <p className="mt-7 max-w-xl text-base font-medium leading-relaxed text-white/80 sm:text-lg">
              {t.contact.subtitle}
            </p>
          </div>

          <div className="lg:justify-self-end">
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex max-w-full items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-bold text-ink transition-transform hover:-translate-y-1 sm:px-6"
            >
              <MailIcon className="h-4 w-4 shrink-0" />
              <span className="truncate">{profile.email}</span>
              <ArrowUpRightIcon className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-white/60">
              {t.contact.emailLabel}
            </p>
            <div className="mt-8 flex items-center gap-3">
              <a
                href={profile.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-ink"
              >
                <GitHubIcon className="h-4 w-4" />
              </a>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-ink"
              >
                <LinkedInIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
