"use client";

import { useLocale } from "@/components/LanguageProvider";
import { profile } from "@/lib/content";
import { Section } from "@/components/sections/Section";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/icons";

/** Contact as a full-bleed ink plate at the back of the magazine. */
export function Contact() {
  const { t } = useLocale();

  return (
    <section id="contact" className="scroll-mt-20">
      <div className="mx-auto mt-4 max-w-7xl px-5 sm:mt-8 sm:px-8">
        <div className="reveal overflow-hidden rounded-[18px] bg-ink px-6 py-16 text-center sm:px-12 sm:py-20">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-paper/50">
            {profile.email}
          </p>
          <h2 className="mx-auto mt-6 max-w-xl text-[clamp(2.5rem,5vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-paper">
            {t.contact.heading}
            <span className="text-clay">.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md leading-relaxed text-paper/70">
            {t.contact.subtitle}
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-clay px-7 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5 hover:bg-clay-deep"
          >
            <MailIcon className="h-4 w-4" />
            {t.contact.emailLabel}
          </a>
          <div className="mt-10 flex items-center justify-center gap-6 text-paper/60">
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="transition-colors hover:text-clay"
            >
              <GitHubIcon className="h-5 w-5" />
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="transition-colors hover:text-clay"
            >
              <LinkedInIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
