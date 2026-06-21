import type { ChatMessage, StreamHandlers } from "@/lib/ai/types";

/**
 * The serverless proxy URL (a Cloudflare Worker that holds the Groq API key).
 * Configured via NEXT_PUBLIC_AI_PROXY_URL at build time. When empty, the Groq
 * backend is considered unavailable and the UI falls back to WebLLM.
 */
export const PROXY_URL = process.env.NEXT_PUBLIC_AI_PROXY_URL || "";

export function isGroqConfigured(): boolean {
  return PROXY_URL.length > 0;
}

/**
 * Streams a chat completion from the proxy, which forwards to Groq with
 * `stream: true`. The proxy pipes Groq's OpenAI-style SSE response through, so
 * we parse `data: {json}` lines and emit the incremental `delta.content`.
 */
export async function streamGroq(
  messages: ChatMessage[],
  { onToken, signal }: StreamHandlers
): Promise<void> {
  const res = await fetch(PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
    signal,
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Proxy error ${res.status}${detail ? `: ${detail.slice(0, 200)}` : ""}`
    );
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const json = JSON.parse(data);
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) onToken(delta);
      } catch {
        // ignore keep-alive / partial chunks
      }
    }
  }
}
