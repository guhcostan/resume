import type { MLCEngineInterface } from "@mlc-ai/web-llm";
import type { ChatMessage, StreamHandlers } from "@/lib/ai/types";

export interface ModelOption {
  key: "fast" | "balanced" | "pro";
  id: string;
  label: string;
  sizeMB: number;
}

/**
 * Curated in-browser models (all q4f16_1, confirmed in @mlc-ai/web-llm 0.2.84).
 * `balanced` is a proven non-thinking multilingual instruct model; `pro` is the
 * newest Qwen3.5 generation. Thinking tags are stripped from output regardless.
 */
export const MODELS: Record<ModelOption["key"], ModelOption> = {
  fast: {
    key: "fast",
    id: "Llama-3.2-1B-Instruct-q4f16_1-MLC",
    label: "Llama 3.2 1B",
    sizeMB: 879,
  },
  balanced: {
    key: "balanced",
    id: "Qwen2.5-3B-Instruct-q4f16_1-MLC",
    label: "Qwen2.5 3B",
    sizeMB: 2505,
  },
  pro: {
    key: "pro",
    id: "Qwen3.5-4B-q4f16_1-MLC",
    label: "Qwen3.5 4B",
    sizeMB: 3868,
  },
};

export const DEFAULT_MODEL: ModelOption["key"] = "balanced";

export interface InitProgress {
  text: string;
  progress: number; // 0..1
}

let enginePromise: Promise<MLCEngineInterface> | null = null;
let loadedModelId: string | null = null;

export function hasWebGPU(): boolean {
  return typeof navigator !== "undefined" && "gpu" in navigator;
}

/**
 * Lazily creates (and caches) the WebLLM engine for a given model, reporting
 * load progress. Reloads if a different model is requested.
 */
export async function getEngine(
  modelId: string,
  onProgress?: (p: InitProgress) => void
) {
  if (enginePromise && loadedModelId === modelId) return enginePromise;

  loadedModelId = modelId;
  enginePromise = (async () => {
    const webllm = await import("@mlc-ai/web-llm");
    return webllm.CreateMLCEngine(modelId, {
      initProgressCallback: (report) =>
        onProgress?.({ text: report.text, progress: report.progress }),
    });
  })();
  return enginePromise;
}

/**
 * Wraps an emit callback so streamed `<think>…</think>` reasoning blocks
 * (emitted by Qwen3/Qwen3.5) are dropped. Keeps a small tail buffer so tags
 * split across chunks are still detected. Call `flush()` when the stream ends.
 */
function makeThinkFilter(emit: (s: string) => void) {
  let buf = "";
  let inThink = false;
  const OPEN = "<think>";
  const CLOSE = "</think>";

  const pump = (final: boolean) => {
    // Keep a tail so a tag straddling two chunks isn't missed mid-stream.
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
  modelId: string,
  messages: ChatMessage[],
  { onToken, signal }: StreamHandlers
): Promise<void> {
  const engine = await getEngine(modelId);
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
