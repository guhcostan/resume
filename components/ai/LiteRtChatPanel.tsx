"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/components/providers/LanguageProvider";
import type { Locale } from "@/lib/content";
import { buildSystemPrompt, SUGGESTED_QUESTIONS } from "@/lib/ai/profile";
import {
  getLiteRtEngine,
  hasJSPI,
  hasWebGPU,
  streamLiteRt,
  type DownloadProgress,
} from "@/lib/ai/litertlm";

type EntryKind = "user" | "assistant" | "system" | "error";
interface Entry {
  kind: EntryKind;
  text: string;
}

function fmtSize(bytes: number): string {
  const gb = bytes / 1024 ** 3;
  return gb >= 1 ? `${gb.toFixed(2)} GB` : `${(bytes / 1024 ** 2).toFixed(0)} MB`;
}

const COPY: Record<
  Locale,
  {
    intro: string;
    placeholder: string;
    loadingPlaceholder: string;
    thinking: string;
    downloading: string;
    noWebGPU: string;
    noJSPI: string;
    suggestions: string;
    badge: string;
    help: string[];
  }
> = {
  en: {
    intro: "Experimental Gemma 4 via LiteRT-LM — desktop Chrome/Edge only.",
    placeholder: "Your question…",
    loadingPlaceholder: "Loading model…",
    thinking: "Thinking…",
    downloading: "Downloading model",
    noWebGPU: "WebGPU required. Use desktop Chrome or Edge.",
    noJSPI:
      "LiteRT-LM needs WebAssembly JSPI (not available on Safari). Use desktop Chrome or Edge.",
    suggestions: "Suggestions",
    badge: "Experimental · LiteRT-LM",
    help: ["/help — commands", "/clear — reset", "/en /pt — language"],
  },
  pt: {
    intro: "Gemma 4 experimental via LiteRT-LM — só Chrome/Edge desktop.",
    placeholder: "Sua pergunta…",
    loadingPlaceholder: "Carregando modelo…",
    thinking: "Pensando…",
    downloading: "Baixando modelo",
    noWebGPU: "WebGPU necessário. Use Chrome ou Edge desktop.",
    noJSPI:
      "LiteRT-LM precisa de WebAssembly JSPI (Safari não suporta). Use Chrome ou Edge desktop.",
    suggestions: "Sugestões",
    badge: "Experimental · LiteRT-LM",
    help: ["/help — comandos", "/clear — limpar", "/en /pt — idioma"],
  },
};

export function LiteRtChatPanel() {
  const { locale, setLocale } = useLocale();
  const copy = COPY[locale];

  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [errored, setErrored] = useState(false);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const webgpu = useMemo(() => hasWebGPU(), []);
  const jspi = useMemo(() => hasJSPI(), []);
  const supported = mounted && webgpu && jspi;

  const push = useCallback((entry: Entry) => {
    setEntries((prev) => [...prev, entry]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [entries, progress]);

  useEffect(() => {
    if (!supported) return;
    let cancelled = false;
    setLoading(true);
    getLiteRtEngine((p) => {
      if (!cancelled) setProgress(p);
    })
      .then(() => {
        if (!cancelled) {
          setReady(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setLoading(false);
        setErrored(true);
        push({
          kind: "error",
          text: err instanceof Error ? err.message : String(err),
        });
      });
    return () => {
      cancelled = true;
    };
  }, [supported, push]);

  const ask = useCallback(
    async (question: string) => {
      if (!webgpu || !jspi) {
        push({ kind: "error", text: jspi ? copy.noWebGPU : copy.noJSPI });
        return;
      }
      setBusy(true);
      abortRef.current = new AbortController();

      let assistantIndex = -1;
      setEntries((prev) => {
        assistantIndex = prev.length;
        return [...prev, { kind: "assistant", text: "" }];
      });

      const onToken = (delta: string) => {
        setEntries((prev) => {
          const next = [...prev];
          if (next[assistantIndex]) {
            next[assistantIndex] = {
              kind: "assistant",
              text: next[assistantIndex].text + delta,
            };
          }
          return next;
        });
      };

      try {
        await streamLiteRt(buildSystemPrompt(locale), question, {
          onToken,
          signal: abortRef.current.signal,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setEntries((prev) => {
          const next = [...prev];
          if (next[assistantIndex]?.text === "") next.splice(assistantIndex, 1);
          return [...next, { kind: "error", text: msg }];
        });
      } finally {
        setBusy(false);
        abortRef.current = null;
      }
    },
    [webgpu, jspi, locale, push, copy]
  );

  const runCommand = useCallback(
    (raw: string): boolean => {
      const cmd = raw.trim().toLowerCase();
      if (!cmd.startsWith("/")) return false;
      switch (cmd) {
        case "/help":
          push({ kind: "system", text: copy.help.join("\n") });
          return true;
        case "/clear":
          setEntries([]);
          return true;
        case "/en":
          setLocale("en");
          return true;
        case "/pt":
          setLocale("pt");
          return true;
        default:
          push({ kind: "error", text: `Unknown: ${cmd}` });
          return true;
      }
    },
    [push, copy.help, setLocale]
  );

  const submit = (value: string) => {
    const text = value.trim();
    if (!text || busy) return;
    setInput("");
    push({ kind: "user", text });
    if (runCommand(text)) return;
    void ask(text);
  };

  const showLoading = loading && !errored;
  const inputDisabled = busy || showLoading || !supported;
  const pct =
    progress && progress.total > 0
      ? Math.round((progress.loaded / progress.total) * 100)
      : null;

  return (
    <div className="overflow-hidden rounded-3xl border border-dashed border-accent/30 bg-surface shadow-card dark:bg-surface-dark dark:shadow-card-dark">
      <div className="flex items-center justify-between border-b border-ink/8 px-5 py-4 dark:border-ink-dark/10">
        <p className="font-mono text-xs uppercase tracking-widest text-accent dark:text-accent-dark">
          {copy.badge}
        </p>
        <span className="font-mono text-[10px] text-ink-faint">
          {ready ? "gemma 4 · ready" : "loading"}
        </span>
      </div>

      <div ref={scrollRef} className="relative h-[min(60vh,520px)] overflow-y-auto px-5 py-6">
        <p className="mb-4 text-sm text-ink-muted dark:text-ink-muted-dark">{copy.intro}</p>

        {mounted && !supported && (
          <p className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
            ⚠ {jspi ? copy.noWebGPU : copy.noJSPI}
          </p>
        )}

        {entries.length === 0 && supported && (
          <div className="mb-6 flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS[locale].map((q) => (
              <button
                key={q}
                type="button"
                disabled={inputDisabled}
                onClick={() => submit(q)}
                className="rounded-full border border-ink/10 px-3 py-1.5 text-xs disabled:opacity-40"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-4">
          {entries.map((entry, i) => (
            <Bubble key={i} entry={entry} />
          ))}
          {busy && (
            <p className="font-mono text-xs text-accent dark:text-accent-dark">{copy.thinking}</p>
          )}
        </div>

        {showLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface/85 backdrop-blur-sm dark:bg-surface-dark/85">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink/10 border-t-accent" />
            <p className="font-mono text-xs text-ink-muted">
              {copy.downloading}
              {progress
                ? ` — ${fmtSize(progress.loaded)}${
                    progress.total > 0 ? ` / ${fmtSize(progress.total)}` : ""
                  }${pct !== null ? ` (${pct}%)` : ""}`
                : "…"}
            </p>
          </div>
        )}
      </div>

      <form
        className="border-t border-ink/8 p-4 dark:border-ink-dark/10"
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
      >
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={inputDisabled}
            placeholder={showLoading ? copy.loadingPlaceholder : copy.placeholder}
            className="flex-1 rounded-full border border-ink/10 bg-canvas px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50 dark:border-ink-dark/15 dark:bg-canvas-dark dark:text-ink-dark"
          />
          <button
            type="submit"
            disabled={inputDisabled || !input.trim()}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40"
          >
            →
          </button>
        </div>
      </form>
    </div>
  );
}

function Bubble({ entry }: { entry: Entry }) {
  if (entry.kind === "user") {
    return (
      <div className="ml-auto max-w-[85%] rounded-2xl bg-accent px-4 py-3 text-sm text-white">
        {entry.text}
      </div>
    );
  }
  if (entry.kind === "assistant") {
    return (
      <div className="max-w-[90%] rounded-2xl border border-ink/8 bg-surface-raised px-4 py-3 text-sm dark:border-ink-dark/10 dark:bg-surface-raised-dark">
        {entry.text || "…"}
      </div>
    );
  }
  if (entry.kind === "system") {
    return <pre className="font-mono text-xs text-ink-faint">{entry.text}</pre>;
  }
  return <p className="text-sm text-red-600">⚠ {entry.text}</p>;
}
