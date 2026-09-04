import { profile } from "@/lib/content";
import { dictionaries, type LocalizedProps } from "@/lib/i18n";
import { Arrow } from "./Arrow";

export function AboutMe({ locale }: LocalizedProps) {
  const t = dictionaries[locale];
  return <section id="sobre" aria-labelledby="about-heading">
    <div className="section-heading"><h2 id="about-heading">{t.about.title}</h2></div>
    <div className="about-panel">
      {t.about.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      <div className="education-line"><span className="mini-label">{t.about.education}</span><p>{t.about.degree}<span>2015 — 2019</span></p></div><div className="language-line"><span className="mini-label">{t.about.languages}</span><p>{t.about.spoken}</p></div>
    </div>
    <div id="contato" className="contact-panel"><div><h3>{t.about.contact}</h3><p>{t.about.freelance}</p><a href={`mailto:${profile.email}`}>{profile.email}</a></div><a className="button button-primary" href={`mailto:${profile.email}`}>{t.common.talk} <Arrow/></a></div>
  </section>;
}
