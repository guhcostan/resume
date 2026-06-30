import type { MLCEngineInterface } from "@mlc-ai/web-llm";
import type { ChatMessage, StreamHandlers } from "@/lib/ai/types";

/**
 * Single in-browser model (confirmed in @mlc-ai/web-llm 0.2.84). Gemma 3 1B is
 * the lightest modern multilingual instruct model (~0.7 GB), so it can be
 * preloaded on page open without a heavy download. Thinking tags are stripped
 * from output regardless, in case a model emits them.
 */
export const WEBLLM_MODEL = {
  id: "gemma3-1b-it-q4f16_1-MLC",
  label: "Gemma 3 1B",
  sizeMB: 711,
};

export interface InitProgress {
  text: string;
  progress: number; // 0..1
}

let enginePromise: Promise<MLCEngineInterface> | null = null;

export function hasWebGPU(): boolean {
  return typeof navigator !== "undefined" && "gpu" in navigator;
}

/**
 * Lazily creates (and caches) the WebLLM engine, reporting load progress.
 * Safe to call multiple times — the same load promise is reused, so calling it
 * on mount (to preload) and again on the first question shares one download.
 */
export function getEngine(onProgress?: (p: InitProgress) => void) {
  if (!enginePromise) {
    enginePromise = (async () => {
      const webllm = await import("@mlc-ai/web-llm");
      // gemma3-1b ships with both context_window_size and sliding_window_size
      // positive, which the engine rejects. Override to use a full 4096-token
      // context window (disable sliding window) so our bio + answer fit.
      const base = webllm.prebuiltAppConfig;
      const appConfig = {
        ...base,
        model_list: base.model_list.map((m) =>
          m.model_id === WEBLLM_MODEL.id
            ? {
                ...m,
                overrides: {
                  ...(m.overrides ?? {}),
                  context_window_size: 4096,
                  sliding_window_size: -1,
                },
              }
            : m
        ),
      };
      return webllm.CreateMLCEngine(WEBLLM_MODEL.id, {
        appConfig,
        initProgressCallback: (report) =>
          onProgress?.({ text: report.text, progress: report.progress }),
      });
    })().catch((err) => {
      // Allow a later retry by clearing the cached (rejected) promise.
      enginePromise = null;
      throw err;
    });
  }
  return enginePromise;
}

/**
 * Wraps an emit callback so streamed `<think>…</think>` reasoning blocks are
 * dropped. Keeps a small tail buffer so tags split across chunks are still
 * detected. Call `flush()` when the stream ends.
 */
function makeThinkFilter(emit: (s: string) => void) {
  let buf = "";
  let inThink = false;
  const OPEN = "<think>";
  const CLOSE = "</think>";

  const pump = (final: boolean) => {
    const tail = final ? 0 : Math.max(OPEN.length, CLOSE.length);
    while (true) {
      if (!inThink) {
        const i = buf.indexOf(OPEN);
        if (i === -1) {
          const emitLen = buf.length - tail;
          if (emitLen > 0) {
            emit(buf.slice(0, emitLen));
            buf = buf.slice(emitLen);
          }
          return;
        }
        if (i > 0) emit(buf.slice(0, i));
        buf = buf.slice(i + OPEN.length);
        inThink = true;
      } else {
        const j = buf.indexOf(CLOSE);
        if (j === -1) {
          buf = final ? "" : buf.slice(Math.max(0, buf.length - tail));
          return;
        }
        buf = buf.slice(j + CLOSE.length);
        inThink = false;
      }
    }
  };

  return {
    push: (delta: string) => {
      buf += delta;
      pump(false);
    },
    flush: () => pump(true),
  };
}

export async function streamWebLLM(
  messages: ChatMessage[],
  { onToken, signal }: StreamHandlers
): Promise<void> {
  const engine = await getEngine();
  const filter = makeThinkFilter(onToken);

  const chunks = await engine.chat.completions.create({
    messages,
    stream: true,
    temperature: 0.4,
    max_tokens: 600,
  });

  for await (const chunk of chunks) {
    if (signal?.aborted) break;
    const delta = chunk.choices?.[0]?.delta?.content;
    if (delta) filter.push(delta);
  }
  filter.flush();
}
