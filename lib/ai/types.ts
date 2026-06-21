export type Role = "system" | "user" | "assistant";

export interface ChatMessage {
  role: Role;
  content: string;
}

export type Backend = "groq" | "webllm";

export interface StreamHandlers {
  onToken: (delta: string) => void;
  signal?: AbortSignal;
}
