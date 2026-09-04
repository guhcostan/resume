import Image from "next/image";
import { asset } from "@/lib/content";
import { dictionaries, type LocalizedProps } from "@/lib/i18n";
import { Arrow } from "./Arrow";

export function Experience({ locale }: LocalizedProps) {
  const t = dictionaries[locale];
  return <section id="experiencia" aria-labelledby="experience-heading">
    <div className="section-heading"><div><h2 id="experience-heading">{t.common.experience}</h2><p>{t.experience.description}</p></div><a className="section-external" href={asset("/files/gustavo-costa-curriculo.pdf")} target="_blank" rel="noreferrer">{t.common.resume} <Arrow/><span className="sr-only"> (PDF)</span></a></div>
    <div className="experience-panel">
      {t.experience.jobs.map(job => <details className="experience-item" key={job.company}>
        <summary><span className="company-mark"><Image src={asset(`/companies/${job.company.toLowerCase()}.png`)} width={192} height={192} alt="" /></span><div className="company-info"><div className="company-title"><h3>{job.company}</h3><span>{job.period}</span></div><p className="job-role">{job.role}</p><p className="job-summary">{job.summary}</p></div><Arrow className="disclosure-arrow" direction="down-right"/></summary>
        <div className="job-detail"><p>{job.details}</p><p className="job-progression">{job.progression}</p></div>
      </details>)}
      <details className="earlier-work"><summary>{t.experience.earlier} <span>2017 — 2021</span><Arrow direction="down-right"/></summary><div>{t.experience.previous.map(job => <p key={job.company}><strong>{job.company}</strong> · {job.period}<br/>{job.description}</p>)}</div></details>
    </div>
  </section>;
}
