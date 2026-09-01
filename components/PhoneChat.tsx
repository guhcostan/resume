"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { SendIcon } from "@/components/icons";

type Kind = "user" | "assistant" | "error";
interface Msg {
  kind: Kind;
  text: string;
}

/**
 * Which brain powers the chat on this device:
 * - "full":   Qwen2.5 1.5B on desktops with WebGPU.
 * - "mobile": Qwen2.5 0.5B on phones/tablets — a real LLM, just smaller, so
 *   the tab isn't OOM-killed into a reload loop by the 1.5B model.
 * - "lite":   curated instant answers when WebGPU isn't available at all.
 */
type ChatMode = "full" | "mobile" | "lite";

function detectMode(): ChatMode {
  if (!hasWebGPU()) return "lite";
  return isMobileDevice() ? "mobile" : "full";
}

const STRINGS: Record<
  Locale,
  {
    appName: string;
    onDevice: (label: string) => string;
    liteLabel: string;
    greeting: string;
    mobileNote: (label: string, mb: number) => string;
    liteNote: string;
    placeholder: string;
    loadingPlaceholder: string;
    downloadTitle: (label: string, mb: number) => string;
    downloadNote: string;
    online: string;
  }
> = {
  en: {
    appName: "Gustavo · AI",
    onDevice: (label) => `on-device · ${label}`,
    liteLabel: "lite · instant answers",
    greeting:
      "Hey! 👋 I'm Gustavo's AI agent, running entirely inside your browser — nothing leaves your device. Ask me anything about his career.",
    mobileNote: (label, mb) =>
      `📱 On mobile I use a compact model (${label}, ~${mb} MB one-time download) so everything still runs on your device. For sharper answers, try me on a desktop.`,
    liteNote:
      "⚡ This browser doesn't support WebGPU, so I answer instantly from Gustavo's profile instead of running the local model. For the full LLM in your browser, try the latest Chrome or Edge on desktop.",
    placeholder: "Ask about Gustavo…",
    loadingPlaceholder: "downloading model…",
    downloadTitle: (label, mb) =>
      `Downloading ${label} (~${mb >= 1000 ? `${(mb / 1024).toFixed(1)} GB` : `${mb} MB`}, one-time)`,
    downloadNote: "The model is cached — next visit is instant.",
    online: "online",
  },
  pt: {
    appName: "Gustavo · IA",
    onDevice: (label) => `on-device · ${label}`,
    liteLabel: "leve · respostas instantâneas",
    greeting:
      "Oi! 👋 Eu sou o agente de IA do Gustavo, rodando inteiro dentro do seu navegador — nada sai do seu dispositivo. Pergunte qualquer coisa sobre a carreira dele.",
    mobileNote: (label, mb) =>
      `📱 No celular eu uso um modelo compacto (${label}, download único de ~${mb} MB) pra continuar rodando tudo no seu aparelho. Pra respostas mais afiadas, me teste num desktop.`,
    liteNote:
      "⚡ Este navegador não suporta WebGPU, então respondo na hora a partir do perfil do Gustavo em vez de rodar o modelo local. Pro LLM completo no navegador, use o Chrome ou Edge mais recente no desktop.",
    placeholder: "Pergunte sobre o Gustavo…",
    loadingPlaceholder: "baixando o modelo…",
    downloadTitle: (label, mb) =>
      `Baixando ${label} (~${mb >= 1000 ? `${(mb / 1024).toFixed(1)} GB` : `${mb} MB`}, só uma vez)`,
    downloadNote: "O modelo fica em cache — na próxima visita é instantâneo.",
    online: "online",
  },
};

function useClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

/** Skip the automatic download when the visitor asked to save data. */
function saveDataEnabled(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as { connection?: { saveData?: boolean } }).connection;
  return conn?.saveData === true;
}

/**
 * A CSS-drawn phone running "Gustavo · AI" as a messaging app. The chat is a
 * real LLM (WebLLM/WebGPU) grounded on Gustavo's profile — the 1.5B model on
 * desktop, a 0.5B model on mobile. The download starts as soon as the page
 * opens (progress shown in-chat), so the model is ready — or well on its way —
 * by the time the visitor asks something.
 */
export function PhoneChat() {
  const { locale } = useLocale();
  const s = STRINGS[locale];
  const time = useClock();

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [modelPct, setModelPct] = useState<number | null>(null);

  // Decided after mount so server and first client render stay identical.
  // Then immediately start preloading the device-appropriate model, so the
  // download runs while the visitor is still reading the page. Preload errors
  // stay silent — asking later retries and surfaces the error in the chat.
  const [mode, setMode] = useState<ChatMode>("full");
  useEffect(() => {
    const m = detectMode();
    setMode(m);
    if (m === "lite" || saveDataEnabled()) return;

    let cancelled = false;
    const key: WebLLMModelKey = m === "mobile" ? "mobile" : "full";
    getEngine(key, (p) => {
      if (!cancelled) setModelPct(Math.round(p.progress * 100));
    })
      .then(() => {
        if (!cancelled) setModelPct(null);
      })
      .catch(() => {
        if (!cancelled) setModelPct(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const model =
    WEBLLM_MODELS[(mode === "mobile" ? "mobile" : "full") as WebLLMModelKey];

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, busy, modelPct]);

  const ask = useCallback(
    async (question: string) => {
      const text = question.trim();
      if (!text || busy) return;
      setInput("");
      setMessages((prev) => [...prev, { kind: "user", text }]);
      setBusy(true);

      let assistantIndex = -1;
      const onToken = (delta: string) => {
        setMessages((prev) => {
          const next = [...prev];
          if (assistantIndex === -1) {
            assistantIndex = next.length;
            next.push({ kind: "assistant", text: delta });
          } else if (next[assistantIndex]) {
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
          await new Promise((r) => setTimeout(r, 500));
          await streamLite(answerLite(text, locale), onToken);
          return;
        }

        const key: WebLLMModelKey = modeNow === "mobile" ? "mobile" : "full";

        // Rebuild history from the transcript (user/assistant turns only).
        const history: ChatMessage[] = [];
        for (const m of messages) {
          if (m.kind === "user") history.push({ role: "user", content: m.text });
          else if (m.kind === "assistant")
            history.push({ role: "assistant", content: m.text });
        }
        const turns: ChatMessage[] = [
          { role: "system", content: buildSystemPrompt(locale) },
          ...history,
          { role: "user", content: text },
        ];

        // First call kicks off the (cached) download; the progress callback
        // only fires while the engine is still initializing.
        await getEngine(key, (p) => setModelPct(Math.round(p.progress * 100)));
        setModelPct(null);
        await streamWebLLM(turns, { onToken }, key);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setModelPct(null);
        setMessages((prev) => [...prev, { kind: "error", text: msg }]);
      } finally {
        setBusy(false);
      }
    },
    [busy, messages, locale]
  );

  const downloading = modelPct !== null;
  const thinking = busy && !downloading;
  const lastMsg = messages[messages.length - 1];
  const streaming = thinking && lastMsg?.kind === "assistant";

  return (
    <div className="relative mx-auto w-[min(100%,340px)] rounded-[3.2rem] bg-[#141210] p-2 shadow-phone">
      {/* Side buttons */}
      <div className="absolute -left-[2px] top-28 h-10 w-[3px] rounded-l bg-slate-700" />
      <div className="absolute -left-[2px] top-40 h-10 w-[3px] rounded-l bg-slate-700" />
      <div className="absolute -right-[2px] top-32 h-16 w-[3px] rounded-r bg-slate-700" />

      {/* Screen — always dark; it's a device, not a page */}
      <div className="relative flex h-[600px] flex-col overflow-hidden rounded-[2.7rem] bg-[#0b0d14] text-slate-100">
        {/* Status bar + dynamic island */}
        <div className="relative flex items-center justify-between px-8 pt-3.5 text-[11px] font-semibold">
          <span className="w-10 whitespace-nowrap tabular-nums" suppressHydrationWarning>
            {time}
          </span>
          <div className="absolute left-1/2 top-2.5 h-[26px] w-[96px] -translate-x-1/2 rounded-full bg-black" />
          <span className="flex items-center gap-1.5" aria-hidden>
            {/* signal */}
            <svg viewBox="0 0 16 12" className="h-2.5 w-4 fill-current">
              <rect x="0" y="8" width="3" height="4" rx="0.8" />
              <rect x="4.3" y="5.5" width="3" height="6.5" rx="0.8" />
              <rect x="8.6" y="3" width="3" height="9" rx="0.8" />
              <rect x="12.9" y="0.5" width="3" height="11.5" rx="0.8" />
            </svg>
            {/* wifi */}
            <svg viewBox="0 0 16 12" className="h-3 w-4 fill-current">
              <path d="M8 10.8 5.6 8.4a3.4 3.4 0 0 1 4.8 0L8 10.8ZM3.5 6.3a6.4 6.4 0 0 1 9 0l-1.4 1.4a4.4 4.4 0 0 0-6.2 0L3.5 6.3ZM1.4 4.2a9.4 9.4 0 0 1 13.2 0l-1.4 1.4a7.4 7.4 0 0 0-10.4 0L1.4 4.2Z" />
            </svg>
            {/* battery */}
            <svg viewBox="0 0 25 12" className="h-3 w-6">
              <rect
                x="0.5"
                y="0.5"
                width="21"
                height="11"
                rx="3"
                className="fill-none stroke-current opacity-40"
              />
              <rect x="2.5" y="2.5" width="14" height="7" rx="1.6" className="fill-current" />
              <path d="M23 4v4a2.2 2.2 0 0 0 0-4Z" className="fill-current opacity-40" />
            </svg>
          </span>
        </div>

        {/* App header */}
        <div className="mt-2 flex items-center gap-3 border-b border-white/10 px-4 pb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-clay text-xs font-bold text-white">
            GC
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[13px] font-semibold">
              {s.appName}
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
            </div>
            <div className="truncate font-mono text-[10px] text-slate-400">
              {mode === "lite" ? s.liteLabel : s.onDevice(model.label)}
            </div>
          </div>
          <span className="ml-auto rounded-full bg-emerald-400/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-400">
            {s.online}
          </span>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="chat-scroll flex-1 space-y-2 overflow-y-auto px-3 py-3 text-[13px] leading-relaxed"
        >
          <Bubble kind="assistant">{s.greeting}</Bubble>

          {mode === "mobile" && (
            <Bubble kind="assistant">
              {s.mobileNote(model.label, model.sizeMB)}
            </Bubble>
          )}
          {mode === "lite" && <Bubble kind="assistant">{s.liteNote}</Bubble>}

          {messages.map((m, i) => (
            <Bubble key={i} kind={m.kind}>
              {m.text}
            </Bubble>
          ))}

          {/* Model download card */}
          {downloading && (
            <div className="mr-8 rounded-2xl rounded-bl-md bg-white/5 px-3.5 py-3">
              <div className="font-mono text-[11px] text-slate-300">
                {s.downloadTitle(model.label, model.sizeMB)} — {modelPct}%
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-clay transition-[width] duration-300"
                  style={{ width: `${modelPct}%` }}
                />
              </div>
              <div className="mt-2 text-[10px] text-slate-500">{s.downloadNote}</div>
            </div>
          )}

          {/* Typing indicator */}
          {thinking && !streaming && (
            <div className="mr-auto flex w-fit items-center gap-1 rounded-2xl rounded-bl-md bg-white/5 px-3.5 py-2.5">
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-slate-400" />
            </div>
          )}

          {/* Suggestion chips (before the first question) */}
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SUGGESTED_QUESTIONS[locale].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => void ask(q)}
                  disabled={busy}
                  className="rounded-full border border-clay/50 bg-clay/15 px-3 py-1.5 text-[11px] text-[#f0b8a0] transition-colors hover:bg-clay/30 disabled:opacity-40"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input bar */}
        <form
          className="flex items-center gap-2 border-t border-white/10 px-3 py-2.5"
          onSubmit={(e) => {
            e.preventDefault();
            void ask(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={busy}
            placeholder={downloading ? s.loadingPlaceholder : s.placeholder}
            spellCheck={false}
            autoComplete="off"
            aria-label="chat input"
            className="min-w-0 flex-1 rounded-full bg-white/5 px-4 py-2 text-[13px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-clay/70 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="send"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-clay text-white transition-opacity disabled:opacity-30"
          >
            <SendIcon className="h-4 w-4" />
          </button>
        </form>

        {/* Home indicator */}
        <div className="mx-auto mb-2 h-1 w-28 rounded-full bg-white/25" />
      </div>
    </div>
  );
}

function Bubble({ kind, children }: { kind: Kind; children: React.ReactNode }) {
  if (kind === "user") {
    return (
      <div className="ml-8 flex justify-end">
        <div className="whitespace-pre-wrap rounded-2xl rounded-br-md bg-clay px-3.5 py-2 text-white">
          {children}
        </div>
      </div>
    );
  }
  if (kind === "error") {
    return (
      <div className="mr-8 w-fit whitespace-pre-wrap rounded-2xl rounded-bl-md bg-red-400/10 px-3.5 py-2 text-red-300">
        {children}
      </div>
    );
  }
  return (
    <div className="mr-8 w-fit whitespace-pre-wrap rounded-2xl rounded-bl-md bg-white/5 px-3.5 py-2 text-slate-200">
      {children}
    </div>
  );
}
