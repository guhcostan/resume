"use client";

import { useLocale } from "@/components/LanguageProvider";
import { profile } from "@/lib/content";
import { Section } from "@/components/sections/Section";
import {
  GitHubIcon,
  GlobeIcon,
  LinkedInIcon,
  MailIcon,
} from "@/components/icons";

export function Contact() {
  const { t } = useLocale();

  return (
    <Section id="contact" className="text-center">
      <div className="reveal mx-auto max-w-xl">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          {t.contact.heading}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
          {t.contact.subtitle}
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
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
            className="transition-colors hover:text-indigo-500"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="transition-colors hover:text-indigo-500"
          >
            <LinkedInIcon className="h-5 w-5" />
          </a>
          <a
            href={profile.links.website}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Website"
            className="transition-colors hover:text-indigo-500"
          >
            <GlobeIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </Section>
  );
}
