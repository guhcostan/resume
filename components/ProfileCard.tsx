import { asset, profile } from "@/lib/content";
import { Arrow } from "./Arrow";
import { Icon } from "./icons";
import { CopyEmail } from "./CopyEmail";
import { ThemeToggle } from "./ThemeToggle";

export function ProfileCard() {
  return (
    <aside className="profile-sidebar" aria-label="Sobre Gustavo Costa">
      <div className="profile-card">
        <a className="guh-wordmark" href="#inicio" aria-label="guh. — Gustavo Costa, início">guh<span>.</span></a>
        <h1>Gustavo Costa</h1>
        <a className="profile-handle" href={profile.github} target="_blank" rel="noreferrer">@guhcostan <Arrow /></a>
        <p className="profile-bio"><strong>Engenharia de IA.</strong><br />Agentes, LLMs e ferramentas open source, com experiência em React Native e frontend.</p>
        <p className="profile-current">Tech Anchor na Thoughtworks</p>
        <p className="profile-availability"><span className="status-dot" aria-hidden="true"/>Disponível para freelas</p>
        <div className="profile-actions">
          <a className="button button-primary" href={`mailto:${profile.email}`}><Icon name="mail"/>Vamos conversar</a>
          <a className="button button-secondary" href={profile.github} target="_blank" rel="noreferrer"><Icon name="github"/>GitHub <Arrow/></a>
        </div>
        <nav className="profile-nav" aria-label="Navegação principal">
          <a href="#projetos"><span>Projetos</span><span>01</span></a>
          <a href="#experiencia"><span>Experiência</span><span>02</span></a>
          <a href="#sobre"><span>Sobre mim</span><span>03</span></a>
        </nav>
        <div className="profile-meta"><Icon name="location"/><span>São Sebastião, SP · Brasil</span></div>
        <div className="profile-bottom"><a href={asset("/files/gustavo-costa-curriculo.pdf")} target="_blank" rel="noreferrer"><Icon name="file"/>Currículo <Arrow/><span className="sr-only"> (PDF)</span></a><ThemeToggle/></div>
      </div>
      <div className="sidebar-note"><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow/></a><CopyEmail /></div>
    </aside>
  );
}
