import type { StreamHandlers } from "@/lib/ai/types";

/**
 * EXPERIMENTAL: Google AI Edge "LiteRT-LM" Web runtime (different engine from
 * @mlc-ai/web-llm). Runs Gemma 4 in the browser via WebGPU. Only the "-web"
 * .litertlm build ships the WebGPU artifacts required in the browser.
 * Docs: https://developers.google.com/edge/litert-lm/js
 */
export const LITERT_MODEL = {
  label: "Gemma 4 E2B (LiteRT-LM)",
  url: "https://huggingface.co/litert-community/gemma-4-E2B-it-litert-lm/resolve/main/gemma-4-E2B-it-web.litertlm",
};

const CDN = "https://cdn.jsdelivr.net/npm/@litert-lm/core/+esm";

// Load the ESM bundle from the CDN at runtime, hidden from webpack so the
// static build never tries to resolve/bundle the URL.
const dynamicImport = new Function("u", "return import(u)") as (
  u: string
) => Promise<{ Engine: { create: (opts: { model: string }) => Promise<LiteRtEngine> } }>;

interface LiteRtEngine {
  createConversation: () => Promise<LiteRtChat>;
}
interface LiteRtChat {
  sendMessageStreaming: (
    text: string
  ) => AsyncIterable<{ content?: { type: string; text?: string }[] }>;
}

export function hasWebGPU(): boolean {
  return typeof navigator !== "undefined" && "gpu" in navigator;
}

let enginePromise: Promise<LiteRtEngine> | null = null;

export function getLiteRtEngine(): Promise<LiteRtEngine> {
  if (!enginePromise) {
    enginePromise = (async () => {
      const mod = await dynamicImport(CDN);
      return mod.Engine.create({ model: LITERT_MODEL.url });
    })().catch((err) => {
      enginePromise = null;
      throw err;
    });
  }
  return enginePromise;
}

export async function streamLiteRt(
  prompt: string,
  { onToken, signal }: StreamHandlers
): Promise<void> {
  const engine = await getLiteRtEngine();
  const chat = await engine.createConversation();
  const stream = await chat.sendMessageStreaming(prompt);
  for await (const chunk of stream) {
    if (signal?.aborted) break;
    for (const item of chunk?.content ?? []) {
      if (item?.type === "text" && item.text) onToken(item.text);
    }
  }
}
