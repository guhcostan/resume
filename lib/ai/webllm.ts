import type { MLCEngineInterface } from "@mlc-ai/web-llm";
import type { ChatMessage, StreamHandlers } from "@/lib/ai/types";

/**
 * In-browser models (confirmed in @mlc-ai/web-llm 0.2.84), both Qwen2.5
 * instruct variants — small but robust multilingual models (good Portuguese)
 * that follow the grounded-QA system prompt reliably; gemma3-1b was too small
 * and degenerated into loops. Thinking tags are stripped regardless.
 *
 * - full:   1.5B (~1.6 GB VRAM) for desktops.
 * - mobile: 0.5B (~0.9 GB VRAM, ~350 MB download) for phones/tablets, where
 *   the 1.5B model OOM-kills the tab and causes reload loops.
 */
export const WEBLLM_MODELS = {
  full: {
    id: "Qwen2.5-1.5B-Instruct-q4f16_1-MLC",
    label: "Qwen2.5 1.5B",
    sizeMB: 1630,
  },
  mobile: {
    id: "Qwen2.5-0.5B-Instruct-q4f16_1-MLC",
    label: "Qwen2.5 0.5B",
    sizeMB: 350,
  },
} as const;

export type WebLLMModelKey = keyof typeof WEBLLM_MODELS;

export interface InitProgress {
  text: string;
  progress: number; // 0..1
}

const enginePromises = new Map<string, Promise<MLCEngineInterface>>();

export function hasWebGPU(): boolean {
  return typeof navigator !== "undefined" && "gpu" in navigator;
}

/**
 * Lazily creates (and caches) the WebLLM engine for a model, reporting load
 * progress. Safe to call multiple times — the same load promise is reused per
 * model, so calling it on mount (to preload) and again on the first question
 * shares one download.
 */
export function getEngine(
  key: WebLLMModelKey = "full",
  onProgress?: (p: InitProgress) => void
) {
  const model = WEBLLM_MODELS[key];
  let promise = enginePromises.get(model.id);
  if (!promise) {
    promise = (async () => {
      const webllm = await import("@mlc-ai/web-llm");
      return webllm.CreateMLCEngine(model.id, {
        initProgressCallback: (report) =>
          onProgress?.({ text: report.text, progress: report.progress }),
      });
    })().catch((err) => {
      // Allow a later retry by clearing the cached (rejected) promise.
      enginePromises.delete(model.id);
      throw err;
    });
    enginePromises.set(model.id, promise);
  }
  return promise;
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
  { onToken, signal }: StreamHandlers,
  model: WebLLMModelKey = "full"
): Promise<void> {
  const engine = await getEngine(model);
  const filter = makeThinkFilter(onToken);

  const chunks = await engine.chat.completions.create({
    messages,
    stream: true,
    temperature: 0.5,
    top_p: 0.9,
    // Discourage the small model from looping/repeating itself.
    frequency_penalty: 0.5,
    presence_penalty: 0.3,
    max_tokens: 512,
  });

  for await (const chunk of chunks) {
    if (signal?.aborted) break;
    const delta = chunk.choices?.[0]?.delta?.content;
    if (delta) filter.push(delta);
  }
  filter.flush();
}
