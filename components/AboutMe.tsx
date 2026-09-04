import { profile } from "@/lib/content";
import { Arrow } from "./Arrow";

export function AboutMe() {
  return <section id="sobre" aria-labelledby="about-heading">
    <div className="section-heading"><h2 id="about-heading">Um pouco sobre mim</h2></div>
    <div className="about-panel">
      <p>Pode chamar de Guh. Sou engenheiro de software, moro em São Sebastião e hoje meu foco é engenharia de IA: agentes, integrações com LLMs e ferramentas que ajudam a transformar modelos em produtos úteis.</p>
      <p>Minha base vem de React Native, TypeScript e frontend. Desde 2017, construo software para educação, serviços financeiros e programas de fidelidade. Hoje sou Tech Anchor na Thoughtworks, onde trabalho com arquitetura, entrega e liderança técnica.</p>
      <p>No open source, exploro orquestração de agentes e contexto para assistentes de código, além de criar ferramentas que uso no dia a dia. Gosto de compartilhar o que funciona e evoluir os projetos com a comunidade.</p>
      <div className="education-line"><span className="mini-label">Formação</span><p>Ciência da Computação · UFLA<span>2015 — 2019</span></p></div><div className="language-line"><span className="mini-label">Idiomas</span><p>Português · Inglês · Espanhol</p></div>
    </div>
    <div id="contato" className="contact-panel"><div><h3>Tem um projeto em mente?</h3><p>Aberto a freelas de IA, React Native e frontend.</p><a href={`mailto:${profile.email}`}>{profile.email}</a></div><a className="button button-primary" href={`mailto:${profile.email}`}>Vamos conversar <Arrow/></a></div>
  </section>;
}
