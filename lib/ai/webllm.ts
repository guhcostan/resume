import type { MLCEngineInterface } from "@mlc-ai/web-llm";
import type { ChatMessage, StreamHandlers } from "@/lib/ai/types";

// A small instruction-tuned model that runs entirely in the browser via WebGPU.
// Weights are fetched from the MLC CDN on first use and cached by the browser.
export const WEBLLM_MODEL = "Llama-3.2-3B-Instruct-q4f16_1-MLC";

export interface InitProgress {
  text: string;
  progress: number; // 0..1
}

let enginePromise: Promise<MLCEngineInterface> | null = null;

export function hasWebGPU(): boolean {
  return typeof navigator !== "undefined" && "gpu" in navigator;
}

/** Lazily creates (and caches) the WebLLM engine, reporting load progress. */
export async function getEngine(onProgress?: (p: InitProgress) => void) {
  if (!enginePromise) {
    enginePromise = (async () => {
      const webllm = await import("@mlc-ai/web-llm");
      return webllm.CreateMLCEngine(WEBLLM_MODEL, {
        initProgressCallback: (report) =>
          onProgress?.({ text: report.text, progress: report.progress }),
      });
    })();
  }
  return enginePromise;
}

export async function streamWebLLM(
  messages: ChatMessage[],
  { onToken, signal }: StreamHandlers
): Promise<void> {
  const engine = await getEngine();
  const chunks = await engine.chat.completions.create({
    messages,
    stream: true,
    temperature: 0.4,
  });

  for await (const chunk of chunks) {
    if (signal?.aborted) break;
    const delta = chunk.choices?.[0]?.delta?.content;
    if (delta) onToken(delta);
  }
}
