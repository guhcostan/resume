export type Role = "system" | "user" | "assistant";

export interface ChatMessage {
  role: Role;
  content: string;
}

export interface StreamHandlers {
  onToken: (delta: string) => void;
  signal?: AbortSignal;
}
