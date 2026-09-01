interface SectionProps {
  id: string;
  index?: string;
  heading?: string;
  kicker?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({
  id,
  index,
  heading,
  kicker,
  children,
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`mx-auto max-w-7xl scroll-mt-20 px-5 py-14 sm:px-8 sm:py-20 ${className ?? ""}`}
    >
      {heading && (
        <div className="reveal mb-10">
          <div className="flex items-center gap-3">
            {index && (
              <span className="font-mono text-[11px] font-semibold tracking-widest text-clay">
                {index}
              </span>
            )}
            {kicker && (
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                {kicker}
              </span>
            )}
            <span aria-hidden className="h-px flex-1 bg-ink-line" />
          </div>
          <h2 className="mt-4 text-4xl font-semibold leading-none tracking-[-0.05em] text-ink sm:text-6xl">
            {heading}
          </h2>
        </div>
      )}
      {children}
    </section>
  );
}
