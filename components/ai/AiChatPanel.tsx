"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/components/providers/LanguageProvider";
import type { Locale } from "@/lib/content";
import type { ChatMessage } from "@/lib/ai/types";
import { buildSystemPrompt, SUGGESTED_QUESTIONS } from "@/lib/ai/profile";
import { getEngine, hasWebGPU, streamWebLLM, WEBLLM_MODEL } from "@/lib/ai/webllm";

type EntryKind = "user" | "assistant" | "system" | "error";
interface Entry {
  kind: EntryKind;
  text: string;
}

const MODEL_GB = (WEBLLM_MODEL.sizeMB / 1024).toFixed(1);

const COPY: Record<
  Locale,
  {
    intro: string;
    placeholder: string;
    loadingPlaceholder: string;
    thinking: string;
    loadingModel: (pct: number) => string;
    noWebGPU: string;
    suggestions: string;
    badge: string;
    privacy: string;
    help: string[];
  }
> = {
  en: {
    intro: "Ask anything about Gustavo's career. Runs locally in your browser.",
    placeholder: "Your question…",
    loadingPlaceholder: "Loading model…",
    thinking: "Thinking…",
    loadingModel: (pct) => `Loading ${WEBLLM_MODEL.label} (~${MODEL_GB} GB)… ${pct}%`,
    noWebGPU:
      "WebGPU is required. Try the latest Chrome, Edge, or Safari (iOS/macOS 26+).",
    suggestions: "Suggestions",
    badge: "Local · WebGPU",
    privacy: "Nothing leaves your device.",
    help: ["/help — commands", "/clear — reset", "/en /pt — language"],
  },
  pt: {
    intro: "Pergunte sobre a carreira do Gustavo. Roda localmente no navegador.",
    placeholder: "Sua pergunta…",
    loadingPlaceholder: "Carregando modelo…",
    thinking: "Pensando…",
    loadingModel: (pct) => `Carregando ${WEBLLM_MODEL.label} (~${MODEL_GB} GB)… ${pct}%`,
    noWebGPU:
      "WebGPU é necessário. Use Chrome, Edge ou Safari recente (iOS/macOS 26+).",
    suggestions: "Sugestões",
    badge: "Local · WebGPU",
    privacy: "Nada sai do seu dispositivo.",
    help: ["/help — comandos", "/clear — limpar", "/en /pt — idioma"],
  },
};

export function AiChatPanel() {
  const { locale, setLocale } = useLocale();
  const copy = COPY[locale];

  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [modelPct, setModelPct] = useState<number | null>(null);
  const [modelError, setModelError] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const webgpu = useMemo(() => hasWebGPU(), []);

  const push = useCallback((entry: Entry) => {
    setEntries((prev) => [...prev, entry]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [entries, modelPct]);

  useEffect(() => {
    if (!webgpu) return;
    let cancelled = false;
    setModelPct(0);
    setModelError(false);
    getEngine((p) => {
      if (!cancelled) setModelPct(Math.round(p.progress * 100));
    })
      .then(() => {
        if (!cancelled) setModelPct(100);
      })
      .catch(() => {
        if (!cancelled) setModelError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [webgpu]);

  const conversation = useCallback((): ChatMessage[] => {
    const turns: ChatMessage[] = [];
    for (const e of entries) {
      if (e.kind === "user") turns.push({ role: "user", content: e.text });
      else if (e.kind === "assistant") turns.push({ role: "assistant", content: e.text });
    }
    return turns;
  }, [entries]);

  const ask = useCallback(
    async (question: string) => {
      if (!webgpu) {
        push({ kind: "error", text: copy.noWebGPU });
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
        await getEngine((p) => setModelPct(Math.round(p.progress * 100)));
        setModelPct(100);
        await streamWebLLM(
          [
            { role: "system", content: buildSystemPrompt(locale) },
            ...conversation(),
            { role: "user", content: question },
          ],
          { onToken, signal: abortRef.current.signal }
        );
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
    [webgpu, locale, conversation, push, copy.noWebGPU]
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

  const modelLoading = webgpu && !modelError && modelPct !== null && modelPct < 100;
  const inputDisabled = busy || modelLoading;

  return (
    <div className="overflow-hidden rounded-3xl border border-ink/10 bg-surface shadow-card dark:border-ink-dark/10 dark:bg-surface-dark dark:shadow-card-dark">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/8 px-5 py-4 dark:border-ink-dark/10">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent dark:text-accent-dark">
            {copy.badge}
          </p>
          <p className="mt-1 text-sm text-ink-muted dark:text-ink-muted-dark">{copy.privacy}</p>
        </div>
        <span className="rounded-full bg-accent-soft px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-accent dark:bg-accent/15 dark:text-accent-dark">
          beta
        </span>
      </div>

      <div ref={scrollRef} className="relative h-[min(60vh,520px)] overflow-y-auto px-5 py-6">
        <p className="mb-6 text-sm text-ink-muted dark:text-ink-muted-dark">{copy.intro}</p>

        {entries.length === 0 && (
          <div className="mb-6">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-ink-faint">
              {copy.suggestions}
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS[locale].map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={inputDisabled}
                  onClick={() => submit(q)}
                  className="rounded-full border border-ink/10 px-3 py-1.5 text-left text-xs text-ink transition hover:border-accent/40 hover:text-accent disabled:opacity-40 dark:border-ink-dark/15 dark:text-ink-dark"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {entries.map((entry, i) => (
            <Bubble key={i} entry={entry} />
          ))}
          {busy && (
            <p className="animate-pulse font-mono text-xs text-accent dark:text-accent-dark">
              {modelPct !== null && modelPct < 100
                ? copy.loadingModel(modelPct)
                : copy.thinking}
            </p>
          )}
        </div>

        {modelLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-surface/80 backdrop-blur-sm dark:bg-surface-dark/80">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink/10 border-t-accent" />
            <p className="font-mono text-xs text-ink-muted">{copy.loadingModel(modelPct ?? 0)}</p>
            <div className="h-1 w-48 overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${modelPct ?? 0}%` }}
              />
            </div>
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
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={inputDisabled}
            autoFocus
            spellCheck={false}
            placeholder={modelLoading ? copy.loadingPlaceholder : copy.placeholder}
            className="flex-1 rounded-full border border-ink/10 bg-canvas px-4 py-2.5 text-sm text-ink outline-none ring-accent/30 placeholder:text-ink-faint focus:ring-2 disabled:opacity-50 dark:border-ink-dark/15 dark:bg-canvas-dark dark:text-ink-dark"
          />
          <button
            type="submit"
            disabled={inputDisabled || !input.trim()}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent/90 disabled:opacity-40"
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
      <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-3 text-sm text-canvas dark:bg-ink-dark dark:text-canvas-dark">
        {entry.text}
      </div>
    );
  }
  if (entry.kind === "assistant") {
    return (
      <div className="max-w-[90%] rounded-2xl rounded-bl-md border border-ink/8 bg-surface-raised px-4 py-3 text-sm leading-relaxed text-ink dark:border-ink-dark/10 dark:bg-surface-raised-dark dark:text-ink-dark">
        {entry.text || "…"}
      </div>
    );
  }
  if (entry.kind === "system") {
    return (
      <pre className="font-mono text-xs text-ink-faint dark:text-ink-muted-dark">
        {entry.text}
      </pre>
    );
  }
  return <p className="text-sm text-red-600 dark:text-red-400">⚠ {entry.text}</p>;
}
