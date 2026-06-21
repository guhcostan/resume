"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocale } from "@/components/LanguageProvider";
import type { Locale } from "@/lib/content";
import type { Backend, ChatMessage } from "@/lib/ai/types";
import { buildSystemPrompt, SUGGESTED_QUESTIONS } from "@/lib/ai/profile";
import { isGroqConfigured, streamGroq } from "@/lib/ai/groq";
import {
  DEFAULT_MODEL,
  getEngine,
  hasWebGPU,
  MODELS,
  streamWebLLM,
  type ModelOption,
} from "@/lib/ai/webllm";

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
    thinking: string;
    loadingModel: (label: string, sizeGB: string, pct: number) => string;
    modelSet: (label: string, sizeGB: string) => string;
    noBackend: string;
    switchedLocal: string;
    switchedCloud: string;
    needWebGPU: string;
    needProxy: string;
    suggestionsLabel: string;
    backendCloud: string;
    backendLocal: (label: string) => string;
    help: string[];
  }
> = {
  en: {
    intro: [
      "Ask me anything about Gustavo Costa.",
      "Type a question and hit enter — or try /help for commands.",
    ],
    placeholder: "Ask about Gustavo…",
    thinking: "thinking…",
    loadingModel: (label, sizeGB, pct) =>
      `downloading ${label} (~${sizeGB} GB, one-time)… ${pct}%`,
    modelSet: (label, sizeGB) =>
      `Local model set to ${label} (~${sizeGB} GB). It downloads on your next question.`,
    noBackend:
      "No AI backend is available yet. Set up the proxy or use a WebGPU browser.",
    switchedLocal: "Switched to local model (WebLLM, in-browser).",
    switchedCloud: "Switched to cloud model (Groq).",
    needWebGPU: "This browser has no WebGPU — local model unavailable.",
    needProxy: "Cloud model not configured (no proxy URL).",
    suggestionsLabel: "try asking:",
    backendCloud: "cloud · groq",
    backendLocal: (label) => `local · ${label}`,
    help: [
      "/help            show this help",
      "/clear           clear the screen",
      "/local           run the model in your browser (WebGPU)",
      "/cloud           use the hosted model (Groq)",
      "/model           list local models",
      "/model fast      Llama 3.2 1B (~0.9 GB)",
      "/model balanced  Qwen2.5 3B (~2.5 GB, default)",
      "/model pro       Qwen3.5 4B (~3.9 GB, newest)",
      "/en /pt          switch language",
    ],
  },
  pt: {
    intro: [
      "Pergunte qualquer coisa sobre o Gustavo Costa.",
      "Escreva uma pergunta e aperte enter — ou tente /help para comandos.",
    ],
    placeholder: "Pergunte sobre o Gustavo…",
    thinking: "pensando…",
    loadingModel: (label, sizeGB, pct) =>
      `baixando ${label} (~${sizeGB} GB, uma vez)… ${pct}%`,
    modelSet: (label, sizeGB) =>
      `Modelo local definido: ${label} (~${sizeGB} GB). Ele baixa na próxima pergunta.`,
    noBackend:
      "Nenhum backend de IA disponível ainda. Configure o proxy ou use um navegador com WebGPU.",
    switchedLocal: "Mudou para o modelo local (WebLLM, no navegador).",
    switchedCloud: "Mudou para o modelo na nuvem (Groq).",
    needWebGPU: "Este navegador não tem WebGPU — modelo local indisponível.",
    needProxy: "Modelo na nuvem não configurado (sem URL do proxy).",
    suggestionsLabel: "experimente perguntar:",
    backendCloud: "nuvem · groq",
    backendLocal: (label) => `local · ${label}`,
    help: [
      "/help            mostra esta ajuda",
      "/clear           limpa a tela",
      "/local           roda o modelo no seu navegador (WebGPU)",
      "/cloud           usa o modelo hospedado (Groq)",
      "/model           lista os modelos locais",
      "/model fast      Llama 3.2 1B (~0.9 GB)",
      "/model balanced  Qwen2.5 3B (~2.5 GB, padrão)",
      "/model pro       Qwen3.5 4B (~3.9 GB, mais novo)",
      "/en /pt          troca o idioma",
    ],
  },
};

export function AiTerminal() {
  const { locale, setLocale } = useLocale();
  const s = STRINGS[locale];

  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [backend, setBackend] = useState<Backend>(
    isGroqConfigured() ? "groq" : "webllm"
  );
  const [modelPct, setModelPct] = useState<number | null>(null);
  const [modelKey, setModelKey] = useState<ModelOption["key"]>(DEFAULT_MODEL);

  const history = useRef<string[]>([]);
  const historyIdx = useRef<number>(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const webgpu = useMemo(() => hasWebGPU(), []);
  const groqOn = useMemo(() => isGroqConfigured(), []);

  const push = useCallback((entry: Entry) => {
    setEntries((prev) => [...prev, entry]);
  }, []);

  // Auto-scroll to the bottom as content streams in.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [entries, modelPct]);

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
      const usingGroq = backend === "groq" && groqOn;
      if (!usingGroq && !webgpu) {
        push({ kind: "error", text: s.noBackend });
        return;
      }

      setBusy(true);
      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;

      const messages: ChatMessage[] = [
        { role: "system", content: buildSystemPrompt(locale) },
        ...conversation(),
        { role: "user", content: question },
      ];

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

      try {
        if (usingGroq) {
          await streamGroq(messages, { onToken, signal });
        } else {
          const model = MODELS[modelKey];
          setModelPct(0);
          await getEngine(model.id, (p) =>
            setModelPct(Math.round(p.progress * 100))
          );
          setModelPct(100);
          await streamWebLLM(model.id, messages, { onToken, signal });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setEntries((prev) => {
          const next = [...prev];
          // Drop empty placeholder, show error instead.
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
    [backend, groqOn, webgpu, locale, conversation, push, s, modelKey]
  );

  const runCommand = useCallback(
    (raw: string): boolean => {
      const parts = raw.trim().toLowerCase().split(/\s+/);
      const cmd = parts[0];
      const arg = parts[1];
      if (!cmd.startsWith("/")) return false;

      const gb = (mb: number) => (mb / 1024).toFixed(1);

      switch (cmd) {
        case "/help":
          push({ kind: "system", text: s.help.join("\n") });
          return true;
        case "/clear":
          setEntries([]);
          return true;
        case "/local":
          if (!webgpu) push({ kind: "error", text: s.needWebGPU });
          else {
            setBackend("webllm");
            push({ kind: "system", text: s.switchedLocal });
          }
          return true;
        case "/cloud":
          if (!groqOn) push({ kind: "error", text: s.needProxy });
          else {
            setBackend("groq");
            push({ kind: "system", text: s.switchedCloud });
          }
          return true;
        case "/model": {
          if (arg && arg in MODELS) {
            const m = MODELS[arg as ModelOption["key"]];
            setModelKey(m.key);
            setBackend("webllm");
            push({ kind: "system", text: s.modelSet(m.label, gb(m.sizeMB)) });
          } else {
            // list available models
            const list = (Object.keys(MODELS) as ModelOption["key"][]).map(
              (k) => {
                const m = MODELS[k];
                const mark = k === modelKey ? "›" : " ";
                return `${mark} ${k.padEnd(9)} ${m.label} (~${gb(m.sizeMB)} GB)`;
              }
            );
            push({ kind: "system", text: list.join("\n") });
          }
          return true;
        }
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
    [push, s, webgpu, groqOn, setLocale, modelKey]
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
      setInput(historyIdx.current === -1 ? "" : h_at(history.current, historyIdx.current));
    }
  };

  const backendLabel =
    backend === "groq"
      ? s.backendCloud
      : s.backendLocal(MODELS[modelKey].label);

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
        <span className="ml-auto rounded bg-slate-700/50 px-2 py-0.5 font-mono text-[10px] text-slate-300">
          {backendLabel}
        </span>
      </div>

      {/* Transcript */}
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
                  className="rounded border border-slate-700 px-2 py-1 text-xs text-indigo-300 transition-colors hover:border-indigo-500 hover:bg-slate-800"
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
            {modelPct !== null && modelPct < 100 && backend === "webllm"
              ? s.loadingModel(
                  MODELS[modelKey].label,
                  (MODELS[modelKey].sizeMB / 1024).toFixed(1),
                  modelPct
                )
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
            disabled={busy}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            placeholder={s.placeholder}
            className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-600 focus:outline-none disabled:opacity-50"
            aria-label="terminal input"
          />
        </div>
      </div>
    </div>
  );
}

function h_at(arr: string[], idx: number): string {
  return arr[idx] ?? "";
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
