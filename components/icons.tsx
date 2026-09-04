export type IconName = "terminal" | "chart" | "braces" | "window" | "layers" | "github" | "mail" | "location" | "file" | "copy" | "check" | "sun" | "moon" | "star";

export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    star: <path d="m12 3 2.8 5.7 6.3.9-4.5 4.4 1 6.2L12 17.3l-5.6 2.9 1-6.2L2.9 9.6l6.3-.9L12 3Z" />,
    terminal: <><path d="m5 6 5 5-5 5M13 17h6" /></>,
    chart: <><path d="M4 4v16h16M7 14l4-5 4 3 5-7" /></>,
    braces: <><path d="M8 3H6a2 2 0 0 0-2 2v4l-2 3 2 3v4a2 2 0 0 0 2 2h2M16 3h2a2 2 0 0 1 2 2v4l2 3-2 3v4a2 2 0 0 1-2 2h-2" /></>,
    window: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v5" /></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5" /></>,
    github: <path d="M9 19c-4 1-4-2-6-2m12 5v-4c0-1 .1-1.6-.5-2.2 3.5-.4 7-1.7 7-7.8A6 6 0 0 0 20 4.8 6 6 0 0 0 19.8 1S18.4.6 15 2.5a13 13 0 0 0-6 0C5.6.6 4.2 1 4.2 1A6 6 0 0 0 4 4.8 6 6 0 0 0 2.5 9c0 6.1 3.5 7.4 7 7.8-.6.6-.5 1.2-.5 2.2v3" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6" /></>,
    location: <><path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"/><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    copy: <><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/></>,
    moon: <path d="M20.5 13.5A8.5 8.5 0 0 1 10.5 3 8.8 8.8 0 1 0 20.5 13.5Z" />,
  };
  return <svg className={`icon ${className}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
