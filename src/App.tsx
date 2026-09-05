import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { dictionaries, type Locale } from "../lib/i18n";
import { projects, profile } from "../lib/content";
import { ActivityCard } from "./ActivityCard";
import { stations, type Destination } from "./world/stations";
import type { Activity } from "./world/routine";
const Studio = lazy(() => import("./world/Studio"));
const publicBase = import.meta.env.BASE_URL;
type Panel = "projects" | "about" | "experience";
class WorldBoundary extends Component<
  { children: ReactNode; en: boolean },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="world-error">
        {this.props.en
          ? "Your browser could not load 3D. Use Explore to access every section."
          : "Seu navegador não conseguiu carregar o 3D. Use Explorar para acessar os conteúdos."}
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function App() {
  const [locale, setLocale] = useState<Locale>(
    location.pathname.includes("/en") ? "en" : "pt",
  );
  const en = locale === "en",
    t = dictionaries[locale];
  const [panel, setPanel] = useState<Panel | null>(null),
    [paused, setPaused] = useState(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
    [night, setNight] = useState(false),
    [zoom, setZoom] = useState(1),
    [reset, setReset] = useState(0),
    [filter, setFilter] = useState("all");
  const [destination, setDestination] = useState<Destination | null>(null);
  const [exploring, setExploring] = useState(false);
  const [discovered, setDiscovered] = useState<Destination[]>([]);
  function selectStation(id: Destination) {
    setDestination(id);
    setDiscovered((previous) =>
      previous.includes(id) ? previous : [...previous, id],
    );
    setPanel(
      id === "projects" || id === "about" || id === "experience" ? id : null,
    );
    setExploring(false);
  }
  function closeReader() {
    setPanel(null);
    setDestination(null);
  }
  const [activity, setActivity] = useState<Activity>("walk");
  const reader = useRef<HTMLElement>(null);
  const previousPanel = useRef<Panel | null>(null);
  const previousExploring = useRef(false);
  const worldButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    document.documentElement.lang = en ? "en" : "pt-BR";
    document.title = t.metadata.title;
  }, [en, t]);
  useEffect(() => {
    if (panel) reader.current?.focus({ preventScroll: true });
    else if (previousPanel.current)
      worldButton.current?.focus({ preventScroll: true });
    previousPanel.current = panel;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPanel(null);
        setDestination(null);
        setExploring(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [panel]);
  useEffect(() => {
    if (exploring)
      document
        .querySelector<HTMLButtonElement>(".action-menu-heading button")
        ?.focus({ preventScroll: true });
    else if (previousExploring.current)
      (panel ? reader.current : worldButton.current)?.focus({
        preventScroll: true,
      });
    previousExploring.current = exploring;
  }, [exploring, panel]);
  function language() {
    const next = en ? "pt" : "en";
    setLocale(next);
    history.replaceState(
      null,
      "",
      `${publicBase}${next === "en" ? "en/" : ""}`,
    );
  }
  return (
    <div
      className={`world-page ${night ? "night" : ""} ${panel || exploring ? "reading" : ""}`}
    >
      <a
        className="skip"
        href={exploring ? "#room-actions" : panel ? "#reader" : "#intro"}
      >
        {t.common.skip}
      </a>
      <header>
        <a href={publicBase} className="brand" aria-label="Gustavo Costa">
          <span className="brand-mark">g.</span>
          <span className="brand-name">
            Gustavo Costa
            <small>{en ? "SOFTWARE ENGINEER" : "ENGENHEIRO DE SOFTWARE"}</small>
          </span>
        </a>
        <div className="header-actions">
          <button
            className="header-day"
            onClick={() => setNight((v) => !v)}
            aria-label={en ? "Day and night" : "Dia e noite"}
          >
            {night ? "☾" : "☼"}
          </button>
          <button
            className="language"
            onClick={language}
            aria-label={en ? "Mudar para português" : "Switch to English"}
          >
            {en ? "PT" : "EN"}
          </button>
          <a className="contact" href={`mailto:${profile.email}`}>
            {t.common.talk} <span>↗</span>
          </a>
        </div>
      </header>
      <main className="portfolio-layout">
        <div className="portfolio-copy">
          <section className="intro" id="intro" hidden={!!panel || exploring}>
            <div className="intro-kicker">
              <span />
              {en
                ? "AVAILABLE FOR FREELANCE PROJECTS"
                : "DISPONÍVEL PARA FREELAS"}
            </div>
            <h1>
              {en ? (
                <>
                  Your idea.
                  <br />
                  Working software.
                </>
              ) : (
                <>
                  Sua ideia.
                  <br />
                  Software de verdade.
                </>
              )}
            </h1>
            <p>
              {en
                ? "I’m Gustavo, but you can call me Guh. I build web and mobile apps, AI integrations and tools that make everyday work easier."
                : "Sou Gustavo, pode chamar de Guh. Desenvolvo aplicações web e mobile, integrações com IA e ferramentas que facilitam o dia a dia."}
            </p>
            <div className="service-line">
              {en
                ? "Web development · React Native · AI & automation"
                : "Desenvolvimento web · React Native · IA e automações"}
            </div>
            <div className="portfolio-ctas">
              <a
                className="primary-cta"
                href={`mailto:${profile.email}?subject=${encodeURIComponent(en ? "Let’s talk about a project" : "Vamos conversar sobre um projeto")}`}
              >
                {en ? "Let’s build something" : "Vamos tirar do papel"}
                <span>↗</span>
              </a>
              <button onClick={() => selectStation("projects")}>
                {en ? "See my projects" : "Ver meus projetos"}
                <span>→</span>
              </button>
            </div>
            <div className="portfolio-socials">
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
              <a href={profile.github} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
              <a
                href={`${publicBase}files/gustavo-costa-curriculo.pdf`}
                target="_blank"
                rel="noreferrer"
              >
                {t.common.resume} ↗
              </a>
            </div>
            <div className="professional-note">
              <span>
                {en
                  ? "Building software since 2017."
                  : "Construindo software desde 2017."}
              </span>
              <button onClick={() => selectStation("experience")}>
                {en ? "My experience" : "Minha experiência"} ↗
              </button>
            </div>
            <button
              className="about-entry"
              onClick={() => selectStation("about")}
            >
              {en ? "A little more about me" : "Um pouco mais sobre mim"} →
            </button>
          </section>
          {exploring && (
            <section
              className="action-menu"
              id="room-actions"
              aria-label={en ? "Things to do" : "Coisas para fazer"}
            >
              <div className="action-menu-heading">
                <span>{en ? "Make yourself at home" : "Sinta-se em casa"}</span>
                <button
                  onClick={() => setExploring(false)}
                  aria-label={en ? "Close actions" : "Fechar ações"}
                >
                  ×
                </button>
              </div>
              <p>
                {en
                  ? "Pick an object in the room, or choose here."
                  : "Toque em um objeto do quarto ou escolha por aqui."}
              </p>
              <div>
                {stations.map((station) => (
                  <button
                    key={station.id}
                    onClick={() => selectStation(station.id)}
                    aria-pressed={destination === station.id}
                  >
                    <span>{station.label[en ? 1 : 0]}</span>
                    <small>{station.hint[en ? 1 : 0]}</small>
                  </button>
                ))}
              </div>
              <button
                className="free-routine"
                onClick={() => {
                  closeReader();
                  setExploring(false);
                }}
              >
                {en ? "Let Guh explore freely" : "Deixar o Guh à vontade"}{" "}
                <span>↻</span>
              </button>
            </section>
          )}
          <aside
            id="reader"
            className="content-panel"
            ref={reader}
            hidden={!panel || exploring}
            tabIndex={-1}
            aria-label={
              panel === "projects"
                ? t.common.projects
                : panel === "experience"
                  ? t.common.experience
                  : t.common.about
            }
          >
            <div className="panel">
              <div className="panel-top">
                <span>Gustavo Costa / {en ? "portfolio" : "portfólio"}</span>
                <button
                  onClick={closeReader}
                  aria-label={en ? "Close" : "Fechar"}
                >
                  ×
                </button>
              </div>
              {panel === "projects" ? (
                <>
                  <h2>{t.projectSection.title}</h2>
                  <p className="panel-lead">{t.projectSection.description}</p>
                  <div className="filters">
                    {(["all", "ai", "tools"] as const).map((f) => (
                      <button
                        key={f}
                        aria-pressed={filter === f}
                        onClick={() => setFilter(f)}
                      >
                        {t.projectSection.filters[f]}
                      </button>
                    ))}
                  </div>
                  <div className="projects">
                    {projects
                      .filter((p) => filter === "all" || p.category === filter)
                      .map((p, i) => (
                        <a
                          key={p.name}
                          href={`${profile.github}/${p.name}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span className="project-no">0{i + 1}</span>
                          <div>
                            <h3>
                              {p.name} <span>↗</span>
                            </h3>
                            <p>{t.projects[p.name].detail}</p>
                            <small>{t.projects[p.name].technology}</small>
                          </div>
                        </a>
                      ))}
                  </div>
                </>
              ) : panel === "about" ? (
                <>
                  <h2>{t.about.title}</h2>
                  {t.about.paragraphs.map((p) => (
                    <p className="about-paragraph" key={p}>
                      {p}
                    </p>
                  ))}
                  <button
                    className="text-link"
                    onClick={() => selectStation("experience")}
                  >
                    {en ? "Explore my journey" : "Conheça minha trajetória"} ↗
                  </button>
                  <div className="about-details">
                    <p>
                      {t.about.education}
                      <strong>{t.about.degree}</strong>
                    </p>
                    <p>
                      {t.about.languages}
                      <strong>{t.about.spoken}</strong>
                    </p>
                  </div>
                  <div className="socials">
                    <a href={profile.github} target="_blank" rel="noreferrer">
                      GitHub ↗
                    </a>
                    <a href={profile.linkedin} target="_blank" rel="noreferrer">
                      LinkedIn ↗
                    </a>
                    <a
                      href={`${publicBase}files/gustavo-costa-curriculo.pdf`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t.common.resume} ↗
                    </a>
                  </div>
                </>
              ) : panel === "experience" ? (
                <>
                  <h2>{t.common.experience}</h2>
                  <p className="panel-lead">{t.experience.description}</p>
                  {t.experience.jobs.map((job) => (
                    <details className="job" key={job.company}>
                      <summary>
                        <small>{job.period}</small>
                        <h3>
                          {job.company} <span>+</span>
                        </h3>
                        <p>{job.role}</p>
                      </summary>
                      <p>{job.details}</p>
                      <small>{job.progression}</small>
                    </details>
                  ))}
                  {t.experience.previous.map((job) => (
                    <p className="previous" key={job.company}>
                      <strong>{job.company}</strong> · {job.period}
                      <br />
                      {job.description}
                    </p>
                  ))}
                  <a
                    className="text-link"
                    href={`${publicBase}files/gustavo-costa-curriculo.pdf`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t.common.resume} ↗
                  </a>
                </>
              ) : null}
              <div className="panel-contact">
                <p>{t.about.contact}</p>
                <a href={`mailto:${profile.email}`}>{profile.email} ↗</a>
              </div>
            </div>
          </aside>{" "}
        </div>
        <section
          className="daily-life"
          aria-label={
            en
              ? "An interactive glimpse of my day"
              : "Um pouco do meu dia, em 3D"
          }
        >
          <div className="daily-heading">
            <span>
              {en ? "Away from the keyboard" : "Entre uma entrega e outra"}
            </span>
            <small>{en ? "INTERACTIVE" : "INTERATIVO"}</small>
          </div>
          <WorldBoundary en={en}>
            <Suspense
              fallback={
                <div className="loading" role="status">
                  <span className="loading-mark" aria-hidden="true">
                    g.
                  </span>
                  <span>
                    {en ? "Preparing the scene…" : "Preparando o cenário…"}
                  </span>
                </div>
              }
            >
              <Studio
                onZoom={setZoom}
                onActivity={setActivity}
                destination={destination}
                paused={paused}
                night={night}
                zoom={zoom}
                reset={reset}
                en={en}
                onSelect={selectStation}
              />
            </Suspense>
          </WorldBoundary>
          <ActivityCard
            activity={activity}
            paused={paused}
            en={en}
            destination={destination}
            discovered={discovered.length}
            onResume={closeReader}
          />
          <footer>
            <div className="location">
              <svg
                width="17"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              São Sebastião, {en ? "Brazil" : "Brasil"}
              <span className="coordinates">23°45′ S · 45°24′ W</span>
            </div>
            <div className="drag-hint">
              <span>⤧</span>
              {en
                ? "Hover to discover · Click an object"
                : "Arraste para girar · Toque nos objetos"}
            </div>
            <div className="world-controls">
              <span className="control-caption">
                {en ? "Make yourself at home" : "Sinta-se em casa"}
              </span>
              <button
                onClick={() => setPaused((v) => !v)}
                aria-label={
                  paused
                    ? en
                      ? "Resume animation"
                      : "Retomar animação"
                    : en
                      ? "Pause animation"
                      : "Pausar animação"
                }
                aria-pressed={paused}
              >
                {paused ? "▷" : "Ⅱ"}
              </button>
              <button
                onClick={() => setNight((v) => !v)}
                aria-label={
                  en ? "Toggle day and night" : "Alternar dia e noite"
                }
                aria-pressed={night}
              >
                {night ? "☼" : "☾"}
              </button>
              <span className="control-divider" />
              <button
                disabled={zoom <= 0.7}
                onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
                aria-label={en ? "Zoom out" : "Afastar"}
              >
                −
              </button>
              <span className="zoom-value">{Math.round(zoom * 100)}%</span>
              <button
                className="reset"
                onClick={() => {
                  setZoom(1);
                  setReset((r) => r + 1);
                }}
                aria-label={en ? "Reset view" : "Restaurar visão"}
              >
                ↺
              </button>
              <button
                disabled={zoom >= 1.6}
                onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))}
                aria-label={en ? "Zoom in" : "Aproximar"}
              >
                +
              </button>
            </div>
            <button
              className="explore-button"
              ref={worldButton}
              onClick={() => setExploring((v) => !v)}
              aria-expanded={exploring}
              aria-controls="room-actions"
              aria-label={
                en ? "Explore room actions" : "Explorar ações do quarto"
              }
            >
              <span>◇</span>
              <small>{en ? "Explore" : "Explorar"}</small>
            </button>
          </footer>{" "}
        </section>
      </main>
    </div>
  );
}
