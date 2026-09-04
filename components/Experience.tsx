import { asset } from "@/lib/content";
import { Arrow } from "./Arrow";

const jobs = [
  { company: "Thoughtworks", role: "Tech Anchor · Mobile & Frontend", period: "2022 — atual", summary: "Do início do LatamPass à liderança técnica de um app usado por milhões de pessoas.", details: "Ajudei a definir arquitetura, padrões técnicos e CI/CD desde a fundação do app. Liderei mais de oito engenheiros entre Brasil e Chile, com TDD, revisão de código e mentoria. O trabalho elevou a cobertura de testes para mais de 80% e reduziu o tempo de pipeline em aproximadamente 35%.", progression: "Mobile Engineer → Technical Lead → Tech Anchor" },
  { company: "RecargaPay", role: "Mobile Developer", period: "2022", summary: "Pagamentos e funcionalidades mobile em uma fintech com mais de 18 mil usuários simultâneos.", details: "Desenvolvi e evoluí funcionalidades em React Native para iOS e Android. O trabalho também envolvia estabilidade do app e atualização de bibliotecas, em colaboração com um time multidisciplinar.", progression: "React Native · iOS · Android" },
  { company: "Descomplica", role: "Mobile Developer", period: "2021 — 2022", summary: "Construção do app do zero para aproximar estudantes do ensino superior.", details: "Trabalhei com React Native, TypeScript, GraphQL e Node.js, colaborando com produto e design e mantendo entregas contínuas pelo Bitrise. Também contribuí para a manutenção e evolução de um segundo aplicativo.", progression: "React Native · TypeScript · GraphQL" },
];

export function Experience() {
  return <section id="experiencia" aria-labelledby="experience-heading">
    <div className="section-heading"><div><h2 id="experience-heading">Experiência</h2><p>Software de verdade, feito em equipe.</p></div><a className="section-external" href={asset("/files/gustavo-costa-curriculo.pdf")} target="_blank" rel="noreferrer">Currículo <Arrow/><span className="sr-only"> (PDF)</span></a></div>
    <div className="experience-panel">
      {jobs.map(job => <details className="experience-item" key={job.company}>
        <summary><span className="company-mark"><Image src={asset(`/companies/${job.company.toLowerCase()}.png`)} width={192} height={192} alt="" /></span><div className="company-info"><div className="company-title"><h3>{job.company}</h3><span>{job.period}</span></div><p className="job-role">{job.role}</p><p className="job-summary">{job.summary}</p></div><Arrow className="disclosure-arrow" direction="down-right"/></summary>
        <div className="job-detail"><p>{job.details}</p><p className="job-progression">{job.progression}</p></div>
      </details>)}
      <details className="earlier-work"><summary>Antes disso <span>2017 — 2021</span><Arrow direction="down-right"/></summary><div><p><strong>Equal</strong> · 2019–2021<br/>Plataforma web e mobile de gestão financeira para pequenos negócios.</p><p><strong>LEMAF / UFLA</strong> · 2018–2019<br/>Sistemas de gestão ambiental, aplicações web e ferramentas para trabalho em campo.</p><p><strong>Comp Júnior</strong> · 2017–2018<br/>Primeiros projetos, sites e aprendizado em equipe.</p></div></details>
    </div>
  </section>;
}
import Image from "next/image";
