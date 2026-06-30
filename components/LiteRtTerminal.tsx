"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/components/LanguageProvider";
import type { Locale } from "@/lib/content";
import { buildSystemPrompt, SUGGESTED_QUESTIONS } from "@/lib/ai/profile";
import {
  getLiteRtEngine,
  hasWebGPU,
  LITERT_MODEL,
  streamLiteRt,
} from "@/lib/ai/litertlm";

type EntryKind = "user" | "assistant" | "system" | "error";
interface Entry {
  kind: EntryKind;
  text: string;
}

const PROMPT = "guest@guhcostan ~ %";

const STRINGS: Record<
  Locale,
  {
    intro: string[];
    placeholder: string;
    loadingPlaceholder: string;
    thinking: string;
    loading: string;
    noWebGPU: string;
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
    loading: `downloading ${LITERT_MODEL.label} — first load can take a few minutes…`,
    noWebGPU:
      "This browser doesn't support WebGPU. Try the latest Chrome/Edge desktop or Safari (iOS/macOS 26+).",
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
    loading: `baixando ${LITERT_MODEL.label} — a 1ª carga pode levar alguns minutos…`,
    noWebGPU:
      "Este navegador não suporta WebGPU. Use Chrome/Edge desktop recente ou Safari (iOS/macOS 26+).",
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

  const history = useRef<string[]>([]);
  const historyIdx = useRef<number>(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const webgpu = useMemo(() => hasWebGPU(), []);

  const push = useCallback((entry: Entry) => {
    setEntries((prev) => [...prev, entry]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [entries, loading]);

  // Preload the model on open.
  useEffect(() => {
    if (!webgpu) return;
    let cancelled = false;
    setLoading(true);
    getLiteRtEngine()
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
  }, [webgpu, push]);

  const ask = useCallback(
    async (question: string) => {
      if (!webgpu) {
        push({ kind: "error", text: s.noWebGPU });
        return;
      }
      setBusy(true);
      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;

      // LiteRT-LM takes a single message; ground it with the profile each turn.
      const prompt = `${buildSystemPrompt(locale)}\n\n${question}`;

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
        await streamLiteRt(prompt, { onToken, signal });
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
    [webgpu, locale, push, s]
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

  const inputDisabled = busy || (loading && !errored);

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

          {entries.length === 0 && (
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
              placeholder={
                loading && !errored ? s.loadingPlaceholder : s.placeholder
              }
              className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-600 focus:outline-none disabled:opacity-50"
              aria-label="terminal input"
            />
          </div>
        </div>

        {loading && !errored && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-slate-900/50 backdrop-blur-md">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-600 border-t-fuchsia-400" />
            <div className="max-w-[80%] text-center font-mono text-xs text-slate-200">
              {s.loading}
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
