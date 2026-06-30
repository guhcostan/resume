import type { MLCEngineInterface } from "@mlc-ai/web-llm";
import type { ChatMessage, StreamHandlers } from "@/lib/ai/types";

/**
 * Single in-browser model (confirmed in @mlc-ai/web-llm 0.2.84). Qwen2.5-1.5B
 * is a small but robust multilingual instruct model (great Portuguese) that
 * follows the grounded-QA system prompt reliably — gemma3-1b was too small and
 * degenerated into loops. Thinking tags are stripped regardless.
 */
export const WEBLLM_MODEL = {
  id: "Qwen2.5-1.5B-Instruct-q4f16_1-MLC",
  label: "Qwen2.5 1.5B",
  sizeMB: 1630,
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
      return webllm.CreateMLCEngine(WEBLLM_MODEL.id, {
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
