"use client";

import { useLocale } from "@/components/LanguageProvider";
import { profile } from "@/lib/content";
import { Section } from "@/components/sections/Section";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/icons";

export function Contact() {
  const { t } = useLocale();

  return (
    <Section id="contact" className="pb-28">
      {/* Gradient-border card */}
      <div className="reveal mx-auto max-w-2xl rounded-3xl bg-gradient-to-r from-brand/50 via-violet-500/40 to-accent/50 p-px">
        <div className="rounded-[calc(1.5rem-1px)] bg-white px-6 py-12 text-center sm:px-12 dark:bg-ink-raised">
          <p className="font-mono text-xs text-slate-400 dark:text-slate-500">
            $ open mailto:{profile.email}
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {t.contact.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-slate-600 dark:text-slate-300">
            {t.contact.subtitle}
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.03]"
          >
            <MailIcon className="h-4 w-4" />
            {t.contact.emailLabel}
          </a>
          <div className="mt-8 flex items-center justify-center gap-5 text-slate-500 dark:text-slate-400">
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="transition-colors hover:text-brand"
            >
              <GitHubIcon className="h-5 w-5" />
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="transition-colors hover:text-brand"
            >
              <LinkedInIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
