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
      className={`mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:px-10 ${className ?? ""}`}
    >
      {heading && (
        <div className="reveal mb-12 grid gap-4 border-t border-stone-900/20 pt-5 sm:mb-16 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] dark:border-white/15">
          <div className="eyebrow">
            {index ? `S / ${index}` : "Portfolio"}
          </div>
          <div className="flex items-end justify-between gap-5">
            <h2 className="font-display text-4xl font-bold leading-none tracking-[-0.04em] text-stone-950 sm:text-5xl lg:text-6xl dark:text-white">
              {heading}
            </h2>
            <span className="mb-1 hidden h-2.5 w-2.5 rounded-full bg-brand sm:block" />
          </div>
        </div>
      )}
      {children}
    </section>
  );
}
