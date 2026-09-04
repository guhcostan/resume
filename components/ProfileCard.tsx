import { dictionaries, type LocalizedProps } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { asset, profile } from "@/lib/content";
import { Arrow } from "./Arrow";
import { Icon } from "./icons";
import { CopyEmail } from "./CopyEmail";
import { ThemeToggle } from "./ThemeToggle";

export function ProfileCard({ locale }: LocalizedProps) {
  const t = dictionaries[locale];
  return (
    <aside className="profile-sidebar" aria-label={t.common.profile}>
      <div className="profile-card">
        <a className="guh-wordmark" href="#inicio" aria-label={t.common.home}>guh<span>.</span></a>
        <h1>Gustavo Costa</h1>
        <a className="profile-handle" href={profile.github} target="_blank" rel="noreferrer">@guhcostan <Arrow /></a>
        <p className="profile-bio"><strong>{t.profile.focus}</strong><br />{t.profile.bio}</p>
        <p className="profile-current">{t.profile.current}</p>
        <p className="profile-availability"><span className="status-dot" aria-hidden="true"/>{t.profile.availability}</p>
        <div className="profile-actions">
          <a className="button button-primary" href={`mailto:${profile.email}`}><Icon name="mail"/>{t.common.talk}</a>
          <a className="button button-secondary" href={profile.github} target="_blank" rel="noreferrer"><Icon name="github"/>GitHub <Arrow/></a>
        </div>
        <nav className="profile-nav" aria-label={t.common.navigation}>
          <a href="#projetos"><span>{t.common.projects}</span><span>01</span></a>
          <a href="#experiencia"><span>{t.common.experience}</span><span>02</span></a>
          <a href="#sobre"><span>{t.common.about}</span><span>03</span></a>
        </nav>
        <div className="profile-meta"><Icon name="location"/><span>{t.profile.location}</span></div>
        <div className="profile-bottom"><a href={asset("/files/gustavo-costa-curriculo.pdf")} target="_blank" rel="noreferrer"><Icon name="file"/>{t.common.resume} <Arrow/><span className="sr-only"> (PDF)</span></a><div className="profile-controls"><LanguageSwitcher locale={locale}/><ThemeToggle locale={locale}/></div></div>
      </div>
      <div className="sidebar-note"><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow/></a><CopyEmail locale={locale} /></div>
    </aside>
  );
}
