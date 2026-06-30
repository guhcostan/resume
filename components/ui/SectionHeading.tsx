interface SectionHeadingProps {
  index: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeading({
  index,
  title,
  subtitle,
  className = "",
}: SectionHeadingProps) {
  return (
    <header className={`reveal mb-12 md:mb-16 ${className}`}>
      <p className="section-label">{index}</p>
      <h2 className="mt-3 font-display text-4xl tracking-tight text-ink dark:text-ink-dark md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted dark:text-ink-muted-dark">
          {subtitle}
        </p>
      )}
    </header>
  );
}
