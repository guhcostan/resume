import type { StreamHandlers } from "@/lib/ai/types";

/**
 * EXPERIMENTAL: Google AI Edge "LiteRT-LM" Web runtime (different engine from
 * @mlc-ai/web-llm). Runs Gemma 4 in the browser via WebGPU. Only the "-web"
 * .litertlm build ships the WebGPU artifacts required in the browser.
 * Docs: https://developers.google.com/edge/litert-lm/js
 *
 * Requires WebAssembly JSPI (WebAssembly.Suspending), which Safari (iOS/macOS)
 * does not implement — so this only runs on Chromium-based desktop browsers.
 */
export const LITERT_MODEL = {
  label: "Gemma 4 E2B (LiteRT-LM)",
  url: "https://huggingface.co/litert-community/gemma-4-E2B-it-litert-lm/resolve/main/gemma-4-E2B-it-web.litertlm",
};

const CDN = "https://cdn.jsdelivr.net/npm/@litert-lm/core/+esm";

// Load the ESM bundle from the CDN at runtime, hidden from webpack so the
// static build never tries to resolve/bundle the URL. Typed against the
// installed @litert-lm/core types (dev dependency).
const dynamicImport = new Function("u", "return import(u)") as (
  u: string
) => Promise<typeof import("@litert-lm/core")>;

export function hasWebGPU(): boolean {
  return typeof navigator !== "undefined" && "gpu" in navigator;
}

/** WebAssembly JSPI — required by LiteRT-LM, missing on Safari. */
export function hasJSPI(): boolean {
  return typeof WebAssembly !== "undefined" && "Suspending" in WebAssembly;
}

export interface DownloadProgress {
  loaded: number;
  total: number; // 0 when unknown
}

type Engine = Awaited<ReturnType<typeof import("@litert-lm/core").Engine.create>>;

let enginePromise: Promise<Engine> | null = null;

/**
 * Fetches the model ourselves so we can report download progress, then feeds
 * the byte stream to the engine (EngineSettings.model accepts a ReadableStream).
 */
export function getLiteRtEngine(
  onProgress?: (p: DownloadProgress) => void
): Promise<Engine> {
  if (!enginePromise) {
    enginePromise = (async () => {
      const mod = await dynamicImport(CDN);

      const res = await fetch(LITERT_MODEL.url);
      if (!res.ok || !res.body) {
        throw new Error(`Model download failed (HTTP ${res.status})`);
      }
      const total = Number(res.headers.get("Content-Length")) || 0;
      let loaded = 0;
      const reader = res.body.getReader();
      const progressStream = new ReadableStream<Uint8Array>({
        async pull(controller) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            return;
          }
          loaded += value.byteLength;
          onProgress?.({ loaded, total });
          controller.enqueue(value);
        },
        cancel(reason) {
          void reader.cancel(reason);
        },
      });

      return mod.Engine.create({ model: progressStream });
    })().catch((err) => {
      enginePromise = null;
      throw err;
    });
  }
  return enginePromise;
}

function extractText(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .filter(
        (i): i is { type: string; text: string } =>
          !!i && i.type === "text" && typeof i.text === "string"
      )
      .map((i) => i.text)
      .join("");
  }
  return "";
}

export async function streamLiteRt(
  systemPrompt: string,
  question: string,
  { onToken, signal }: StreamHandlers
): Promise<void> {
  const engine = await getLiteRtEngine();
  const chat = await engine.createConversation({
    preface: { messages: [{ role: "system", content: systemPrompt }] },
  });

  try {
    const stream = chat.sendMessageStreaming(question);
    const reader = stream.getReader();
    while (true) {
      if (signal?.aborted) {
        chat.cancel();
        break;
      }
      const { done, value } = await reader.read();
      if (done) break;
      const delta = extractText(value?.content);
      if (delta) onToken(delta);
    }
  } finally {
    await chat.delete();
  }
}
