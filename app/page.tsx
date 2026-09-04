import { ProfileCard } from "@/components/ProfileCard";
import { ProjectList } from "@/components/ProjectList";
import { Experience } from "@/components/Experience";
import { AboutMe } from "@/components/AboutMe";
import { Arrow } from "@/components/Arrow";

export default function Home() {
  return (
    <>
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <div id="inicio" />
      <div className="portfolio-layout">
        <ProfileCard />
        <main id="conteudo" className="portfolio-content">
          <ProjectList />
          <Experience />
          <AboutMe />
          <footer className="site-footer"><span>Feito por Guh. Sempre em construção.</span><a href="https://github.com/guhcostan/resume" target="_blank" rel="noreferrer">Código do site <Arrow /></a></footer>
        </main>
      </div>
    </>
  );
}
