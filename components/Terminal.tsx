"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/LanguageProvider";
import type { TerminalLine } from "@/lib/content";

interface RenderedLine extends TerminalLine {
  done: boolean;
  visible: string;
}

const TYPE_SPEED = 28; // ms per character for "command" lines
const STREAM_SPEED = 10; // ms per character for streamed output
const LINE_PAUSE = 320; // ms pause between lines
const THINK_PAUSE = 650; // ms pause after the thinking line

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const lineClasses: Record<TerminalLine["kind"], string> = {
  command: "text-slate-100",
  thinking: "text-fuchsia-400",
  output: "text-emerald-300",
  success: "text-amber-300",
};

export function Terminal() {
  const { t, locale } = useLocale();
  const [rendered, setRendered] = useState<RenderedLine[]>([]);
  const [finished, setFinished] = useState(false);
  const [runId, setRunId] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => {
    const lines = t.terminal.lines;
    clearTimers();
    setFinished(false);

    if (prefersReducedMotion()) {
      setRendered(lines.map((l) => ({ ...l, done: true, visible: l.text })));
      setFinished(true);
      return;
    }

    setRendered([]);
    let delay = 250;

    lines.forEach((line) => {
      const speed = line.kind === "command" ? TYPE_SPEED : STREAM_SPEED;

      // Push an empty line, then type it out character by character.
      timers.current.push(
        setTimeout(() => {
          setRendered((prev) => [...prev, { ...line, done: false, visible: "" }]);
        }, delay)
      );

      for (let c = 1; c <= line.text.length; c++) {
        timers.current.push(
          setTimeout(
            () => {
              setRendered((prev) => {
                const next = [...prev];
                const idx = next.length - 1;
                if (idx >= 0) {
                  next[idx] = {
                    ...next[idx],
                    visible: line.text.slice(0, c),
                    done: c === line.text.length,
                  };
                }
                return next;
              });
            },
            delay + c * speed
          )
        );
      }

      delay +=
        line.text.length * speed +
        (line.kind === "thinking" ? THINK_PAUSE : LINE_PAUSE);
    });

    timers.current.push(setTimeout(() => setFinished(true), delay));

    return clearTimers;
    // re-run when locale changes or the user clicks replay
  }, [t.terminal.lines, locale, runId, clearTimers]);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900 shadow-2xl shadow-indigo-500/10">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-slate-700/60 bg-slate-800/80 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-red-400/90" />
        <span className="h-3 w-3 rounded-full bg-yellow-400/90" />
        <span className="h-3 w-3 rounded-full bg-green-400/90" />
        <span className="ml-2 font-mono text-xs text-slate-400">
          zsh — agent session
        </span>
        {finished && (
          <button
            type="button"
            onClick={() => setRunId((n) => n + 1)}
            className="ml-auto rounded px-2 py-0.5 font-mono text-[11px] text-slate-400 transition-colors hover:bg-slate-700/60 hover:text-slate-100"
          >
            ↻ {t.terminal.replay}
          </button>
        )}
      </div>

      {/* Body */}
      <div className="min-h-[15.5rem] space-y-1 p-4 font-mono text-[13px] leading-relaxed sm:min-h-[16.5rem]">
        {rendered.map((line, i) => {
          const isLast = i === rendered.length - 1;
          const showCursor = !finished && isLast && !line.done;
          return (
            <div key={i} className="flex flex-wrap items-baseline gap-x-2">
              {line.kind === "command" && (
                <span className="shrink-0 text-indigo-400">
                  {t.terminal.prompt}
                </span>
              )}
              <span className={lineClasses[line.kind]}>
                {line.visible}
                {showCursor && (
                  <span className="ml-0.5 inline-block h-3.5 w-2 translate-y-0.5 animate-pulse bg-slate-200" />
                )}
              </span>
            </div>
          );
        })}
        {finished && (
          <div className="flex items-baseline gap-x-2">
            <span className="text-indigo-400">{t.terminal.prompt}</span>
            <span className="inline-block h-3.5 w-2 translate-y-0.5 animate-pulse bg-slate-200" />
          </div>
        )}
      </div>
    </div>
  );
}
