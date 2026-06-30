"use client";

import { useLocale } from "@/components/providers/LanguageProvider";
import { profile } from "@/lib/content";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/ui/icons";

export function ContactSection() {
  const { t } = useLocale();

  return (
    <section id="contact" className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-accent/15 via-transparent to-accent-soft dark:from-accent/10 dark:to-transparent"
      />
      <div className="relative mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="section-label">06 — Contact</p>
          <h2 className="mt-4 font-display text-4xl tracking-tight text-ink dark:text-ink-dark md:text-5xl">
            {t.contact.heading}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted dark:text-ink-muted-dark">
            {t.contact.subtitle}
          </p>

          <a
            href={`mailto:${profile.email}`}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-accent/90"
          >
            <MailIcon className="h-4 w-4" />
            {t.contact.emailLabel}
          </a>

          <div className="mt-8 flex items-center justify-center gap-5">
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="rounded-full border border-ink/10 p-2.5 text-ink-muted transition hover:border-accent/40 hover:text-accent dark:border-ink-dark/15 dark:text-ink-muted-dark"
            >
              <GitHubIcon className="h-5 w-5" />
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="rounded-full border border-ink/10 p-2.5 text-ink-muted transition hover:border-accent/40 hover:text-accent dark:border-ink-dark/15 dark:text-ink-muted-dark"
            >
              <LinkedInIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
