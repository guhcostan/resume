"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { dictionaries, interpolate, type LocalizedProps } from "@/lib/i18n";
import { asset, profile, projects } from "@/lib/content";
import { Arrow } from "./Arrow";
import { CopyCommand } from "./CopyCommand";
import { Icon } from "./icons";
import { refreshGitHubStars, type GitHubStars } from "@/lib/github";
import initialStars from "@/lib/github-stars.json";

const filters = ["all", "ai", "tools"] as const;
type Filter = typeof filters[number];

export function ProjectList({ locale }: LocalizedProps) {
  const t = dictionaries[locale];
  const text = t.projectSection;
  const countFormat = new Intl.NumberFormat(t.locale);
  const dateFormat = new Intl.DateTimeFormat(t.locale, { timeZone: "America/Sao_Paulo" });
  const [filter, setFilter] = useState<Filter>("all");
  const [github, setGitHub] = useState<GitHubStars>(initialStars);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    void refreshGitHubStars(initialStars, controller.signal).then(result => {
      if (!controller.signal.aborted) setGitHub(result);
      clearTimeout(timeout);
    });
    return () => { controller.abort(); clearTimeout(timeout); };
  }, []);
  const checkedAt = dateFormat.format(new Date(github.checkedAt));
  const visible = projects.filter(project => filter === "all" || project.category === filter);
  return (
    <section id="projetos" aria-labelledby="projects-heading">
      <div className="section-heading"><div><h2 id="projects-heading">{text.title}<span className="section-count">/ {String(projects.length).padStart(2, "0")}</span></h2><p>{text.description}</p></div><a className="section-external" href={`${profile.github}?tab=repositories`} target="_blank" rel="noreferrer">{text.viewAll} <Arrow/></a></div>
      <div className="project-filters" role="group" aria-label={text.filter}>{filters.map(item => <button key={item} type="button" aria-pressed={item === filter} onClick={() => setFilter(item)}>{text.filters[item]}</button>)}</div>
      <div className="project-stack" aria-label={t.common.projects}>
        {visible.map(project => <article className={`project-card ${project.name === "mac-cleaner-cli" ? "featured-project" : ""}`} key={project.name}>
          <div className="project-card-top">
            <span className={`project-icon ${project.color}`}><Image src={asset(`/projects/${project.name}.webp`)} width={256} height={256} alt="" /></span>
            <div className="project-title"><h3><a href={`${profile.github}/${project.name}`} target="_blank" rel="noreferrer">{project.name}</a></h3><div className="project-metadata"><span className="project-type">{t.projects[project.name].technology}</span><a className="project-stars" href={`${profile.github}/${project.name}/stargazers`} target="_blank" rel="noreferrer" aria-label={interpolate(text.starsLabel, { count: countFormat.format(github.stars[project.name]), project: project.name })} title={interpolate(text.starsChecked, { date: checkedAt })}><Icon name="star"/>{countFormat.format(github.stars[project.name])}</a></div></div>
            <a className="project-open" href={`${profile.github}/${project.name}`} target="_blank" rel="noreferrer" aria-label={interpolate(text.openLabel, { project: project.name })}><span>{text.open}</span><Arrow/></a>
          </div>
          <p className="project-description">{t.projects[project.name].detail}</p>
          {project.name === "mac-cleaner-cli" && <div className="project-command"><CopyCommand locale={locale}/><p>{text.commandHint}</p></div>}
        </article>)}
      </div>
      <p className="project-stats-note">{text.checked} <time dateTime={github.checkedAt}>{checkedAt}</time></p>
      <p className="sr-only" role="status">{interpolate(text.results, { count: visible.length })}</p>
    </section>
  );
}
