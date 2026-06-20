interface SectionProps {
  id: string;
  heading?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ id, heading, children, className }: SectionProps) {
  return (
    <section
      id={id}
      className={`mx-auto max-w-5xl scroll-mt-20 px-5 py-16 sm:py-20 ${className ?? ""}`}
    >
      {heading && (
        <h2 className="reveal mb-10 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          <span className="text-indigo-500">#</span> {heading}
        </h2>
      )}
      {children}
    </section>
  );
}
