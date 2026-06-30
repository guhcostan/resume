"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/components/LanguageProvider";
import type { Locale } from "@/lib/content";
import { buildSystemPrompt, SUGGESTED_QUESTIONS } from "@/lib/ai/profile";
import {
  getLiteRtEngine,
  hasJSPI,
  hasWebGPU,
  LITERT_MODEL,
  streamLiteRt,
  type DownloadProgress,
} from "@/lib/ai/litertlm";

type EntryKind = "user" | "assistant" | "system" | "error";
interface Entry {
  kind: EntryKind;
  text: string;
}

const PROMPT = "guest@guhcostan ~ %";

function fmtMB(bytes: number): string {
  const gb = bytes / 1024 ** 3;
  if (gb >= 1) return `${gb.toFixed(2)} GB`;
  return `${(bytes / 1024 ** 2).toFixed(0)} MB`;
}

const STRINGS: Record<
  Locale,
  {
    intro: string[];
    placeholder: string;
    loadingPlaceholder: string;
    thinking: string;
    downloading: string;
    noWebGPU: string;
    noJSPI: string;
    suggestionsLabel: string;
    help: string[];
  }
> = {
  en: {
    intro: [
      "Experimental: Gemma 4 (E2B) via Google's LiteRT-LM, in your browser.",
      "Type a question about Gustavo — or /help for commands.",
    ],
    placeholder: "Ask about Gustavo…",
    loadingPlaceholder: "loading model… please wait",
    thinking: "thinking…",
    downloading: "downloading model",
    noWebGPU:
      "This browser doesn't support WebGPU. Try the latest Chrome/Edge desktop.",
    noJSPI:
      "LiteRT-LM needs WebAssembly JSPI, which Safari (iOS/macOS) doesn't support yet. Open this on desktop Chrome or Edge to try Gemma 4. (The main /terminal works everywhere.)",
    suggestionsLabel: "try asking:",
    help: [
      "/help     show this help",
      "/clear    clear the screen",
      "/en /pt   switch language",
    ],
  },
  pt: {
    intro: [
      "Experimental: Gemma 4 (E2B) via LiteRT-LM do Google, no seu navegador.",
      "Escreva uma pergunta sobre o Gustavo — ou /help para comandos.",
    ],
    placeholder: "Pergunte sobre o Gustavo…",
    loadingPlaceholder: "carregando modelo… aguarde",
    thinking: "pensando…",
    downloading: "baixando modelo",
    noWebGPU:
      "Este navegador não suporta WebGPU. Use Chrome/Edge desktop recente.",
    noJSPI:
      "O LiteRT-LM precisa do WebAssembly JSPI, que o Safari (iOS/macOS) ainda não suporta. Abra no Chrome ou Edge desktop pra testar o Gemma 4. (O /terminal principal funciona em qualquer navegador.)",
    suggestionsLabel: "experimente perguntar:",
    help: [
      "/help     mostra esta ajuda",
      "/clear    limpa a tela",
      "/en /pt   troca o idioma",
    ],
  },
};

export function LiteRtTerminal() {
  const { locale, setLocale } = useLocale();
  const s = STRINGS[locale];

  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [errored, setErrored] = useState(false);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);

  const history = useRef<string[]>([]);
  const historyIdx = useRef<number>(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Capability checks are client-only; gate on `mounted` so the first client
  // render matches the statically prerendered HTML (avoids hydration mismatch).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const webgpu = useMemo(() => hasWebGPU(), []);
  const jspi = useMemo(() => hasJSPI(), []);
  const supported = mounted && webgpu && jspi;
  const unsupported = mounted && !(webgpu && jspi);

  const push = useCallback((entry: Entry) => {
    setEntries((prev) => [...prev, entry]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [entries, loading, progress]);

  // Preload the model on open (only when the runtime is supported).
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
        push({ kind: "error", text: jspi ? s.noWebGPU : s.noJSPI });
        return;
      }
      setBusy(true);
      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;

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
          signal,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setEntries((prev) => {
          const next = [...prev];
          if (next[assistantIndex] && next[assistantIndex].text === "") {
            next.splice(assistantIndex, 1);
          }
          return [...next, { kind: "error", text: msg }];
        });
      } finally {
        setBusy(false);
        abortRef.current = null;
      }
    },
    [webgpu, jspi, locale, push, s]
  );

  const runCommand = useCallback(
    (raw: string): boolean => {
      const cmd = raw.trim().toLowerCase();
      if (!cmd.startsWith("/")) return false;
      switch (cmd) {
        case "/help":
          push({ kind: "system", text: s.help.join("\n") });
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
          push({ kind: "error", text: `command not found: ${cmd}` });
          return true;
      }
    },
    [push, s, setLocale]
  );

  const submit = useCallback(
    (value: string) => {
      const text = value.trim();
      if (!text || busy) return;
      history.current.unshift(text);
      historyIdx.current = -1;
      setInput("");
      push({ kind: "user", text });
      if (runCommand(text)) return;
      void ask(text);
    },
    [busy, push, runCommand, ask]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submit(input);
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      const h = history.current;
      if (h.length === 0) return;
      historyIdx.current = Math.min(historyIdx.current + 1, h.length - 1);
      setInput(h[historyIdx.current] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      historyIdx.current = Math.max(historyIdx.current - 1, -1);
      setInput(
        historyIdx.current === -1 ? "" : history.current[historyIdx.current] ?? ""
      );
    }
  };

  const showLoading = loading && !errored;
  const inputDisabled = busy || showLoading || !supported;
  const pct =
    progress && progress.total > 0
      ? Math.round((progress.loaded / progress.total) * 100)
      : null;

  return (
    <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900 shadow-2xl shadow-fuchsia-500/10">
      <div className="flex items-center gap-2 border-b border-slate-700/60 bg-slate-800/80 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-red-400/90" />
        <span className="h-3 w-3 rounded-full bg-yellow-400/90" />
        <span className="h-3 w-3 rounded-full bg-green-400/90" />
        <span className="ml-2 font-mono text-xs text-slate-400">
          ask-gustavo — litert-lm
        </span>
        <span className="rounded bg-fuchsia-500/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-fuchsia-400">
          experimental
        </span>
        <span className="ml-auto rounded bg-slate-700/50 px-2 py-0.5 font-mono text-[10px] text-slate-300">
          {ready ? "local · gemma 4" : "loading"}
        </span>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          onClick={() => inputRef.current?.focus()}
          className="h-[60vh] min-h-[360px] space-y-2 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed"
        >
          <div className="text-slate-400">
            {s.intro.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>

          {unsupported && (
            <div className="mt-2 text-amber-400">⚠ {jspi ? s.noWebGPU : s.noJSPI}</div>
          )}

          {entries.length === 0 && supported && (
            <div className="pt-2">
              <div className="mb-1 text-slate-500">{s.suggestionsLabel}</div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS[locale].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => submit(q)}
                    disabled={inputDisabled}
                    className="rounded border border-slate-700 px-2 py-1 text-xs text-fuchsia-300 transition-colors hover:border-fuchsia-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {entries.map((entry, i) => (
            <Line key={i} entry={entry} />
          ))}

          {busy && <div className="text-fuchsia-400">{s.thinking}</div>}

          <div className="flex items-center gap-2">
            <span className="shrink-0 text-fuchsia-400">{PROMPT}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={inputDisabled}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              placeholder={showLoading ? s.loadingPlaceholder : s.placeholder}
              className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-600 focus:outline-none disabled:opacity-50"
              aria-label="terminal input"
            />
          </div>
        </div>

        {/* Download overlay with progress bar */}
        {showLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-slate-900/60 backdrop-blur-md px-6">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-600 border-t-fuchsia-400" />
            <div className="text-center font-mono text-xs text-slate-200">
              {s.downloading}
              {progress
                ? ` — ${fmtMB(progress.loaded)}${
                    progress.total > 0 ? ` / ${fmtMB(progress.total)}` : ""
                  }${pct !== null ? ` (${pct}%)` : ""}`
                : "…"}
            </div>
            <div className="h-1.5 w-64 max-w-[75%] overflow-hidden rounded-full bg-slate-700">
              <div
                className={`h-full rounded-full bg-fuchsia-500 transition-[width] duration-200 ${
                  pct === null ? "animate-pulse w-1/3" : ""
                }`}
                style={pct !== null ? { width: `${pct}%` } : undefined}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Line({ entry }: { entry: Entry }) {
  if (entry.kind === "user") {
    return (
      <div className="flex items-baseline gap-2">
        <span className="shrink-0 text-fuchsia-400">{PROMPT}</span>
        <span className="text-slate-100">{entry.text}</span>
      </div>
    );
  }
  if (entry.kind === "system") {
    return <pre className="whitespace-pre-wrap text-slate-400">{entry.text}</pre>;
  }
  if (entry.kind === "error") {
    return <div className="text-red-400">⚠ {entry.text}</div>;
  }
  return <div className="whitespace-pre-wrap text-emerald-300">{entry.text}</div>;
}
