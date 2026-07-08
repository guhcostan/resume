"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/LanguageProvider";
import type { Locale } from "@/lib/content";
import type { ChatMessage } from "@/lib/ai/types";
import { buildSystemPrompt, SUGGESTED_QUESTIONS } from "@/lib/ai/profile";
import {
  getEngine,
  hasWebGPU,
  streamWebLLM,
  WEBLLM_MODELS,
  type WebLLMModelKey,
} from "@/lib/ai/webllm";
import { answerLite, isMobileDevice, streamLite } from "@/lib/ai/lite";

/** Same device policy as the hero phone chat. */
type TerminalMode = "full" | "mobile" | "lite";

function detectMode(): TerminalMode {
  if (!hasWebGPU()) return "lite";
  return isMobileDevice() ? "mobile" : "full";
}

function formatSize(mb: number): string {
  return mb >= 1000 ? `${(mb / 1024).toFixed(1)} GB` : `${mb} MB`;
}

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
    mobileIntro: (label: string, size: string) => string;
    liteIntro: string;
    placeholder: string;
    loadingPlaceholder: string;
    thinking: string;
    loadingModel: (pct: number, label: string, size: string) => string;
    suggestionsLabel: string;
    backendLabel: (label: string) => string;
    liteBackendLabel: string;
    help: string[];
  }
> = {
  en: {
    intro: [
      "Ask me anything about Gustavo Costa.",
      "Runs fully in your browser (WebLLM/WebGPU) — nothing leaves your device.",
      "Type a question and hit enter — or try /help for commands.",
    ],
    mobileIntro: (label, size) =>
      `On mobile I use a compact model (${label}, ~${size} one-time download) — a bit dumber, still fully on-device.`,
    liteIntro:
      "No WebGPU in this browser, so I answer instantly from Gustavo's profile instead of running the local model.",
    placeholder: "Ask about Gustavo…",
    loadingPlaceholder: "loading model… please wait",
    thinking: "thinking…",
    loadingModel: (pct, label, size) =>
      `loading ${label} (~${size}, one-time)… ${pct}%`,
    suggestionsLabel: "try asking:",
    backendLabel: (label) => `local · ${label}`,
    liteBackendLabel: "lite · instant answers",
    help: [
      "/help     show this help",
      "/clear    clear the screen",
      "/en /pt   switch language",
    ],
  },
  pt: {
    intro: [
      "Pergunte qualquer coisa sobre o Gustavo Costa.",
      "Roda 100% no seu navegador (WebLLM/WebGPU) — nada sai do seu dispositivo.",
      "Escreva uma pergunta e aperte enter — ou tente /help para comandos.",
    ],
    mobileIntro: (label, size) =>
      `No celular eu uso um modelo compacto (${label}, download único de ~${size}) — um pouco mais bobo, mas 100% no aparelho.`,
    liteIntro:
      "Sem WebGPU neste navegador, então respondo na hora a partir do perfil do Gustavo em vez de rodar o modelo local.",
    placeholder: "Pergunte sobre o Gustavo…",
    loadingPlaceholder: "carregando modelo… aguarde",
    thinking: "pensando…",
    loadingModel: (pct, label, size) =>
      `carregando ${label} (~${size}, uma vez)… ${pct}%`,
    suggestionsLabel: "experimente perguntar:",
    backendLabel: (label) => `local · ${label}`,
    liteBackendLabel: "leve · respostas instantâneas",
    help: [
      "/help     mostra esta ajuda",
      "/clear    limpa a tela",
      "/en /pt   troca o idioma",
    ],
  },
};

export function AiTerminal({
  autoPreload = true,
  autoFocusInput = true,
}: {
  autoPreload?: boolean;
  autoFocusInput?: boolean;
} = {}) {
  const { locale, setLocale } = useLocale();
  const s = STRINGS[locale];

  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [modelPct, setModelPct] = useState<number | null>(null);
  const [modelError, setModelError] = useState(false);

  const history = useRef<string[]>([]);
  const historyIdx = useRef<number>(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Decided after mount so server and first client render stay identical.
  const [mode, setMode] = useState<TerminalMode>("full");
  useEffect(() => {
    setMode(detectMode());
  }, []);

  const model =
    WEBLLM_MODELS[(mode === "mobile" ? "mobile" : "full") as WebLLMModelKey];

  const push = useCallback((entry: Entry) => {
    setEntries((prev) => [...prev, entry]);
  }, []);

  // Auto-scroll to the bottom as content streams in.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [entries, modelPct]);

  // Preload the model as soon as the page opens, so it's ready — or well on
  // its way — by the time the visitor asks something. Desktop only: on mobile
  // the (smaller) model still shouldn't auto-eat ~350 MB of data on page open,
  // so there it loads on the first question instead.
  useEffect(() => {
    if (!autoPreload || detectMode() !== "full") return;
    let cancelled = false;
    setModelPct(0);
    setModelError(false);
    getEngine("full", (p) => {
      if (!cancelled) setModelPct(Math.round(p.progress * 100));
    })
      .then(() => {
        if (!cancelled) setModelPct(100);
      })
      .catch(() => {
        // Unblock the input so the user can retry / see the error on ask.
        if (!cancelled) setModelError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [autoPreload]);

  const conversation = useCallback((): ChatMessage[] => {
    // Rebuild the chat history from the transcript (user/assistant turns only).
    const turns: ChatMessage[] = [];
    for (const e of entries) {
      if (e.kind === "user") turns.push({ role: "user", content: e.text });
      else if (e.kind === "assistant")
        turns.push({ role: "assistant", content: e.text });
    }
    return turns;
  }, [entries]);

  const ask = useCallback(
    async (question: string) => {
      setBusy(true);
      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;

      // Placeholder assistant entry we stream into.
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

      // Re-detect at ask time so the guard can't race the mount effect.
      const modeNow = detectMode();

      try {
        if (modeNow === "lite") {
          await new Promise((r) => setTimeout(r, 400));
          await streamLite(answerLite(question, locale), onToken);
          return;
        }

        const key: WebLLMModelKey = modeNow === "mobile" ? "mobile" : "full";
        const messages: ChatMessage[] = [
          { role: "system", content: buildSystemPrompt(locale) },
          ...conversation(),
          { role: "user", content: question },
        ];

        // Engine is usually already preloaded; getEngine reuses that promise.
        await getEngine(key, (p) => setModelPct(Math.round(p.progress * 100)));
        setModelPct(100);
        await streamWebLLM(messages, { onToken, signal }, key);
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
    [locale, conversation]
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
    if (e.key === "Enter") {
      submit(input);
    } else if (e.key === "ArrowUp") {
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

  const size = formatSize(model.sizeMB);

  // The model is downloading/initializing — block input until it's ready.
  const modelLoading =
    mode !== "lite" && !modelError && modelPct !== null && modelPct < 100;
  const inputDisabled = busy || modelLoading;

  return (
    <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900 shadow-2xl shadow-indigo-500/10">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-slate-700/60 bg-slate-800/80 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-red-400/90" />
        <span className="h-3 w-3 rounded-full bg-yellow-400/90" />
        <span className="h-3 w-3 rounded-full bg-green-400/90" />
        <span className="ml-2 font-mono text-xs text-slate-400">
          ask-gustavo — agent
        </span>
        <span className="rounded bg-amber-500/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-amber-400">
          beta
        </span>
        <span className="ml-auto rounded bg-slate-700/50 px-2 py-0.5 font-mono text-[10px] text-slate-300">
          {mode === "lite" ? s.liteBackendLabel : s.backendLabel(model.label)}
        </span>
      </div>

      {/* Transcript + loading overlay */}
      <div className="relative">
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="h-[60vh] min-h-[360px] space-y-2 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed"
      >
        {/* Intro */}
        <div className="text-slate-400">
          {s.intro.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
          {mode === "mobile" && (
            <div className="text-amber-400/90">
              {s.mobileIntro(model.label, size)}
            </div>
          )}
          {mode === "lite" && (
            <div className="text-amber-400/90">{s.liteIntro}</div>
          )}
        </div>

        {/* Suggestions when empty */}
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
                  className="rounded border border-slate-700 px-2 py-1 text-xs text-indigo-300 transition-colors hover:border-indigo-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
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

        {/* Loading / thinking indicator */}
        {busy && (
          <div className="text-fuchsia-400">
            {modelPct !== null && modelPct < 100
              ? s.loadingModel(modelPct, model.label, size)
              : s.thinking}
          </div>
        )}

        {/* Live input line */}
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-indigo-400">{PROMPT}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={inputDisabled}
            autoFocus={autoFocusInput}
            spellCheck={false}
            autoComplete="off"
            placeholder={modelLoading ? s.loadingPlaceholder : s.placeholder}
            className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-600 focus:outline-none disabled:opacity-50"
            aria-label="terminal input"
          />
        </div>
      </div>

        {/* Blurred loading overlay while the model downloads */}
        {modelLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-slate-900/50 backdrop-blur-md">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-600 border-t-indigo-400" />
            <div className="max-w-[80%] text-center font-mono text-xs text-slate-200">
              {s.loadingModel(modelPct ?? 0, model.label, size)}
            </div>
            <div className="h-1.5 w-56 max-w-[70%] overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-indigo-500 transition-[width] duration-300"
                style={{ width: `${modelPct ?? 0}%` }}
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
        <span className="shrink-0 text-indigo-400">{PROMPT}</span>
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
  // assistant
  return (
    <div className="whitespace-pre-wrap text-emerald-300">{entry.text}</div>
  );
}
