interface SectionProps {
  id: string;
  index?: string;
  heading?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ id, index, heading, children, className }: SectionProps) {
  return (
    <section
      id={id}
      className={`mx-auto max-w-6xl scroll-mt-20 px-5 py-16 sm:py-24 ${className ?? ""}`}
    >
      {heading && (
        <div className="reveal mb-10 flex items-baseline gap-3">
          {index && (
            <span className="font-mono text-sm font-medium text-brand">
              {index}
            </span>
          )}
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {heading}
          </h2>
          <span
            aria-hidden
            className="hidden h-px flex-1 self-center bg-gradient-to-r from-slate-300 to-transparent sm:block dark:from-ink-border"
          />
        </div>
      )}
      {children}
    </section>
  );
}
