import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Terminal — Ask about Gustavo Costa",
  description:
    "An AI agent that runs entirely in your browser (WebLLM/WebGPU) and answers questions about Gustavo Costa's career, skills, and projects.",
};

export default function TerminalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
