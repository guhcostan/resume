"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { asset, profile, projects } from "@/lib/content";
import { Arrow } from "./Arrow";
import { CopyCommand } from "./CopyCommand";
import { Icon } from "./icons";
import { refreshGitHubStars, type GitHubStars } from "@/lib/github";
import initialStars from "@/lib/github-stars.json";

const filters = ["Todos", "IA", "Ferramentas"] as const;
type Filter = typeof filters[number];
const countFormat = new Intl.NumberFormat("pt-BR");
const dateFormat = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo" });

export function ProjectList() {
  const [filter, setFilter] = useState<Filter>("Todos");
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
  const visible = projects.filter(project => filter === "Todos" || project.category === filter);
  return (
    <section id="projetos" aria-labelledby="projects-heading">
      <div className="section-heading"><div><h2 id="projects-heading">IA & open source<span className="section-count">/ {String(projects.length).padStart(2, "0")}</span></h2><p>Agentes, contexto e ferramentas que compartilho.</p></div><a className="section-external" href={`${profile.github}?tab=repositories`} target="_blank" rel="noreferrer">Ver todos <Arrow/></a></div>
      <div className="project-filters" role="group" aria-label="Filtrar projetos">{filters.map(item => <button key={item} type="button" aria-pressed={item === filter} onClick={() => setFilter(item)}>{item}</button>)}</div>
      <div className="project-stack" aria-label="Projetos">
        {visible.map(project => <article className={`project-card ${project.name === "mac-cleaner-cli" ? "featured-project" : ""}`} key={project.name}>
          <div className="project-card-top">
            <span className={`project-icon ${project.color}`}><Image src={asset(`/projects/${project.name}.webp`)} width={256} height={256} alt="" /></span>
            <div className="project-title"><h3><a href={`${profile.github}/${project.name}`} target="_blank" rel="noreferrer">{project.name}</a></h3><div className="project-metadata"><span className="project-type">{project.technology}</span><a className="project-stars" href={`${profile.github}/${project.name}/stargazers`} target="_blank" rel="noreferrer" aria-label={`${countFormat.format(github.stars[project.name])} estrelas de ${project.name} no GitHub`} title={`Estrelas consultadas em ${checkedAt}`}><Icon name="star"/>{countFormat.format(github.stars[project.name])}</a></div></div>
            <a className="project-open" href={`${profile.github}/${project.name}`} target="_blank" rel="noreferrer" aria-label={`Abrir ${project.name} no GitHub`}><span>Abrir</span><Arrow/></a>
          </div>
          <p className="project-description">{project.detail}</p>
          {project.name === "mac-cleaner-cli" && <div className="project-command"><CopyCommand/><p>Confira o que pode ser limpo antes de decidir.</p></div>}
        </article>)}
      </div>
      <p className="project-stats-note">Estrelas do GitHub · consultadas em <time dateTime={github.checkedAt}>{checkedAt}</time></p>
      <p className="sr-only" role="status">{visible.length} projetos exibidos.</p>
    </section>
  );
}
