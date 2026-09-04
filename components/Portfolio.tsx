import { dictionaries, type LocalizedProps } from "@/lib/i18n";
import { ProfileCard } from "@/components/ProfileCard";
import { ProjectList } from "@/components/ProjectList";
import { Experience } from "@/components/Experience";
import { AboutMe } from "@/components/AboutMe";
import { Arrow } from "@/components/Arrow";

export function Portfolio({ locale }: LocalizedProps) {
  const t = dictionaries[locale].common;
  return (
    <>
      <a href="#conteudo" className="skip-link">{t.skip}</a>
      <div id="inicio" />
      <div className="portfolio-layout">
        <ProfileCard locale={locale} />
        <main id="conteudo" className="portfolio-content">
          <ProjectList locale={locale} />
          <Experience locale={locale} />
          <AboutMe locale={locale} />
          <footer className="site-footer"><span>{t.footer}</span><a href="https://github.com/guhcostan/resume" target="_blank" rel="noreferrer">{t.source} <Arrow /></a></footer>
        </main>
      </div>
    </>
  );
}
